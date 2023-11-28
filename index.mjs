import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';

dotenv.config();

const { GITHUB_API_TOKEN } = process.env;

const START_DATE_ISO = '2023-11-14T00:00:00Z';
const END_DATE_ISO = '2023-11-28T00:00:00Z';
const DATE_GRANULARITY = 'day';
const REPO_LINKS = [
  'https://github.com/nextui-org/nextui',
  'https://github.com/ant-design/ant-design',
  'https://github.com/mui/material-ui',
];
const DIFF_TYPE = 'total'; // 'additions', 'deletions', or 'total'

const octokit = new Octokit({
  auth: GITHUB_API_TOKEN,
});

const getDates = (startDate, endDate) => {
  const dates = [];
  for (let d = dayjs(startDate).startOf(DATE_GRANULARITY); d.isBefore(dayjs(endDate)); d = d.add(1, DATE_GRANULARITY)) {
    dates.push(d.toISOString());
  }
  return dates;
};

const getRepoName = link => link.split('/').slice(-2).join('/');

async function getRepoCommit(owner, repo, ref) {
  const { data } = await octokit.rest.repos.getCommit({
    owner,
    repo,
    ref
  });

  return data;
}

async function getRepoCommits(repo, startDate, endDate) {
  let commits = [];
  let page = 1;

  while (true) {
    const { data } = await octokit.rest.repos.listCommits({
      owner: repo.split('/')[0],
      repo: repo.split('/')[1],
      since: startDate,
      until: endDate,
      per_page: 100,
      page,
    });

    if (data.length === 0) break;

    for (let commit of data) {
      const fullCommit = await getRepoCommit(repo.split('/')[0], repo.split('/')[1], commit.sha);
      commits.push(fullCommit);
    }

    page++;
  }

  return commits;
}

async function processRepo(link) {
  const repo = getRepoName(link);
  const commits = await getRepoCommits(repo, START_DATE_ISO, END_DATE_ISO);
  const contributors = new Set(commits.map(c => c.author.login));
  const diffs = {};

  for (let commit of commits) {
    const hour = dayjs(commit.commit.author.date).startOf(DATE_GRANULARITY).toISOString();
    const diffSize = commit.stats[DIFF_TYPE];

    if (!diffs[hour]) {
      diffs[hour] = {
        count: 0,
        diff: 0
      };
    }

    if (diffs[hour]) {
      diffs[hour].count++;
      diffs[hour].diff += diffSize;
    } else {
      diffs[hour] = {
        count: 1,
        diff: diffSize
      };
    }
  }

  const result = [];
  const dates = getDates(START_DATE_ISO, END_DATE_ISO);
  for (let date of dates) {
    const avgDiff = diffs[date] ? Number((diffs[date].diff / contributors.size).toFixed(2)) : 0;
    result.push(avgDiff);
  }

  return result;
}

(async function main() {
  const labels = getDates(START_DATE_ISO, END_DATE_ISO);
  const labelsString = `window.LABELS = ${JSON.stringify(labels)};`;

  const datasets = [];
  for (const link of REPO_LINKS) {
    const repo = getRepoName(link);
    const data = await processRepo(link);
    datasets.push({
      label: repo,
      data,
    });
  }
  const datasetsString = `window.DATASETS = ${JSON.stringify(datasets)};`;

  try {
    // Read the content of index.sample.html
    const indexSampleContent = await fs.readFile('./index.sample.html', 'utf-8');

    // Replace the placeholder with the dynamic labelsString
    let modifiedContent = indexSampleContent.replace('window.LABELS = [];', labelsString);

    // Replace the placeholder with the dynamic datasetsString
    modifiedContent = modifiedContent.replace('window.DATASETS = [];', datasetsString);

    // Write the modified content to index.html
    await fs.writeFile('./index.html', modifiedContent, 'utf-8');

    console.log('index.html has been successfully updated.');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
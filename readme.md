# OSSHack Checker

---

The inspiration for this app struck during a conversation with Jan Carbonell. He rightly pointed out the challenge of ensuring the quality of hackathon projects.

In essence, the app's purpose is to ensure that hackathons focus on greenfield projects, preventing participants from bringing in pre-existing work.

### How It Works?

The script takes a list of GitHub repos, start/end dates, and date granularity. It then downloads the commit history for each specified repo, identifies the number of contributors, and calculates the average contribution pace per contributor per hour.

Once the script completes, it generates an index.html containing a chart displaying the pace for each selected repo.

### Why?

By using this app, it becomes possible to identify outliers, ensuring fair play for all participants.

### How to Run the App

* `touch .env` - Create and add your GitHub Personal Access Token as `GITHUB_API_TOKEN=` in the .env file;
* `index.mjs` - Modify the following variables in the code:
  * `START_DATE_ISO` - The start date for retrieving commits;
  * `END_DATE_ISO` - The end date (hackathon submissions deadline) for retrieving commits;
  * `DATE_GRANULARITY` - The frequency to be displayed on the chart (day, hour, minute - any dayjs granularity is valid);
  * `REPO_LINKS` - Links to the hackathon participants' repos
  * `DIFF_TYPE` - The types of changes to monitor: additions, deletions, or total (default is total).

### Demo

To try the app, ensure your `GITHUB_API_TOKEN` is configured in the .env file and run the following:

```bash
pnpm i
pnpm run generate # parses GitHub
pnpm run start # starts the web server
open http://localhost:3000 # opens the web browser with the report

```

By default, the app displays the daily breakdown of contribution pace for several popular UI component libraries:

![Demo image](https://github.com/maxprilutskiy/osshackcheck/raw/main/demo.png)

### Suggested Usage During the Hackathon

1. Participants submit their projects.
2. The projects undergo review, and the leaderboard is selected.
3. The top-selected projects are then examined using this tool, and authors may be asked clarifying questions if needed.
4. Teams found to have violated the rules (if any) are disqualified.
5. Winners are officially announced.

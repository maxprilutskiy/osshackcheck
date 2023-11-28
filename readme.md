# OSSHack Checker

---

The idea of this app came up in the conversation with Jan Carbonell,
when he rightfully pointed out, that it's problematic to control hackathon
project quality.

AKA to make sure the hackathon is being used for grienfield projects, and nobody's
taking their homework with them.

### How it works?

The script accepts a list of github repos, start / end dates, and date granularity.
After that, the script downloads the list of commits for every specified repo, retrieves
the number of contributors, and calculates average contribution pace per contributor per hour.

After the script finishes running, it generates index.html containing a chart, that shows
pace for every selected repo.

### Why?

Using this app, it's possible to spot outliers, hence to make sure everybody has the fair play
they deserve, and all participants are treated fairly.

### How to run the app

* `touch .env` - Create + add your GitHub Personal Access Token as `GITHUB_API_TOKEN=` env variable inside the .env file;
* `index.mjs` - Modify the following variables in the code:
  * `START_DATE_ISO` - The start date, from which to retrieve the commits;
  * `END_DATE_ISO` - The end date (hackathon submissions deadline?), till which to retrieve the commits;
  * `DATE_GRANULARITY` - The frequency to be displayed on the chart (day, hour, minute - any dayjs granularity is a valid value here);
  * `REPO_LINKS` - Links to the repos of the hackathon participants
  * `DIFF_TYPE` - The types of changes to monitor, additions, deletions, or total, total is used by default.

### Demo

To try the app out, make sure you've got your `GITHUB_API_TOKEN` configured inside the .env file, and run the following:

```bash
pnpm i
pnpm run generate # parses github
pnpm run start # starts the webserver
open http://localhost:3000 # opens web browser with the report
```

By default, the app displays the daily breakdown of contribution pace for several popular UI component libraries:

![Demo image](https://github.com/maxprilutskiy/osshackcheck/raw/main/demo.png)

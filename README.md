# Montana Free Press 2023 Capitol Tracker

This project is an effort to make the quantifiable aspects of the Montana Legislature more accessible to the public by compiling information about lawmakers, proposed bills and the legislative process. This is an effort of [Montana Free Press](http://montanafreepress.org/), a 501(c)(3) nonprofit newsroom that aims to provide Montanans with in-depth, nonpartisan news coverage.

A live version of this project is available at https://apps.montanafreepress.org/capitol-tracker-2023/.

The information presented here via is collected from a variety of sources including the Montana Legislature’s public roster and its official bill-tracking system, the [Legislative Automated Workflow System](http://laws.leg.mt.gov/legprd/law0203w$.startup?P_SESS=20211), or LAWS. Reporting and web design was done primarily by MTFP data reporter Eric Dietrich. Please contact him at edietrich@montanafreepress.org with bug reports, questions or suggestions.

Bill tracking data from the LAWS system is collected via a GitHub Actions-powered scraper housed in a separate repository, https://github.com/eidietrich/laws-interface.

## Project organization

- `/inputs` - Contains repositories for data pipelines that feed into the tracker
    - `/annotations` - Pulls manually crafted bill/lawmaker annotations and other custom text from a standalone [Strapi](https://strapi.io/) CMS. See https://github.com/eidietrich/backend-mtleg-2023.
    - `/coverage` - Pulls a list of stories tagged as legislative coverage from MTFP's main Wordpress CMS.
    - `/hearing-transcripts` - Pulls a list of transcripts associated with legislative hearings from OpenMontana's [Mountana State Legislature implementation](https://www.openmontana.org/montana-legislature-council-data-project/#/events) of the [Council Data Project](https://councildataproject.org/).
    - `/lawmakers` - Compiles lawmaker roster information from a variety of inputs. This data is mostly static but needs to be compiled one time for the session and updated to account for resignations, appointemnts etc.
    - `/laws` - Pulls bill, vote and other procedural data from MTFP's [LAWS Interface pipeline]( https://github.com/eidietrich/laws-interface).

- `/process` - Cleans and organizes data provided by input pipelines for presentation in the frontend app
    - main.js - Primary script
    - `/models` - Contains JS classes for each of the system's major data models.
    - `/config` - Tries to be a place to abstract out process + roster information. This could be cleaner. In general, `main.js` should crash or log a warning message if it needs something from a config file it isn't gettting.
        - `people.js` - Includes map for cleaning lawmaker name variations
        - `procedure.js` - Includes config objects for mapping specific bill actions to a form the data system can parse.
        - `overrides.js` - Place for stashing data overrides where we need to short-circuit the formal data pipelines.

- `/app` - Frontend data presentation, a [Gatsby.js](https://www.gatsbyjs.com/) app. App is rebuilt on each data update and deployed to Amazon S3 as a bundle of static HTML/CSS/JS files.
    - `/src/pages` - One-off guide pages
    - `/src/templates` - Templates for pages generated from app data (lawmakers, bills, committees)
    - `/src/data-nodes` - JSON data files that are fed into Gatsby's GraphQL database.
    - `/src/data` - JSON data files that are deliberately kept out of Gatsby's GraphQL database to make performance manageable (bill actions specifically were causing problems). Bill actions are split among multiple files to avoid exceeding Git's file size constraints.
    - `html.js` - Custom HTML template so app pages are properly integrated with MTFP's Parsley analytics system.
    
- `.github/workflows` - GitHub actions scripts. Primary update/rebuild/deploy script is `main.yml`.


## Commands


## References
- Deploying via GH Actions: https://www.alexhyett.com/github-actions-deploy-to-s3/
- Cross-repo GH workflow coordination: https://utensils.io/articles/trigger-github-actions-from-another-repo


### References
Deploying via GH Actions: https://www.alexhyett.com/github-actions-deploy-to-s3/
Cross-repo workflow coordination: https://utensils.io/articles/trigger-github-actions-from-another-repo



### TODO

inputs
- link to laws-interfact
- Add link to capitol-tracker-23-cms Strapi CMS. Start locally, deploy to AWS early.
    - Data structures for things we'll expect to edit during session. Limit to config files otherwise.
        - bills (optional annotations)
        - lawmakers?
        - legal notes
        - veto memos
- Generate static legislative data --> /lawmakers

process
- replicate data workflow
- Work out how to deploy (use GH actions for build step?)
- specifics
    - Vote
        - Write vote classification logic (e.g., simple majority)

app
- verify emotion is working as intended
- Replicate 2023 functionality
 - Add extra functionality
- add Parsely integration from Election Guide
- Add GTag from Nate - `G-179R4DKQFZ`
- add MTFP config/styles from election guide
- copy over components
- Add in meta stuff / fix SEO component

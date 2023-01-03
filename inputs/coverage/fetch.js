import fetch from 'node-fetch'
import { writeJson } from '../../utils/functions.js'

// const TAG = "2021-legislature" // Replace spaces in tag as seen in CMS with hyphens here
const TAG = '2023-legislature'
const EXCLUDE_TAG = 'Tracker Exclude'
const QUERY_LIMIT = 1000
const OUT_PATH = './inputs/coverage/articles.json'

async function getStories(cursor) {

  const stories = fetch('https://montanafreepress.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
            {
            posts(after: "${cursor}",first: ${QUERY_LIMIT}, where: {tag: "${TAG}"}) {
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                }
                nodes {
                    title
                    date
                    link
                    status
                    tags(first: 100) {
                      nodes {
                        name
                      }
                    }
                    categories(first: 100) {
                      nodes {
                        name
                      }
                    }
                    featuredImage {
                      node {
                        link
                      }
                    }
                    author {
                      node {
                        name
                      }
                    }
                    excerpt
                  }
            }
        }
        `,
    }),
  })
    .then(res => res.json())
    .then(json => json.data)
    .catch(err => console.log(err))

  return stories
}

async function main() {
  console.log(`### Fetching stories from MTFP CMS`)
  let stories = []
  let hasNextPage = true
  let cursor = ""
  while (hasNextPage) {
    const query = await getStories(cursor)
    stories = stories.concat(query.posts.nodes)
    cursor = query.posts.pageInfo.endCursor
    hasNextPage = query.posts.pageInfo.hasNextPage
  }
  const filtered = stories
    .filter(d => !d.tags.nodes.map(t => t.name).includes(EXCLUDE_TAG))
    .filter(d => d.status === 'publish')
  console.log(`    Found ${filtered.length} MTFP stories tagged "${TAG}", excluding tag "${EXCLUDE_TAG}"`)

  writeJson(OUT_PATH, filtered)
}
main()
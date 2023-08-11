import { NextResponse } from 'next/server'

const query = `#graphql
query GetStarredRepositories($username: String!, $cursor: String) {
  user(login: $username) {
    starredRepositories(first: 1, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        starredAt
        node {
          name
          pushedAt
          owner {
              avatarUrl
              login
          }
          url
          homepageUrl
          description
          forkCount
          stargazerCount
          primaryLanguage {
              name
              color
          }
          allowUpdateBranch
          isArchived
          isTemplate
          licenseInfo {
              name
          }
        }
      }
    }
  }
}
`;

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables: {
          username: 'antfu'
        },
      })
    })

    const data = await res.json()

    if (data?.errors) {
      return NextResponse.json({ errors: data.errors }, { status: 500 })
    }

    return NextResponse.json({
      state: 'success',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error }, 
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'

const query = `#graphql
query GetStarredRepositories($username: String!, $cursor: String) {
  user(login: $username) {
    starredRepositories(first: 30, after: $cursor, orderBy: {direction: DESC, field: STARRED_AT}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        starredAt
        node {
          name
          nameWithOwner
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

    const formatedData = data?.data?.user?.starredRepositories?.edges.map((edge: any) => {
      return {
        login: 'login',
        repo: edge.node?.name,
        forkCount: edge.node?.forkCount,
        description: edge.node?.description,
        homepageUrl: edge.node?.homepageUrl,
        isArchived: edge.node?.isArchived,
        isTemplate: edge.node?.isTemplate,
        license: edge.node.licenseInfo?.name,
        owner: edge.node.owner?.login,
        ownerAvatarUrl: edge.node.owner.avatarUrl,
        language: edge.node.primaryLanguage?.name,
        languageColor: edge.node.primaryLanguage?.color,
        stargazerCount: edge.node?.stargazerCount,
        pushedAt: edge.node?.pushedAt,
        starAt: edge?.starredAt
      }
    })

    return NextResponse.json({
      state: 'success',
      data: formatedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error }, 
      { status: 500 }
    )
  }
}

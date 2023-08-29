import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

const query = `#graphql
query GetStarredRepositories($username: String!, $cursor: String) {
  user(login: $username) {
    starredRepositories(first: 100, after: $cursor, orderBy: {direction: DESC, field: STARRED_AT}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        starredAt
        node {
          name
          nameWithOwner
          updatedAt
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

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url)
    const username = pathname.split('/')[4]
    const cursor = pathname.split('/')[5] || ''
    if (!username) {
      return NextResponse.json({ errors: 'username is required' }, { status: 500 })
    }
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
          username,
          cursor,
        },
      })
    })

    const data = await res.json()

    if (data?.errors) {
      return NextResponse.json({ errors: data.errors }, { status: 500 })
    }

    const formatedStars = data?.data?.user?.starredRepositories?.edges.map((edge: any) => {
      return {
        id: username + edge.node.owner?.login + edge.node.name,
        login: username,
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
        updatedAt: edge.node?.updatedAt,
        starAt: dayjs(edge?.starredAt).unix()
      }
    })

    const pageInfo = data?.data?.user?.starredRepositories?.pageInfo

    return new Response(JSON.stringify({
      state: 'success',
      data: {
        stars: formatedStars,
        pageInfo
      },
    }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400',
          'CDN-Cache-Control': 'public, s-maxage=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=86400',
        },
      })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error },
      { status: 500 }
    )
  }
}

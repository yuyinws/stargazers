import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
export const dynamic = 'force-dynamic'

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


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    if (!username) {
      return NextResponse.json({ errors: 'username is required' }, { status: 500 })
    }

    const stars:any[] = []
    let fetchCounter = 0

    const getStars = async(cursor: string): Promise<void | NextResponse> => {
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
            cursor
          },
        })
      })
  
      const data = await res.json()

      if (data?.errors) {
        return NextResponse.json({ errors: data.errors }, { status: 500 })
      }

      const formatedData = data?.data?.user?.starredRepositories?.edges.map((edge: any) => {
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
          starAt: dayjs(edge?.starredAt).unix()
        }
      })

      stars.push(...formatedData)

      const pageInfo = data?.data?.user?.starredRepositories?.pageInfo

      if (pageInfo?.hasNextPage && fetchCounter < 50) {
        fetchCounter++
        await getStars(pageInfo.endCursor)
      }
    }

    await getStars('')

    return NextResponse.json({
      state: 'success',
      data: stars,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error }, 
      { status: 500 }
    )
  }
}

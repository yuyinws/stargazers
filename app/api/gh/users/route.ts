import { NextResponse } from 'next/server'

const query = `#graphql
query GetUsers($query: String!) {
  search(type: USER,query: $query,first: 10) {
    nodes {
      ... on User {
        login
        id
        avatarUrl
      }
    }
  }
}
`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
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
        query: name
      },
    })
  })

  const data = await res.json()

  return NextResponse.json({
    state: 'success',
    data,
  })
}

import { NextResponse } from 'next/server'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const { access_token } = await tokenResponse.json()

    const loginUrl = new URL('/login', request.url)

    loginUrl.searchParams.set('access_token', access_token)

    return NextResponse.redirect(loginUrl)

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error })
  }
}

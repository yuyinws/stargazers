import { NextResponse } from 'next/server'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const access_token = searchParams.get('access_token')

    const userResponse = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    })

    const user = await userResponse.json()

    return NextResponse.json({
      state: 'success',
      user
    })

  } catch (error) {
    return NextResponse.json({
      state: 'error',
      error
    })
  }
}

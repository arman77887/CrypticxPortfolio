import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Password is required.' },
        { status: 400 }
      );
    }

    const correctPassword = process.env.CYBER_SECURITY_PASSWORD;

    if (!correctPassword) {
      console.error('CYBER_SECURITY_PASSWORD is not configured.');

      return NextResponse.json(
        { success: false, message: 'Protected area is not configured.' },
        { status: 500 }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      experience: {
        title: 'Cyber Security',
        description:
          'Cyber Security experience and private professional details.',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request.' },
      { status: 400 }
    );
  }
}

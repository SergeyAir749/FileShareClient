import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(
    request: NextRequest,
)  {

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    try {

        if (apiUrl != undefined) {

            const response = await axios.post(apiUrl + '/api/account/recovering', body, { 
                withCredentials: true,        
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const headers = new Headers([
                ['Set-Cookie', `token=${response.data.token}; HttpOnly; Secure; SameSite=Lax; Path=/`]
            ])
            
            const res = new Response(JSON.stringify(response.data), {
                headers: headers
            });
        
            return res;
        } else {
            return NextResponse.json(
                { error: "сouldNotFindTheServerURL" },
                { status: 400 }
            );
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.msg || error.message;

        console.log(error.response);
        console.log(message);
        
        if (message == 'invalid token') {
            return NextResponse.json({ error: 'UnableToSignInToTheAccount'}, { status });
        } else if (message == 'emailNotVerified') {
            
            const headers = new Headers([
                ['Set-Cookie', `token=${error.response?.data?.token}; HttpOnly; Secure; SameSite=Lax; Path=/`]
            ])
            
            const res = NextResponse.json({ error: message }, { status: 400, headers: headers })

            console.log('emailNotVerified');
            
            return res

        } else {
            return NextResponse.json({ error: message }, { status });
        }

    }
}
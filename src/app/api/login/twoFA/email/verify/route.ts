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

            const response = await axios.post(apiUrl + '/api/login/twoFA/email/verify', body, { 
                withCredentials: true 
            });

            console.log(JSON.stringify(response.headers));
            
            const headers = new Headers([])

            const cookie = response.headers['set-cookie']

            if (cookie != undefined) {

                for (let i = 0; i < cookie.length; i++) {
                    const element = cookie[i];
                    console.log(['Set-Cookie', element]);
                    headers.append('Set-Cookie', element)
                }
            }

            console.log(JSON.stringify(response.data));

            const res = new NextResponse(JSON.stringify(response.data), {
                headers: headers
            })
        
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

        console.log('\n');
        console.log('=======================');
        console.log(error.response);
        console.log(message);
        console.log('=======================');
        console.log('\n');
        
        if (message == 'emailNotVerified') {
            const headers = new Headers([])

            const cookie = error.response.headers['set-cookie']

            if (cookie != undefined) {

                for (let i = 0; i < cookie.length; i++) {
                    const element = cookie[i];
                    console.log(['Set-Cookie', element]);
                    headers.append('Set-Cookie', element)
                }
            }

            return NextResponse.json({ error: message }, { status, headers: headers });
        } else {
            return NextResponse.json({ error: message }, { status });
        }
    }
}
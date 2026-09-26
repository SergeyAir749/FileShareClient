import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';


export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ shareId: string }> }
) {
    // Получаем shareId из параметров URL
    const { shareId } = await params;
    
    // Достаем токен из кук на сервере
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;

    try {

        const formData = await request.formData();

        const fileApiUrl = process.env.NEXT_PUBLIC_SERVER_FILE_API_URL

        const response = await axios.post(`${fileApiUrl}/api/fileLoad/${shareId}`, formData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        const status = error.response?.status || 500;
        const message = error.response?.data?.msg || error.message;
        return NextResponse.json({ error: message }, { status });
    }
}
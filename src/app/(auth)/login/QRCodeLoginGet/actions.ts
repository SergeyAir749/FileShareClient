'use server'

import axios from "axios";
import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;


export const setCookieQRCOdeLoginServer = async (value: string) => {
    const isProduction = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'production';
    const cookiesStore = await cookies();

    cookiesStore.set({
        name: 'token',
        value: value,
        httpOnly: true, 
        secure: isProduction,
        maxAge: 60 * 60 * 24 * 30, 
        path: '/',  
    })
}

export const getQRCodeImgServer = async (QRCodeRoomID: string) => {
    try {
        const response = await axios.get(`${apiUrl}/api/getQRCodeImgForLogin?roomCode=${QRCodeRoomID}`);
        console.log(response);
        return response.data
    } catch (error) {

        console.log(error);

        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            //console.log(serverMessage);

            if (serverMessage.response?.data?.msg != undefined) {
                console.log(serverMessage.response?.data?.msg);
                throw new Error(serverMessage.response?.data?.msg);
            } else {
                console.log(serverMessage.message);
                throw new Error(serverMessage.message);
            }
        }
    }
};

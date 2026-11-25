'use server'

import axios from "axios";
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const submitChangeUserPasswordServer = async (userUpData: object) => {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    try {
        const response = await axios.put(apiUrl + '/api/change/password', userUpData, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            //console.log(serverMessage);

            // if (serverMessage.response?.data?.msg != undefined) {
            //     console.log(serverMessage.response?.data?.msg);
            //     throw new Error(serverMessage.response?.data?.msg);
            // } else {
            //     console.log(serverMessage.message);
            //     throw new Error(serverMessage.message);
            // }

            if (serverMessage.response?.data?.msg != undefined) {
                console.log("error:", serverMessage.response?.data?.msg);
                return {status: false, msg: serverMessage.response?.data?.msg};
            } else {
                // throw new Error(serverMessage.message);
                return {status: false, msg: serverMessage.message};
            }
        }
    }
};
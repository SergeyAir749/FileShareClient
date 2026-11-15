'use server'

import axios from "axios";
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const submitTwoFactorAuthVerificationServer = async (obj: object) => {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    try {
        const response = await axios.post(
            apiUrl + '/api/account/twoFactorAuth/session',
            obj,

            {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

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
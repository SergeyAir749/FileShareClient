'use server'

import { cookieSetFunServer } from "@/components/cookieSetFun";
import axios from "axios";
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const submitUpdateGuesOnUserFunServer = async (signUpUserDataParse: object) => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        const response = await axios.post(apiUrl + '/api/guest/update', signUpUserDataParse, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        cookiesStore.delete('recoveringGuestToken')
        
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

export const signUpServer = async (userData: object) => {
    try {
        const response = await axios.post(apiUrl + '/api/signup', userData, { withCredentials: true });
        console.log(response.headers);

        // const cookiesStore = await cookies();

        // const rawCookies = response.headers['set-cookie'];
        
        // await cookieSetFunServer(rawCookies)
        
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
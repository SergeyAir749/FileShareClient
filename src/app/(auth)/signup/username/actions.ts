'use server'

import { cookieSetFunServer } from "@/components/cookieSetFun";
import axios from "axios";
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

interface cookiesResponseObjTypes {
    name: string,
    value: string,
    maxAge: string,
    httpOnly: boolean,
    SameSite: string,
    path: string,
    secure: boolean,
}

export const isGuestFunServer = async () => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        const response = await axios.get(apiUrl + '/api/user/isguest', {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(response.data);
        
        
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

        const cookiesStore = await cookies();

        const rawCookies = response.headers['set-cookie'];
        
        // if (rawCookies != undefined) {
        //     for (let i = 0; i != rawCookies.length; i++) {
                
        //         // eslint-disable-next-line prefer-const
        //         let cookiesResponseObj:cookiesResponseObjTypes = {
        //             name: '',
        //             value: '',
        //             maxAge: '',
        //             httpOnly: false,
        //             SameSite: '',
        //             path: '',
        //             secure: false,
        //         }
                
        //         const rawCookiesTemp = rawCookies[i].split(';').map(part => part.trim());

        //         const [cookieName, cookieValue] = rawCookiesTemp[0].split('=');

        //         cookiesResponseObj['name'] = cookieName
        //         cookiesResponseObj['value'] = cookieValue
    
        //         if (rawCookies[i].includes('HttpOnly')) {
        //             cookiesResponseObj['httpOnly'] = true
        //         }

        //         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        //         cookiesResponseObj['secure'] = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'production',
    
        //         cookiesResponseObj['maxAge'] = rawCookiesTemp[1].split('=')[1]
        //         cookiesResponseObj['path'] = rawCookiesTemp[2].split('=')[1]                
        //         cookiesResponseObj['SameSite'] = rawCookiesTemp[5].split('=')[1]
    
                
        //         console.log(cookiesResponseObj);
        //         cookiesStore.set(cookiesResponseObj)

        //     }
            
        // }

        await cookieSetFunServer(rawCookies)
        
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




export const isUserInDBServer = async (userData: object) => {
    try {
        const response = await axios.post(apiUrl + '/api/user/isTheUserInDB', userData);
        console.log(response.headers);


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
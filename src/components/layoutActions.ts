'use server'

import { cookies } from 'next/headers';
import axios from "axios";
import { cookieSetFunServer } from './cookieSetFun';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

//token: string

export const getUserDataServer = async () => {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    let lang = cookiesStore.get('language')?.value;

    if (lang == undefined) {
        lang = 'ru';
    }

    try {
        const response = await axios.get(apiUrl + `/api/getUserData`, {
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data
    } catch (error) {

        console.log(error);
        
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            if (serverMessage.response?.data?.msg != undefined) {
                console.log(serverMessage.response?.data?.msg);
                // if (serverMessage.response?.data?.msg == 'invalid token') {
                //     throw new Error('Не удалось войти в аккаунт');
                // } else if (serverMessage.response?.data?.msg == 'Почта не верифицирована') {
                //     throw new Error('Почта не верифицирована');
                // } else if (serverMessage.response?.data?.msg == 'Что-то пошло не так') {
                //     throw new Error('Что-то пошло не так');
                // } else if (serverMessage.response?.data?.msg == 'Аккаунт удалён') {
                //     throw new Error('Аккаунт удалён');
                // }

                if (serverMessage.response?.data?.msg == 'invalid token') {
                    throw new Error('UnableToSignInToTheAccount');
                } else {
                    throw new Error(serverMessage.response?.data?.msg);
                }

            } else {
                throw new Error(serverMessage.message);
            }
        }
    }
};

export const signupGuestServer = async () => {
    try {
        const response = await axios.post(apiUrl + '/api/signup/guest', {}, { withCredentials: true });
        console.log(response.headers);

        const cookiesStore = await cookies();

        const rawCookies = response.headers['set-cookie'];

        console.log('===========================================')
        console.log(rawCookies)
        console.log('===========================================')
        
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

//  console.log(error);
//                 if (axios.isAxiosError(error)) {
//                     const serverMessage = error;
//                     //console.log(serverMessage);

//                     if (serverMessage.response?.data?.msg != undefined) {
//                         console.log(serverMessage.response?.data?.msg);

//                         if (serverMessage.response?.data?.msg == 'invalid token') {
//                             // || serverMessage.response?.data?.msg == "Что-то пошло не так"
//                             signupGuest();

//                             // Если сервер выключен через какой-то токены перестают быть действительными
//                             // и так как после включения сервер перестает понимать токены
//                             // от обычных аккаунтов и от гостевых (я не предумал решения лучше чем просто создовать новый гостевай аккаунт)
//                         } else if (serverMessage.response?.data?.msg == 'Почта не верифицирована') {
//                             router.push('/signup/email/verification');
//                         } else if (serverMessage.response?.data?.msg == 'Что-то пошло не так') {
//                             signupGuest();
//                         }
//                     } else {
//                         console.log(serverMessage.message);

//                         if (serverMessage.message == 'Network Error') {
//                             router.push('/login');
//                         }
//                     }
//                 }
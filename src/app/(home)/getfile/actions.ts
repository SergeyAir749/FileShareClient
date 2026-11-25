'use server'

import axios from "axios";
import { cookies } from 'next/headers';

const fileApiUrl = process.env.NEXT_PUBLIC_SERVER_FILE_API_URL;



export const fileAcceptFunServer = async (shareId: string, fileId: string) => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        //Получает файл преоброзует его споиащю блоб и создаёт ссылку

        const response = await axios.post(
            fileApiUrl + `/api/get/download/file/${shareId}/${fileId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response.data);
        return response.data

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            console.log(serverMessage);

            if (serverMessage.response?.data?.msg != undefined) {
                // throw new Error(serverMessage.response?.data?.msg);
                return {status: false, msg: serverMessage.response?.data?.msg};
            } else {
                // throw new Error(serverMessage.message);
                return {status: false, msg: serverMessage.message};
            }
        }
    }

};



export const textCopyFunServer = async (shareId: string, fileId: string) => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        //Получает файл преоброзует его споиащю блоб и создаёт ссылку

        const response = await axios.post(
            fileApiUrl + `/api/get/download/text/${shareId}/${fileId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });
        console.log(response.data);
        return response.data

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            console.log(serverMessage);

            if (serverMessage.response?.data?.msg != undefined) {
                // throw new Error(serverMessage.response?.data?.msg);
                return {status: false, msg: serverMessage.response?.data?.msg};
            } else {
                // throw new Error(serverMessage.message);
                return {status: false, msg: serverMessage.message};
            }
        }
    }

};



export const allFilesCancelFunServer = async (shareId: string) => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;
        
        //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

        const response = await axios.post(
            fileApiUrl + '/api/files/cancel/' + shareId,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.data);
        return response.data

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            console.log(serverMessage);

            if (serverMessage.response?.data?.msg != undefined) {
                // throw new Error(serverMessage.response?.data?.msg);
                return {status: false, msg: serverMessage.response?.data?.msg};
            } else {
                // throw new Error(serverMessage.message);
                return {status: false, msg: serverMessage.message};
            }
        }
    }

};



export const fileCancelFunServer = async (shareId: string, fileId: string) => {
    try {

        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

        const response = await axios.post(
            fileApiUrl + '/api/files/cancel/' + shareId + '/' + fileId,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            }
        );

        console.log('response:',response.data);
        return response.data

    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
            console.log(serverMessage);

            if (serverMessage.response?.data?.msg != undefined) {
                // throw new Error(serverMessage.response?.data?.msg);
                return {status: false, msg: serverMessage.response?.data?.msg};
            } else {
                // throw new Error(serverMessage.message);
                return {status: false, msg: serverMessage.message};
            }
        }
    }

};




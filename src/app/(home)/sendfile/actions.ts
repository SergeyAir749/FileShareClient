'use server'

import axios from "axios";
import { cookies } from 'next/headers';

const fileApiUrl = process.env.NEXT_PUBLIC_SERVER_FILE_API_URL;

export const valueShareIdServer = async (valueShareId: string) => {
    // const value = e.target.value;

    try {
        const response = await axios.get(fileApiUrl + '/api/getUserDataById/' + valueShareId);
        console.log("response:", response);
        return response.data
    } catch (error) {

        console.log(error);
        
        if (axios.isAxiosError(error)) {
            const serverMessage = error;
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
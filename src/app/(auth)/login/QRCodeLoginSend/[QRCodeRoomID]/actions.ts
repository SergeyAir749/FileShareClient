'use server'

import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

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

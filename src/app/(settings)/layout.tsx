'use client';
import Link from 'next/link';

import '@/style/global.css';
import styleLayout from '@/style/layout.settings.module.css';
import { useAppSelector, useAppDispatch } from '@/components/hooks';
import { useEffect, useState } from 'react';
import SettingsNav from '@/app/(settings)/settings/SettingsNav';

// import { useTranslation } from "react-i18next";
// import i18nextCF from "translations/i18n.client";

import { setAuth, setUserData } from '@/festures/authSlice';
import axios from 'axios';

import Cookies from 'js-cookie';

import { useRouter } from 'next/navigation';
import { getUserDataServer, signupGuestServer } from '@/components/layoutActions';
import { setThemeFun } from '@/components/layoutActionsClient';
import { Loading } from '@/components/loader';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { userData } = useAppSelector((state) => state.authReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // const searchParams = useSearchParams();
    //useSearchParams Error

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    // useEffect(() => {
    //     const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     localStorage.setItem('timeZone', systemTimeZone);
    // }, []);

    setThemeFun();

    useEffect(() => {
        const token = localStorage?.getItem('token');

        const signupGuest = async () => {
            // const data = await signupGuestServer();
            const response = await axios.post('/api/signup/guest', {}, { withCredentials: true });
            console.log(response);

            // localStorage.setItem('token', response.data.token);
            // localStorage.setItem('recoveringGuestToken', response.data.token);
            window.location.reload();
        };

        const getUserData = async () => {
            try {
                const response = await axios.get('/api/getUserData');
                dispatch(setUserData(response.data));
                dispatch(setAuth());
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const serverMessage = error.response.data.error;
                console.log(error);

                // if (serverMessage == 'Не удалось войти в аккаунт') {
                //     signupGuest();
                // } else if (serverMessage == 'Почта не верифицирована') {
                //     router.push('/signup/email/verification');
                // } else if (serverMessage == 'Что-то пошло не так') {
                //     signupGuest();
                // } else if (serverMessage == 'Аккаунт удалён') {
                //     signupGuest();
                // } else {
                //     console.log(serverMessage);
                // }

                console.log(serverMessage == 'UnableToSignInToTheAccount');

                if (serverMessage == 'UnableToSignInToTheAccount') {
                    signupGuest();

                    // Если сервер выключен через какой-то время токены перестают быть действительными
                    // и так как после включения сервер перестает понимать токены
                    // от обычных аккаунтов и от гостевых (я не предумал решения лучше чем просто создовать новый гостевай аккаунт)
                } else if (serverMessage == 'emailNotVerified') {
                    router.push('/signup/email/verification');
                } else if (serverMessage == 'somethingWentWrong') {
                    signupGuest();
                } else if (serverMessage == 'accountDeleted') {
                    signupGuest();
                } else {
                    console.log(serverMessage);
                }
            }
        };

        getUserData();
    }, []);

    return (
        <div className={styleLayout.settingsLayout}>
            <div className={styleLayout.settingsLayoutBlock}>
                <div className={styleLayout.settingsLayoutNavBlock}>
                    <SettingsNav />
                </div>

                <div className={styleLayout.settingsLayoutMainBlock}>{children}</div>
            </div>

            {userData == null ? (
                <div className={styleLayout.userDataLoaderBackground}>
                    <div className={styleLayout.userDataLoader}>
                        <Loading />
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

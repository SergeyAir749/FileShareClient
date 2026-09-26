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
                        <svg
                            width="60"
                            height="60"
                            className={styleLayout.userDataLoaderImg}
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_223_516)">
                                <circle cx="25" cy="25" r="22.5" stroke="var(--color-blue-900)" strokeWidth="5" />
                                <path
                                    d="M34.5524 45.3716C35.1386 46.6217 34.6033 48.1232 33.3009 48.5817C29.1743 50.0343 24.7234 50.3834 20.3948 49.5722C15.2442 48.6069 10.5271 46.0475 6.91016 42.2557C3.29318 38.4638 0.959162 33.6313 0.237921 28.4408C-0.368215 24.0788 0.19048 19.6493 1.83617 15.5958C2.35556 14.3165 3.88066 13.8527 5.10172 14.4972V14.4972C6.32277 15.1417 6.77389 16.6504 6.28665 17.9423C5.1119 21.0571 4.72854 24.4293 5.19034 27.7527C5.76733 31.905 7.63454 35.7711 10.5281 38.8045C13.4217 41.838 17.1954 43.8855 21.3159 44.6578C24.6137 45.2758 28.0003 45.052 31.1671 44.0255C32.4805 43.5997 33.9662 44.1215 34.5524 45.3716V45.3716Z"
                                    fill="var(--color-blue-300)"
                                />
                            </g>

                            <defs>
                                <clipPath id="clip0_223_516">
                                    <rect width="50" height="50" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

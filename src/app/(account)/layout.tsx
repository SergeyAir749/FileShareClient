'use client';

import '@/style/global.css';
import styleLayout from '@/style/layout.account.module.css';
import { useAppSelector, useAppDispatch } from '@/components/hooks';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import AccessDeniedAccount from './accessDeniedAccount';

import { setAuth, setUserData } from '@/festures/authSlice';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { getUserDataServer, signupGuestServer } from '@/components/layoutActions';
import { setThemeFun } from '@/components/layoutActionsClient';
import { Loading } from '@/components/loader';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isAuth, userData } = useAppSelector((state) => state.authReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const searchParams = useSearchParams();

    //useSearchParams Error

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const intl = useIntl();

    console.log(intl.locale);

    useEffect(() => {
        //console.log(isAuth);
    }, [isAuth]);

    //console.log(router);

    setThemeFun();

    useEffect(() => {
        const signupGuest = async () => {
            // const data = await signupGuestServer();
            const response = await axios.post('/api/signup/guest', {}, { withCredentials: true });
            console.log(response);

            // localStorage.setItem('token', response.data.token);
            // localStorage.setItem('recoveringGuestToken', response.data.token);
            router.push('/sendfile');
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

                // if (location.pathname != '/delete/successfully') {
                //     signupGuest();
                // } else if (serverMessage == 'Не удалось войти в аккаунт') {
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

    // useEffect(() => {
    //     const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     localStorage.setItem('timeZone', systemTimeZone);
    // }, []);

    if (userData != null) {
        //console.log(userData?.isGuest == undefined);

        if (userData?.isGuest == undefined) {
            return <div className={styleLayout.accountLayout}>{children}</div>;
        } else if (userData?.isGuest == true) {
            return <AccessDeniedAccount />;
        }
    } else {
        return (
            <div className={styleLayout.accountLayout}>
                {userData == null ? (
                    <div className={styleLayout.userDataLoaderBackground}>
                        <div className={styleLayout.userDataLoader}>
                            {/* <img src={'./loader.svg'} className={style.userDataLoaderImg} alt="Загрузка..." /> */}
                            <Loading />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}

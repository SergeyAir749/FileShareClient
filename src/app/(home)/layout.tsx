'use client';
import Link from 'next/link';

// import '@/style/global.css';
import style from '@/style/layout.home.module.css';
import { useAppSelector, useAppDispatch } from '@/components/hooks';
import { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

// import { useTranslation } from "react-i18next";
// import i18nextCF from "translations/i18n.client";

import { setAuth, setUserData } from '@/festures/authSlice';
import axios from 'axios';

import { useRouter } from 'next/navigation';

import { getUserDataServer, signupGuestServer } from '@/components/layoutActions';
import { useTheme } from 'next-themes';
import { setThemeFun } from '@/components/layoutActionsClient';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const { isAuth, userData } = useAppSelector((state) => state.authReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const intl = useIntl();

    // исправить прблему с кликом на Link

    // const searchParams = useSearchParams();
    //useSearchParams Error

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    // useEffect(() => {
    //     const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     localStorage.setItem('timeZone', systemTimeZone);
    // }, []);

    setThemeFun();

    useEffect(() => {
        // const token = localStorage?.getItem('token');

        const signupGuest = async () => {
            // const data = await signupGuestServer();
            const response = await axios.post('/api/signup/guest', {}, { withCredentials: true });
            console.log(response);

            // const response = await axios.post(apiUrl + '/api/signup/guest');
            // localStorage.setItem('token', response.data.token);
            // localStorage.setItem('recoveringGuestToken', response.data.token);
            window.location.reload();
        };

        const getUserData = async () => {
            try {
                //console.log('Response:', response.data);

                // if (token != null) {
                const response = await axios.get('/api/getUserData');

                console.log(response);

                dispatch(setUserData(response.data));
                dispatch(setAuth());
                // }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const serverMessage = error.response.data.error || error.message;
                console.log(error);
                // console.log('Client caught error:', error.message);

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

    return (
        <div className={style.home}>
            <header className={style.header}>
                <Link href={'/sendfile'} className={style.headerHomeLink}>
                    <div className={style.headerTitle}>
                        <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.6577 21.1413L19.0711 21.7279C18.29 22.509 18.29 23.7753 19.0711 24.5563L19.656 25.1413H54.9996C56.1042 25.1413 56.9996 24.2459 56.9996 23.1413C56.9996 22.0367 56.1042 21.1413 54.9996 21.1413H19.6577Z"
                                fill="#008CFF"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.0711 24.5563C18.29 23.7753 18.29 22.509 19.0711 21.7279L19.6577 21.1413L27.5563 13.2426C28.3374 12.4616 28.3374 11.1953 27.5564 10.4142C26.7753 9.63317 25.509 9.63316 24.7279 10.4142L14.8284 20.3137L13.4142 21.7279C12.6332 22.509 12.6332 23.7753 13.4142 24.5563L14.8284 25.9706L24.7279 35.8701C25.509 36.6511 26.7753 36.6511 27.5564 35.8701C28.3374 35.089 28.3374 33.8227 27.5564 33.0416L19.656 25.1413L19.0711 24.5563Z"
                                fill="#008CFF"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M49.3429 48.142L49.9295 47.5554C50.7106 46.7743 50.7106 45.508 49.9295 44.7269L49.3446 44.142H14.001C12.8964 44.142 12.001 45.0374 12.001 46.142C12.001 47.2466 12.8964 48.142 14.001 48.142H49.3429Z"
                                fill="#96C3FF"
                            />
                            <path
                                d="M49.9295 44.7269C50.7106 45.508 50.7106 46.7743 49.9295 47.5554L49.3429 48.142L41.4443 56.0407C40.6632 56.8217 40.6632 58.088 41.4443 58.8691C42.2253 59.6501 43.4916 59.6501 44.2727 58.8691L54.1722 48.9696L55.5864 47.5554C56.3675 46.7743 56.3675 45.508 55.5864 44.7269L54.1722 43.3127L44.2727 33.4132C43.4916 32.6322 42.2253 32.6322 41.4443 33.4132C40.6632 34.1943 40.6632 35.4606 41.4443 36.2417L49.3446 44.142L49.9295 44.7269Z"
                                fill="#96C3FF"
                            />
                        </svg>

                        <h2>{intl.formatMessage({ id: 'home.layout.headerTitleH2' })}</h2>
                    </div>
                </Link>

                <nav className={`${style.nav} ${style.desktopMenu}`}>
                    {isAuth == false ? (
                        <div></div>
                    ) : userData?.isGuest == undefined ? (
                        <nav className={style.nav}>
                            <Link className={style.Link} href="/sendfile">
                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                            </Link>
                            <a className={style.Link} href="/getfile">
                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                            </a>
                            <Link className={style.Link} href="/story">
                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                            </Link>
                            <Link className={style.Link} href="/settings">
                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                            </Link>
                            <Link className={style.accountSettingLink} href={'/account'}>
                                <div className={style.userData}>
                                    <div className={style.userAvatarBlock}>
                                        <img
                                            className={style.userAvatarImgDesktop}
                                            src={userData?.avatar[400] as string | undefined}
                                            alt={`Аватар пользователя ${userData?.username}`}
                                        />
                                        <span className={style.userNameText}>{userData?.username}</span>
                                    </div>
                                </div>
                            </Link>

                            {/* <button className={style.buttonLogOut} onClick={() => logOutFun()}>Выход</button> */}
                        </nav>
                    ) : (
                        <nav className={style.nav}>
                            <Link className={style.Link} href="/sendfile">
                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                            </Link>
                            <a className={style.Link} href="/getfile">
                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                            </a>
                            <Link className={style.Link} href="/story">
                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                            </Link>
                            <Link className={style.Link} href="/settings">
                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                            </Link>
                            <Link className={style.Link} href="/signup">
                                {intl.formatMessage({ id: 'home.layout.linkSignup' })}
                            </Link>
                            <Link className={style.Link} href="/login">
                                {intl.formatMessage({ id: 'home.layout.linkLogin' })}
                            </Link>
                        </nav>
                    )}
                </nav>

                <nav className={`${style.nav} ${style.mobileMenu}`}>
                    <button type="button" className={style.burgerMenuButton} onClick={() => setShowBurgerMenu(true)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="var(--color-text)"
                        >
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                        </svg>
                    </button>
                </nav>
            </header>

            <main>
                {children}

                {showBurgerMenu == true ? (
                    <div className={style.burgerMenuBackground}>
                        <div className={style.burgerMenu}>
                            <div className={style.burgerMenuHead}>
                                <h2 className={style.burgerMenuTitle}>
                                    {intl.formatMessage({ id: 'home.layout.burgerMenuTitle' })}
                                </h2>

                                <button
                                    type="button"
                                    className={style.burgerMenuButtonClose}
                                    onClick={() => setShowBurgerMenu(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="30px"
                                        viewBox="0 -960 960 960"
                                        width="30px"
                                        fill="var(--color-text)"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                </button>
                            </div>

                            <nav className={style.navBurgerMenu}>
                                {isAuth == false ? (
                                    <div className={style.loadingUserData}></div>
                                ) : userData?.isGuest == undefined ? (
                                    <nav className={style.navBurgerMenu}>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={style.accountSettingLink}
                                            href={'/account'}
                                        >
                                            <div className={style.userDataBlock}>
                                                <div className={style.userData}>
                                                    {/* Все аватарки хранятся в S3 из-за чего незьзя сделать конструкцию {`${apiUrl}${userData?.avatar[400] as string | undefined}`} */}

                                                    <div className={style.userAvatarBlock}>
                                                        <img
                                                            className={style.userAvatarImg}
                                                            src={userData?.avatar[400] as string | undefined}
                                                            alt={`Аватар пользователя ${userData?.username}`}
                                                        />
                                                    </div>

                                                    <div className={style.userInfoBlock}>
                                                        <h3 className={style.userName}>{userData?.username}</h3>
                                                        <span className={style.userEmail}>{userData?.email}</span>
                                                    </div>
                                                </div>

                                                <div className={style.accountSettingBlock}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="30px"
                                                        viewBox="0 -960 960 960"
                                                        width="30px"
                                                        fill="var(--color-text)"
                                                    >
                                                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>

                                        <nav className={style.navBurgerMenuLinks}>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/sendfile"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                                            </Link>
                                            <a className={style.LinkBurgerMenu} href="/getfile">
                                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                                            </a>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/story"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                                            </Link>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/settings"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                                            </Link>
                                        </nav>
                                    </nav>
                                ) : (
                                    <div>
                                        <nav className={style.navBurgerMenuLinks}>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/signup"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkSignup' })}
                                            </Link>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/login"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkLogin' })}
                                            </Link>

                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/sendfile"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                                            </Link>
                                            <a className={style.LinkBurgerMenu} href="/getfile">
                                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                                            </a>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/story"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                                            </Link>
                                            <Link
                                                onClick={() => setShowBurgerMenu(false)}
                                                className={style.LinkBurgerMenu}
                                                href="/settings"
                                            >
                                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                                            </Link>

                                            {/* <button onClick={() => changeLanguageFun("en")}>EN</button>
                                            <button onClick={() => changeLanguageFun("ru")}>RU</button> */}
                                        </nav>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </main>

            {userData == null ? (
                <div className={style.userDataLoaderBackground}>
                    <div className={style.userDataLoader}>
                        <svg
                            width="60"
                            height="60"
                            className={style.userDataLoaderImg}
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

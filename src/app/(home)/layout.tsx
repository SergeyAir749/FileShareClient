'use client';
import Link from 'next/link';

// import '@/style/global.css';
import styleLayout from '@/style/layout.home.module.css';
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
import { Loading } from '@/components/loader';

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
        <div className={styleLayout.home}>
            <header className={styleLayout.header}>
                <Link href={'/sendfile'} className={styleLayout.headerHomeLink}>
                    <div className={styleLayout.headerTitle}>
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

                <nav className={`${styleLayout.nav} ${styleLayout.desktopMenu}`}>
                    {isAuth == false ? (
                        <div></div>
                    ) : userData?.isGuest == undefined ? (
                        <nav className={styleLayout.nav}>
                            <Link className={styleLayout.Link} href="/sendfile">
                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                            </Link>
                            <a className={styleLayout.Link} href="/getfile">
                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                            </a>
                            <Link className={styleLayout.Link} href="/story">
                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                            </Link>
                            <Link className={styleLayout.Link} href="/settings">
                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                            </Link>
                            <Link className={styleLayout.accountSettingLink} href={'/account'}>
                                <div className={styleLayout.userData}>
                                    <div className={styleLayout.userAvatarBlock}>
                                        <img
                                            className={styleLayout.userAvatarImgDesktop}
                                            src={userData?.avatar[400] as string | undefined}
                                            alt={`Аватар пользователя ${userData?.username}`}
                                        />
                                    </div>
                                </div>
                            </Link>

                            {/* <button className={style.buttonLogOut} onClick={() => logOutFun()}>Выход</button> */}
                        </nav>
                    ) : (
                        <nav className={styleLayout.nav}>
                            <Link className={styleLayout.Link} href="/sendfile">
                                {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                            </Link>
                            <a className={styleLayout.Link} href="/getfile">
                                {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                            </a>
                            <Link className={styleLayout.Link} href="/story">
                                {intl.formatMessage({ id: 'home.layout.linkStory' })}
                            </Link>
                            <Link className={styleLayout.Link} href="/settings">
                                {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                            </Link>
                            <Link className={styleLayout.Link} href="/signup">
                                {intl.formatMessage({ id: 'home.layout.linkSignup' })}
                            </Link>
                            <Link className={styleLayout.Link} href="/login">
                                {intl.formatMessage({ id: 'home.layout.linkLogin' })}
                            </Link>
                        </nav>
                    )}
                </nav>

                <nav className={`${styleLayout.nav} ${styleLayout.mobileMenu}`}>
                    <button
                        type="button"
                        className={styleLayout.burgerMenuButton}
                        onClick={() => setShowBurgerMenu(true)}
                    >
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

                {/* {showBurgerMenu == true ? ( */}
                <div
                    className={`${styleLayout.burgerMenuBackground} ${showBurgerMenu == true ? styleLayout.burgerMenuBackgroundOpen : ''}`}
                >
                    <div className={styleLayout.burgerMenu}>
                        <div className={styleLayout.burgerMenuHead}>
                            <h2 className={styleLayout.burgerMenuTitle}>
                                {intl.formatMessage({ id: 'home.layout.burgerMenuTitle' })}
                            </h2>

                            <button
                                type="button"
                                className={styleLayout.burgerMenuButtonClose}
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

                        <nav className={styleLayout.navBurgerMenu}>
                            {isAuth == false ? (
                                <div className={styleLayout.loadingUserData}></div>
                            ) : userData?.isGuest == undefined ? (
                                <nav className={styleLayout.navBurgerMenu}>
                                    <Link
                                        onClick={() => setShowBurgerMenu(false)}
                                        className={styleLayout.accountSettingLink}
                                        href={'/account'}
                                    >
                                        <div className={styleLayout.userDataBlock}>
                                            <div className={styleLayout.userData}>
                                                {/* Все аватарки хранятся в S3 из-за чего незьзя сделать конструкцию {`${apiUrl}${userData?.avatar[400] as string | undefined}`} */}

                                                <div className={styleLayout.userAvatarBlock}>
                                                    <img
                                                        className={styleLayout.userAvatarImg}
                                                        src={userData?.avatar[400] as string | undefined}
                                                        alt={`Аватар пользователя ${userData?.username}`}
                                                    />
                                                </div>

                                                <div className={styleLayout.userInfoBlock}>
                                                    <h3 className={styleLayout.userName}>{userData?.username}</h3>
                                                    <span className={styleLayout.userEmail}>{userData?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <nav className={styleLayout.navBurgerMenuLinks}>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/sendfile"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                                        </Link>
                                        <a className={styleLayout.LinkBurgerMenu} href="/getfile">
                                            {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                                        </a>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/story"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkStory' })}
                                        </Link>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/settings"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkSettings' })}
                                        </Link>
                                    </nav>
                                </nav>
                            ) : (
                                <div>
                                    <nav className={styleLayout.navBurgerMenuLinks}>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/signup"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkSignup' })}
                                        </Link>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/login"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkLogin' })}
                                        </Link>

                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/sendfile"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkSendFile' })}
                                        </Link>
                                        <a className={styleLayout.LinkBurgerMenu} href="/getfile">
                                            {intl.formatMessage({ id: 'home.layout.linkGetFile' })}
                                        </a>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
                                            href="/story"
                                        >
                                            {intl.formatMessage({ id: 'home.layout.linkStory' })}
                                        </Link>
                                        <Link
                                            onClick={() => setShowBurgerMenu(false)}
                                            className={styleLayout.LinkBurgerMenu}
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
                {/* ) : (
                    <div></div>
                )} */}
            </main>

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

/* eslint-disable react-hooks/immutability */
'use client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import style from '@/style/QRCodeLoginGet.module.css';
import { useIntl } from 'react-intl';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { getQRCodeImgServer, setCookieQRCOdeLoginServer } from './actions';
import Cookies from 'js-cookie';
import { Loading } from '@/components/loader';
import { LoaderUserData } from '@/components/loaderUserData';

interface recipientDetailsData {
    avatar: {
        '400': string;
        '1000': string;
    };
    username: string;
    isGuest: boolean;
}

export default function QRCodeLoginGet() {
    const [QRCodeRoomID, setQRCodeRoomID] = useState('');
    const [QRCodeImgUrl, setQRCodeImgUrl] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState<recipientDetailsData>();
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (document.readyState === 'complete') {
            setShowLoader(false);
            return;
        } else {
            setShowLoader(true);
            return;
        }
    }, []);

    const QRCodeImgRef = useRef(null);

    const intl = useIntl();
    const router = useRouter();
    const socketRef = useRef<Socket>(null);
    const soketUrl = process.env.NEXT_PUBLIC_SERVER_SOCET_URL;

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    // При локальном тестировании сокеты могут не работь из-за вот этого кода:

    //return () => {
    //     if (socketRef.current != null) {
    //         socketRef.current.disconnect();
    //         socketRef.current = null;
    //     }
    // };

    // На сервере (хостинге) всё будит работать нармольно

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(`${soketUrl}/`);
        }

        console.log('socketRef.current: ', socketRef.current);

        return () => {
            if (socketRef.current != null) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            console.log('return socketRef.current: ', socketRef.current);
        };
    }, []);

    useEffect(() => {
        if (socketRef.current != null) {
            socketRef.current.on('QRCodeUserTokenLoginSuccessful', async (token: string) => {
                console.log(token);

                // const isProduction = process.env.NEXT_PUBLIC_COOKIE_SECURE === 'production';

                // Cookies.set('token', token, {
                //     expires: 30,
                //     path: '/',
                //     secure: isProduction,
                //     sameSite: 'lax',
                // });

                await setCookieQRCOdeLoginServer(token);

                const getUserDataTime = setTimeout(() => {
                    const getUserData = async () => {
                        const response = await axios.get('/api/getUserData', { withCredentials: true });

                        console.log(response);
                        console.log(response.data);

                        setUserData(response.data);
                        setIsLogin(true);
                    };

                    getUserData();
                }, 1000);

                const timerPushTime = setTimeout(() => {
                    router.push('/sendfile');
                }, 6000);

                // 2. Возвращаем функцию очистки
                return () => {
                    clearTimeout(getUserDataTime);
                    clearTimeout(timerPushTime);
                };
            });

            socketRef.current.on('youQRCodeRoomID', async (youQRCodeRoomID: string) => {
                console.log(youQRCodeRoomID);
                setQRCodeRoomID(youQRCodeRoomID);

                getQRCodeImgFun(youQRCodeRoomID);
                console.log(QRCodeRoomID);
            });

            const userAgentString = navigator.userAgent;
            let device = '';

            if (/iPhone/i.test(userAgentString)) {
                device = 'iPhone';
            } else if (/iPad/i.test(userAgentString)) {
                device = 'iPad';
            } else if (/Macintosh/i.test(userAgentString)) {
                device = 'MacOS';
            } else if (/Android/i.test(userAgentString)) {
                device = 'Android';
            } else if (/Linux/i.test(userAgentString)) {
                device = 'Linux';
            } else if (/Windows/i.test(userAgentString)) {
                device = 'Windows';
            } else {
                device = 'Не опредилён';
            }

            socketRef.current.emit('QRCodeRoomIDGet', device);
            // console.log('wsfc3');
        }
    }, []);

    const getQRCodeImgFun = async (code: string) => {
        try {
            const text = `${window?.location?.origin}/login/QRCodeLoginSend/${code}`;
            console.log(text);

            const response = await getQRCodeImgServer(text);
            console.log('data:', response.url);
            setQRCodeImgUrl(response.url);

            closeLoaderFun();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();
            console.log(error);

            const serverMessage = error.response.data.error || error.message;
            console.log(serverMessage);

            setError(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    return (
        <div className={style.QRCodeLoginGet}>
            <div className={style.formQRCodeLoginGet}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        <svg width="65" height="65" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M32.8975 15H55.8975C57.5543 15 58.8975 16.3431 58.8975 18V53C58.8975 54.6569 57.5543 56 55.8975 56H32.8975"
                                stroke="#008CFF"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M39.1655 37.2924C40.2503 36.2076 40.252 34.4471 39.1672 33.3623H10.0676C8.98233 33.3623 8.10254 34.2421 8.10254 35.3273C8.10254 36.4126 8.98233 37.2924 10.0676 37.2924H39.1655Z"
                                fill="#96C3FF"
                            />
                            <path
                                d="M39.1672 33.3623C40.252 34.4471 40.2503 36.2076 39.1655 37.2924L31.4048 45.0531C30.6374 45.8205 30.6374 47.0647 31.4048 47.8321C32.1722 48.5995 33.4165 48.5995 34.1839 47.8321L43.9104 38.1055C45.4452 36.5707 45.4452 34.0823 43.9104 32.5475L34.1839 22.8209C33.4165 22.0535 32.1722 22.0535 31.4048 22.8209C30.6374 23.5883 30.6374 24.8325 31.4048 25.5999L39.1672 33.3623Z"
                                fill="#96C3FF"
                            />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'QRCodeLoginGet.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'QRCodeLoginGet.formDescriptionP' })}</p>
                    </div>
                </div>

                {/* <div className={style.formInputs}>{QRCodeRoomID != '' ? <div>{QRCodeRoomID}</div> : <div></div>}</div> */}

                {isLogin != true ? (
                    <div className={style.formBody}>
                        {QRCodeImgUrl != '' ? (
                            <div className={style.QRCodeImgBlock}>
                                <img src={QRCodeImgUrl} alt="#" />
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <span className={style.error}>{error}</span>
                    </div>
                ) : (
                    <div>
                        {userData?.isGuest == false || userData?.isGuest == undefined ? (
                            <div className={style.formBodyIsLogin}>
                                <div className={style.userAvatarBlock}>
                                    {/* <svg
                                        className={style.userLoginloader}
                                        width="200"
                                        height="200"
                                        viewBox="0 0 200 200"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="94"
                                            stroke="var(--color-blue-900)"
                                            stroke-width="6"
                                        />
                                        <path
                                            d="M6 100C6 116.507 10.3469 132.723 18.6034 147.017C26.8599 161.311 38.7349 173.178 53.0339 181.426C67.3329 189.674 83.5516 194.01 100.059 194C116.566 193.99 132.779 189.633 147.068 181.367"
                                            stroke="var(--color-blue-300)"
                                            stroke-width="6"
                                            stroke-linecap="round"
                                        />
                                    </svg> */}

                                    <LoaderUserData />

                                    <img
                                        className={style.userAvatarImgDesktop}
                                        src={userData?.avatar[400] as string | undefined}
                                        alt={`Аватар пользователя ${userData?.username}`}
                                    />
                                </div>
                                <div className={style.userInfoBlock}>
                                    <h2>
                                        {intl.formatMessage({ id: 'QRCodeLoginGet.greetings' })} {userData?.username}
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <div className={style.formBodyIsLogin}>
                                <div className={style.userAvatarBlock}>
                                    <svg
                                        className={style.userLoginloader}
                                        width="200"
                                        height="200"
                                        viewBox="0 0 200 200"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="94"
                                            stroke="var(--color-blue-900)"
                                            stroke-width="6"
                                        />
                                        <path
                                            d="M6 100C6 116.507 10.3469 132.723 18.6034 147.017C26.8599 161.311 38.7349 173.178 53.0339 181.426C67.3329 189.674 83.5516 194.01 100.059 194C116.566 193.99 132.779 189.633 147.068 181.367"
                                            stroke="var(--color-blue-300)"
                                            stroke-width="6"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                    <img
                                        className={style.userAvatarImgDesktop}
                                        src={apiUrl + '/api/images/avatars/default'}
                                        alt={`Аватар пользователя Гость`}
                                    />
                                </div>
                                <div className={style.userInfoBlock}>
                                    <h2>
                                        {intl.formatMessage({ id: 'QRCodeLoginGet.greetings' })}{' '}
                                        {intl.formatMessage({ id: 'userIsGuest.username' })}
                                    </h2>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isLogin != true ? (
                    <div className={style.formButtons}>
                        <div className={style.formLinks}>
                            <Link className={`${style.Link}`} href={'/signup'}>
                                {intl.formatMessage({ id: 'QRCodeLoginGet.link.signup' })}
                            </Link>
                            <Link className={`${style.Link}`} href={'/login'}>
                                {intl.formatMessage({ id: 'QRCodeLoginGet.link.login' })}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}

                {QRCodeImgUrl == '' ? (
                    <div className={style.formLoaderBackground}>
                        <div className={style.formLoader}>
                            <Loading />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

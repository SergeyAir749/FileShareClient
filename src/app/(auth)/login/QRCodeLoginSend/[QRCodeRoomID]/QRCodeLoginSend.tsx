/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import style from '@/style/QRCodeLoginSend.module.css';
import { useIntl } from 'react-intl';

import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { getQRCodeImgServer } from './actions';
import { useAppDispatch, useAppSelector } from '@/components/hooks';
import { setAuth, setUserData } from '@/festures/authSlice';
import Cookies from 'js-cookie';
import { Loading } from '@/components/loader';

export default function QRCodeLoginSend() {
    const [radius, setRadius] = useState<number>(0);
    const [deviceInfo, setDeviceInfo] = useState<string | string[]>('');
    const [QRCodeRoomID, setQRCodeRoomID] = useState<string | string[]>('');
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

    const intl = useIntl();
    const router = useRouter();
    const socketRef = useRef<Socket>(null);
    const soketUrl = process.env.NEXT_PUBLIC_SERVER_SOCET_URL;

    const { userData } = useAppSelector((state) => state.authReducer);
    const dispatch = useAppDispatch();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const params = useParams();

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

                closeLoaderFun();
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

    const setRadiusLoginFun = (number: number) => {
        setRadius(number);
        console.log(number);

        if (number == 100) {
            if (socketRef.current != null) {
                console.log(QRCodeRoomID, userData?._id);
                socketRef.current.emit('ContinueLoginQRCode', QRCodeRoomID, userData?._id);
                console.log('ContinueLoginQRCode');
            }
        }
    };

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
        const QRCodeLoginRoomID = params.QRCodeRoomID;
        console.log(QRCodeLoginRoomID);

        if (QRCodeLoginRoomID != undefined) {
            setQRCodeRoomID(QRCodeLoginRoomID);
        }

        const QRCodeRoomIsThereFun = async () => {
            const response = await axios.get(`${soketUrl}/api/login/QRCode/RoomIsThere/${QRCodeLoginRoomID}`);
            console.log(response);
            const roomIsThereResponse = response.data.RoomIsThere;

            if (roomIsThereResponse) {
                if (socketRef.current != null) {
                    socketRef.current.on('returnQRCodeDeviceInfo', async (device: string) => {
                        console.log(device);

                        setDeviceInfo(device);
                    });

                    socketRef.current.emit('GetQRCodeDeviceInfo', QRCodeLoginRoomID);
                }
            } else {
                router.push('/sendfile');
            }
        };

        QRCodeRoomIsThereFun();
    }, []);

    // useEffect(() => {
    //     if (socketRef.current != null) {
    //         socketRef.current.on('returnQRCodeDeviceInfo', async (device: string) => {
    //             console.log(device);

    //             setDeviceInfo(device);
    //         });

    //         socketRef.current.emit('GetQRCodeDeviceInfo', QRCodeRoomID);
    //     }
    // }, []);

    return (
        <div className={style.QRCodeLoginGet}>
            <div className={style.formQRCodeLoginGet}>
                <div className={style.formContent}>
                    <div className={style.formHead}>
                        <div className={style.formIcon}>
                            <svg
                                width="65"
                                height="65"
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
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
                            <h2>{intl.formatMessage({ id: 'QRCodeLoginSend.formTitleH2' })}</h2>
                            <p>
                                {intl.formatMessage({ id: 'QRCodeLoginSend.formDescriptionP' })}
                                <span style={{ fontWeight: 'bold' }}> {deviceInfo}</span>
                            </p>
                        </div>
                    </div>

                    <div className={style.formBody}>
                        <div className={style.shareUserDataBlock}>
                            {userData?.isGuest == undefined ? (
                                <div className={style.shareUserData}>
                                    <div className={style.shareUserDataAvatarBlock}>
                                        <img
                                            src={userData?.avatar[400]}
                                            alt=""
                                            className={style.shareUserDataAvatarImg}
                                        />
                                    </div>

                                    <div className={style.shareUserDataInfo}>
                                        <span>{userData?.username}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={style.shareUserData}>
                                    <div className={style.shareUserDataAvatarBlock}>
                                        <img
                                            src={apiUrl + '/api/images/avatars/default'}
                                            alt=""
                                            className={style.shareUserDataAvatarImg}
                                        />
                                    </div>

                                    <div className={style.shareUserDataInfo}>
                                        <span>
                                            {intl.formatMessage({
                                                id: 'userIsGuest.username',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={style.formContent}>
                    <div className={style.formButtons}>
                        {radius != 100 ? (
                            <span>{intl.formatMessage({ id: 'QRCodeLoginSend.slideForOverLogin' })}</span>
                        ) : (
                            <span>{intl.formatMessage({ id: 'QRCodeLoginSend.LoginSuccessful' })}</span>
                        )}

                        {radius != 100 ? (
                            <input
                                type="range"
                                min={0}
                                max={100}
                                name="radius"
                                className={style.radius}
                                value={radius}
                                onChange={(e) => setRadiusLoginFun(Number(e.target.value))}
                            />
                        ) : (
                            <div className={style.inputRadiusLoginSuccessful}>
                                <div></div>

                                <div className={style.inputRadiusLoginSuccessfulInfo}>
                                    <span>
                                        {intl.formatMessage({ id: 'QRCodeLoginSend.inputRadiusLoginSuccessful.text' })}
                                    </span>
                                </div>

                                <div className={style.inputRadiusLoginSuccessfulSlider}></div>
                            </div>
                        )}
                    </div>

                    {showLoader ? (
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
        </div>
    );
}

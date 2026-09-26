'use client';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import style from '@/style/whatYouWantToСhoose.signup.module.css';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios';
import Link from 'next/link';
import { signUpServer, submitUpdateGuesOnUserFunServer } from './actions';

export default function WhatYouWantToСhoose() {
    const [signUpUserDataParse, setSignUpUserDataParse] = useState<object | null>({});
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(false);

    const router = useRouter();

    const intl = useIntl();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    useEffect(() => {
        const signUpUserData = sessionStorage?.getItem('signUpUserData');

        if (signUpUserData != null || signUpUserData != undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSignUpUserDataParse(JSON.parse(signUpUserData));
        } else {
            router.push('/signup');
        }
    }, []);

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const submitSignUpNewUser = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            if (signUpUserDataParse != null) {
                const response = await axios.post('/api/signup', signUpUserDataParse, {
                    withCredentials: true,
                });
                sessionStorage.removeItem('signUpUserData');

                router.push('/signup/email/verification');
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();

            const serverMessage = error.response.data.error;
            console.log(error);

            setError(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    const submitUpdateUser = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            if (signUpUserDataParse != null) {
                const response = await submitUpdateGuesOnUserFunServer(signUpUserDataParse);

                sessionStorage.removeItem('signUpUserData');

                router.push('/signup/email/verification');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();
            console.log(error.message);

            const serverMessage = error.message;

            setError(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    return (
        <div className={style.signup}>
            <form className={style.formSignup}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z"
                                fill="#96C3FF"
                            />
                            <circle cx="35" cy="30" r="8" fill="#96C3FF" />
                            <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3" />
                            <circle cx="54" cy="52.7964" r="8" fill="white" stroke="white" strokeWidth="2" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M51.643 57.2426C52.0208 56.8648 52.6667 57.1324 52.6667 57.6667C52.6667 58.403 53.2636 59 54 59C54.7364 59 55.3333 58.403 55.3333 57.6667C55.3333 57.1324 55.9793 56.8649 56.357 57.2426C56.8777 57.7633 57.7219 57.7633 58.2426 57.2426C58.7633 56.7219 58.7633 55.8777 58.2426 55.357C57.8649 54.9793 58.1324 54.3333 58.6667 54.3333C59.403 54.3333 60 53.7364 60 53C60 52.2636 59.403 51.6667 58.6667 51.6667C58.1324 51.6667 57.8649 51.0207 58.2427 50.6429C58.7634 50.1222 58.7634 49.278 58.2427 48.7573C57.722 48.2366 56.8778 48.2366 56.3571 48.7573C55.9793 49.1351 55.3333 48.8676 55.3333 48.3333C55.3333 47.597 54.7364 47 54 47C53.2636 47 52.6667 47.597 52.6667 48.3333C52.6667 48.8676 52.0207 49.1351 51.643 48.7574C51.1223 48.2367 50.2781 48.2367 49.7574 48.7574C49.2367 49.2781 49.2367 50.1223 49.7574 50.643C50.1351 51.0207 49.8676 51.6667 49.3333 51.6667C48.597 51.6667 48 52.2636 48 53C48 53.7364 48.597 54.3333 49.3333 54.3333C49.8676 54.3333 50.1351 54.9792 49.7574 55.357C49.2367 55.8777 49.2367 56.7219 49.7574 57.2426C50.2781 57.7633 51.1223 57.7633 51.643 57.2426Z"
                                fill="#008CFF"
                            />
                            <circle cx="54" cy="53" r="2" fill="white" stroke="white" />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'whatyouwanttochoose.formTitleH2' })}</h2>
                    </div>
                </div>

                <div className={style.formButtons}>
                    <button
                        onClick={(e) => submitSignUpNewUser(e)}
                        type="button"
                        className={` ${style.storyLinkStyle} ${style.linkStyleBorderRadiusTop} `}
                    >
                        <div className={style.linkInfoStyle}>
                            <div className={style.linkInfoIcon}>
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 70 70"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z"
                                        fill="#96C3FF"
                                    />
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF" />
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3" />
                                    <circle cx="52" cy="51" r="8" fill="white" stroke="white" strokeWidth="2" />
                                    <rect x="47" y="50" width="10" height="2" rx="1" fill="#008CFF" />
                                    <rect
                                        x="51"
                                        y="56"
                                        width="10"
                                        height="2"
                                        rx="1"
                                        transform="rotate(-90 51 56)"
                                        fill="#008CFF"
                                    />
                                </svg>
                            </div>

                            <span className={style.linkInfoText}>
                                {intl.formatMessage({ id: 'whatyouwanttochoose.button.createNew' })}
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={(e) => submitUpdateUser(e)}
                        type="button"
                        className={` ${style.storyLinkStyle} ${style.linkStyleBorderRadiusButton} `}
                    >
                        <div className={style.linkInfoStyle}>
                            <div className={style.linkInfoIcon}>
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 70 70"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z"
                                        fill="#96C3FF"
                                    />
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF" />
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3" />
                                    <circle cx="52" cy="51" r="8" fill="white" stroke="white" strokeWidth="2" />
                                    <path
                                        d="M50.4024 54.6395L47.7522 55.1684L48.2811 52.5182L54.8923 45.907L57.0136 48.0283L50.4024 54.6395Z"
                                        fill="white"
                                        stroke="#008CFF"
                                    />
                                    <rect
                                        x="57.7207"
                                        y="48.0283"
                                        width="3"
                                        height="4"
                                        rx="0.2"
                                        transform="rotate(135 57.7207 48.0283)"
                                        fill="#008CFF"
                                    />
                                </svg>
                            </div>

                            <span className={style.linkInfoText}>
                                {intl.formatMessage({ id: 'whatyouwanttochoose.button.updateOld' })}
                            </span>
                        </div>
                    </button>
                </div>

                <span className={style.error}>{error}</span>

                <div className={style.formInfo}>
                    <div className={style.formInfoText}>
                        <h3>{intl.formatMessage({ id: 'whatyouwanttochoose.info.createNew.h3' })}</h3>
                        <span>{intl.formatMessage({ id: 'whatyouwanttochoose.info.createNew.span' })}</span>
                    </div>

                    <div className={style.formInfoText}>
                        <h3>{intl.formatMessage({ id: 'whatyouwanttochoose.info.updateOld.h3' })}</h3>
                        <span>{intl.formatMessage({ id: 'whatyouwanttochoose.info.updateOld.span' })}</span>
                    </div>
                </div>

                {showLoader ? (
                    <div className={style.formLoaderBackground}>
                        <div className={style.formLoader}>
                            <svg
                                width="60"
                                height="60"
                                className={style.formLoaderImg}
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
            </form>
        </div>
    );
}

/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import style from '@/style/delete.account.verify.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { submitUserDeleteAccountServer } from './actions';
import { Loading } from '@/components/loader';

export default function DeleteAccountVerification() {
    const [password, setPassword] = useState('');
    const [showPasswordStatus, setShowPasswordStatus] = useState('password');
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

    // const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const router = useRouter();

    const intl = useIntl();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const validationInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(passwordRegexp.test(value));
        setPassword(value);
    };

    const submitUserDeleteAccount = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const obj = {
                password: password,
            };

            //console.log(obj);

            const response = await submitUserDeleteAccountServer(obj);
            //console.log('Response:', response);
            sessionStorage.setItem('session', response.sessionId);

            location.pathname = '/account/delete';
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

    const buttonBackPage = async () => {
        router.push('/account');
    };

    const showPasswordFun = () => {
        if (showPasswordStatus == 'password') {
            setShowPasswordStatus('text');
        } else {
            setShowPasswordStatus('password');
        }
    };

    return (
        <div className={style.deleteAccountVerification}>
            <form className={style.formDeleteAccountVerification} onSubmit={(e) => submitUserDeleteAccount(e)}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        {/* <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z"
                                fill="#96C3FF"
                            />
                            <circle cx="35" cy="30" r="8" fill="#96C3FF" />
                            <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3" />
                            <rect x="23" y="50" width="44" height="12" rx="6" fill="white" />
                            <circle cx="29" cy="56" r="2" fill="#008CFF" />
                            <circle cx="37" cy="56" r="2" fill="#008CFF" />
                            <circle cx="45" cy="56" r="2" fill="#008CFF" />
                            <circle cx="53" cy="56" r="2" fill="#008CFF" />
                            <circle cx="61" cy="56" r="2" fill="#008CFF" />
                            <rect x="2" y="42" width="20" height="20" rx="10" fill="white" />
                            <rect
                                x="9.16406"
                                y="54.832"
                                width="9"
                                height="5.66667"
                                rx="2.83333"
                                transform="rotate(-90 9.16406 54.832)"
                                fill="white"
                                stroke="#008CFF"
                            />
                            <rect
                                x="7"
                                y="50.332"
                                width="10"
                                height="6.66667"
                                rx="1"
                                fill="#008CFF"
                                stroke="#008CFF"
                                strokeWidth="0.5"
                            />
                            <rect x="11.1641" y="52" width="1.66667" height="1.66667" rx="0.833333" fill="white" />
                            <rect x="11.667" y="52" width="0.666667" height="3.33333" rx="0.333333" fill="white" />
                        </svg> */}

                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect
                                x="21.5"
                                y="58.5"
                                width="49"
                                height="27"
                                rx="13.5"
                                transform="rotate(-90 21.5 58.5)"
                                stroke="#96C3FF"
                                strokeWidth="5"
                            />
                            <path
                                d="M55 30.583C57.3471 30.583 59.2499 32.4859 59.25 34.833V58.833C59.25 61.1802 57.3472 63.083 55 63.083H15C12.6528 63.083 10.75 61.1802 10.75 58.833V34.833C10.7501 32.4859 12.6529 30.583 15 30.583H55ZM34.9883 38.8398C32.7791 38.8398 30.9883 40.6307 30.9883 42.8398C30.9885 44.4852 31.9824 45.8977 33.4023 46.5117V53.2393C33.4023 54.1228 34.1185 54.8396 35.002 54.8398C35.8856 54.8398 36.6025 54.1229 36.6025 53.2393V46.499C38.0073 45.8785 38.9881 44.4742 38.9883 42.8398C38.9883 40.6307 37.1974 38.8398 34.9883 38.8398Z"
                                fill="#008CFF"
                            />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'deleteAccountVerification.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'deleteAccountVerification.formDescriptionP' })}</p>
                    </div>
                </div>

                <div className={style.formInputs}>
                    <div className={style.passwordBlock}>
                        <input
                            className={style.inputStylePassword}
                            onChange={(e) => validationInputPassword(e)}
                            placeholder={intl.formatMessage({ id: 'deleteAccountVerification.input.password' })}
                            type={showPasswordStatus}
                            name="password"
                            id="password"
                            required
                        />

                        <button className={style.buttonStylePassword} onClick={() => showPasswordFun()} type="button">
                            {showPasswordStatus == 'password' ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="var(--color-text)"
                                >
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="var(--color-text)"
                                >
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <span className={style.error}>{error}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>
                        {intl.formatMessage({ id: 'deleteAccountVerification.button.submit' })}
                    </button>
                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>
                        {intl.formatMessage({ id: 'deleteAccountVerification.button.cancel' })}
                    </button>
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
            </form>
        </div>
    );
}

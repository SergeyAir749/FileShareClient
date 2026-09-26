'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';

import style from '@/style/login.module.css';
import { useIntl } from 'react-intl';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const intl = useIntl();

    const [showLoader, setShowLoader] = useState(false);

    const [showPasswordStatus, setShowPasswordStatus] = useState('password');
    const [loginBy, setLoginBy] = useState('email');

    const router = useRouter();

    const validationInputEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(emailRegexp.test(value));
        setEmail(value);
        closeLoaderFun();
        //console.log(email);
    };

    const validationInputUserName = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(usernameRegexp.test(value));
        setUsername(value);
        closeLoaderFun();
    };

    const validationInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(passwordRegexp.test(value));
        setPassword(value);
        closeLoaderFun();
    };

    const setloginByFun = () => {
        if (loginBy == 'username') {
            setLoginBy('email');
            setUsername('');
        } else {
            setLoginBy('username');
            setEmail('');
        }
    };

    const showPasswordFun = () => {
        if (showPasswordStatus == 'password') {
            setShowPasswordStatus('text');
        } else {
            setShowPasswordStatus('password');
        }
    };

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const submitLoginUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const userData = {
                email: email,
                username: username,
                password: password,
            };

            //console.log(userData);

            const response = await axios.post('/api/login', userData, { withCredentials: true });
            console.log('data:', response.data);

            router.push('/sendfile');

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
        <div className={style.login}>
            <form className={style.formLogin} onSubmit={(e) => submitLoginUser(e)}>
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
                        <h2>{intl.formatMessage({ id: 'login.formTitleH2' })}</h2>
                    </div>
                </div>

                <div className={style.formInputs}>
                    {loginBy == 'username' ? (
                        <input
                            className={style.inputStyle}
                            value={username}
                            onChange={(e) => validationInputUserName(e)}
                            placeholder={intl.formatMessage({ id: 'login.input.username' })}
                            type="text"
                            name="text"
                            id="text"
                            required
                        />
                    ) : loginBy == 'email' ? (
                        <input
                            className={style.inputStyle}
                            value={email}
                            onChange={(e) => validationInputEmail(e)}
                            placeholder={intl.formatMessage({ id: 'login.input.email' })}
                            type="email"
                            name="email"
                            id="email"
                            required
                        />
                    ) : (
                        <div></div>
                    )}

                    <div className={style.passwordBlock}>
                        <input
                            className={style.inputStylePassword}
                            onChange={(e) => validationInputPassword(e)}
                            placeholder={intl.formatMessage({ id: 'login.input.password' })}
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
                        {intl.formatMessage({ id: 'login.button.submit' })}
                    </button>

                    <div className={style.formLinks}>
                        <button type="button" onClick={() => setloginByFun()} className={style.loginByButton}>
                            {intl.formatMessage({ id: 'login.in' })}
                            {loginBy == 'email' ? (
                                <span> {intl.formatMessage({ id: 'login.in.username' })}</span>
                            ) : loginBy == 'username' ? (
                                <span> {intl.formatMessage({ id: 'login.in.email' })}</span>
                            ) : (
                                <span></span>
                            )}
                        </button>

                        <Link className={`${style.Link}`} href={'/signup'}>
                            {intl.formatMessage({ id: 'login.link.noAccountRegistration' })}
                        </Link>
                        {/* <button type="button" onClick={(e) => сontinueAsGuestFun(e)} className={`${style.Link} ${style.buttonLink}`}>Продолжить как гость</button> */}
                        <Link className={`${style.Link}`} href={'/account/recovering'}>
                            {intl.formatMessage({ id: 'login.link.recoverAccount' })}
                        </Link>
                        <Link className={`${style.Link}`} href={'/login/resetpassword'}>
                            {intl.formatMessage({ id: 'login.link.forgotYourPassword' })}
                        </Link>
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

'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import style from '@/style/recovering.module.css';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { submitRecoveringUserAccountServer } from './actions';
import Cookies from 'js-cookie';

export default function Recovering() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(false);

    const [showPasswordStatus, setShowPasswordStatus] = useState('password');
    const [loginBy, setLoginBy] = useState('email');

    const router = useRouter();

    const intl = useIntl();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

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

    const submitRecoveringUserAccount = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            let lang = Cookies.get('language');

            if (lang == undefined) {
                lang = 'ru';
            }

            const userData = {
                email: email,
                username: username,
                password: password,
                lang: lang,
            };

            //console.log(userData);

            const response = await axios.post('/api/account/recovering', userData, { withCredentials: true });
            console.log('Response:', response);
            //console.log('Token:', response.data.token);

            router.push('/account/recovering/verification');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();
            const serverMessage = error.response.data.error || error.message;
            console.log(error.message);

            setError(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    return (
        <div className={style.recovering}>
            <form className={style.formRecovering} onSubmit={(e) => submitRecoveringUserAccount(e)}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z"
                                fill="#96C3FF"
                            />
                            <circle cx="35" cy="30" r="8" fill="#96C3FF" />
                            <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3" />
                            <circle cx="52" cy="51" r="9" fill="white" stroke="white" strokeWidth="2" />
                            <rect
                                x="46.6445"
                                y="45.0312"
                                width="5.0003"
                                height="1.36374"
                                rx="0.681871"
                                transform="rotate(80 46.6445 45.0312)"
                                fill="#008CFF"
                            />
                            <rect
                                x="51.0928"
                                y="49.3242"
                                width="4.99997"
                                height="1.36383"
                                rx="0.681916"
                                transform="rotate(170 51.0928 49.3242)"
                                fill="#008CFF"
                            />
                            <path
                                d="M57.1702 50.0883C57.5782 50.0164 57.8551 49.6253 57.7329 49.2295C57.4074 48.1756 56.7959 47.2268 55.96 46.4924C54.9354 45.5923 53.6346 45.068 52.2722 45.0062C50.9097 44.9443 49.5668 45.3485 48.4648 46.1521C47.5658 46.8076 46.8709 47.6972 46.4512 48.7172C46.2936 49.1003 46.5339 49.5149 46.9337 49.6235V49.6235C47.3334 49.7321 47.7399 49.4922 47.9133 49.1161C48.2329 48.423 48.7253 47.8185 49.3486 47.364C50.1751 46.7614 51.1823 46.4582 52.2041 46.5046C53.226 46.551 54.2015 46.9442 54.97 47.6193C55.5495 48.1284 55.9852 48.775 56.2406 49.4942C56.3792 49.8845 56.7623 50.1603 57.1702 50.0883V50.0883Z"
                                fill="#008CFF"
                            />
                            <rect
                                x="57.3555"
                                y="56.9688"
                                width="5.0003"
                                height="1.36374"
                                rx="0.681871"
                                transform="rotate(-100 57.3555 56.9688)"
                                fill="#008CFF"
                            />
                            <rect
                                x="52.9072"
                                y="52.6758"
                                width="4.99997"
                                height="1.36383"
                                rx="0.681916"
                                transform="rotate(-9.99999 52.9072 52.6758)"
                                fill="#008CFF"
                            />
                            <path
                                d="M46.8298 51.9117C46.4218 51.9836 46.1449 52.3747 46.2671 52.7705C46.5926 53.8244 47.2041 54.7732 48.04 55.5076C49.0646 56.4077 50.3654 56.932 51.7278 56.9938C53.0903 57.0557 54.4332 56.6515 55.5352 55.8479C56.4342 55.1924 57.1291 54.3028 57.5488 53.2828C57.7064 52.8997 57.4661 52.4851 57.0663 52.3765V52.3765C56.6666 52.2679 56.2601 52.5078 56.0867 52.8839C55.7671 53.577 55.2747 54.1814 54.6514 54.636C53.8249 55.2386 52.8177 55.5418 51.7959 55.4954C50.774 55.449 49.7985 55.0558 49.03 54.3807C48.4505 53.8716 48.0148 53.225 47.7594 52.5058C47.6208 52.1155 47.2377 51.8397 46.8298 51.9117V51.9117Z"
                                fill="#008CFF"
                            />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'recovering.account.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'recovering.account.formDescriptionP' })}</p>
                    </div>
                </div>

                <div className={style.formInputs}>
                    {loginBy == 'username' ? (
                        <input
                            className={style.inputStyle}
                            value={username}
                            onChange={(e) => validationInputUserName(e)}
                            placeholder={intl.formatMessage({ id: 'recovering.account.input.name' })}
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
                            placeholder={intl.formatMessage({ id: 'recovering.account.input.email' })}
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
                            placeholder={intl.formatMessage({ id: 'recovering.account.input.password' })}
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
                        {intl.formatMessage({ id: 'recovering.account.button.submit' })}
                    </button>

                    <div className={style.formLinks}>
                        <button type="button" onClick={() => setloginByFun()} className={style.loginByButton}>
                            {intl.formatMessage({ id: 'recovering.account.by' })}
                            {loginBy == 'email' ? (
                                <span> {intl.formatMessage({ id: 'recovering.account.by.username' })}</span>
                            ) : loginBy == 'username' ? (
                                <span> {intl.formatMessage({ id: 'recovering.account.by.email' })}</span>
                            ) : (
                                <span></span>
                            )}
                        </button>

                        <Link className={`${style.Link}`} href={'/login/resetpassword'}>
                            {intl.formatMessage({ id: 'recovering.account.link.forgotYourPassword' })}
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

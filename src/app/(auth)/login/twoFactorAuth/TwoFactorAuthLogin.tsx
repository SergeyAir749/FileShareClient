/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import style from '@/style/login.twoFactorAuth.verify.module.css';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { submitTwoFactorAuthLoginServer, getТewСodeFunServer, submitTwoFactorAuthLoginCancelServer } from './actions';
import { Loading } from '@/components/loader';

interface UserDataLogin {
    code: string;
}

export default function TwoFactorAuthLogin() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(false);
    const [newEmailCodLoader, setNewEmailCodLoader] = useState(false);

    const intl = useIntl();

    const router = useRouter();

    useEffect(() => {
        if (document.readyState === 'complete') {
            setShowLoader(false);
            return;
        } else {
            setShowLoader(true);
            return;
        }
    }, []);

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const showNewEmailCodLoaderFun = () => {
        setNewEmailCodLoader(true);
    };

    const closeNewEmailCodLoaderFun = () => {
        setNewEmailCodLoader(false);
    };

    const validationInputCode = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);
        closeLoaderFun();
        //console.log(code);
    };

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const submitVerifyEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const userDataLogin = sessionStorage.getItem('userDataLogin');
            let userDataLoginParse;

            if (userDataLogin != null) {
                userDataLoginParse = JSON.parse(userDataLogin);
                userDataLoginParse['code'] = code;
            }

            const response = await axios.post('/api/login/twoFA/email/verify', userDataLoginParse);
            console.log(response);

            sessionStorage.removeItem('userDataLogin');

            location.pathname = '/sendfile';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();

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

    const buttonGetТewСode = async () => {
        try {
            showNewEmailCodLoaderFun();

            const userDataLogin = sessionStorage.getItem('userDataLogin');
            let userDataLoginParse;

            if (userDataLogin != null) {
                userDataLoginParse = JSON.parse(userDataLogin);
                userDataLoginParse['code'] = code;
            }

            const response = await getТewСodeFunServer(userDataLoginParse);

            setMessage(intl.formatMessage({ id: 'twoFactorAuthLogin.message.getNewCode' }));
            closeNewEmailCodLoaderFun();
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
        try {
            const userDataLogin = sessionStorage.getItem('userDataLogin');
            let userDataLoginParse;

            if (userDataLogin != null) {
                userDataLoginParse = JSON.parse(userDataLogin);
                userDataLoginParse['code'] = code;
            }

            const response = await submitTwoFactorAuthLoginCancelServer(userDataLoginParse);

            router.push('/signup');
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

    // const buttonBackPage = () => {
    //     router.back()
    // }

    return (
        <div className={style.twoFactorAuthLogin}>
            <form className={style.formTwoFactorAuthLogin} onSubmit={(e) => submitVerifyEmail(e)}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M37.2136 67.717L61.1618 48.0077C61.7521 47.5218 62.0957 46.787 62.0957 46.0101L62.0957 14.6161C62.0957 13.4707 61.3547 12.4646 60.2813 12.1528L36.3332 5.19706C36.1113 5.13264 35.883 5.10043 35.6547 5.10043V68.2794C36.2064 68.2794 36.7581 68.0919 37.2136 67.717Z"
                                fill="#008CFF"
                            />
                            <path
                                d="M10.0297 48.0091L33.978 67.7171C34.4335 68.092 34.9852 68.2794 35.5369 68.2794V5.10043C35.3085 5.10043 35.0802 5.13264 34.8584 5.19707L10.9113 12.1529C9.83796 12.4646 9.09697 13.4706 9.09692 14.6161L9.0957 46.0113C9.09567 46.7883 9.43925 47.5232 10.0297 48.0091Z"
                                fill="#96C3FF"
                            />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'twoFactorAuthLogin.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'twoFactorAuthLogin.formDescriptionP' })}</p>
                    </div>
                </div>

                <div className={style.formInputs}>
                    <input
                        className={style.inputStyle}
                        value={code}
                        onChange={(e) => validationInputCode(e)}
                        placeholder={intl.formatMessage({ id: 'twoFactorAuthLogin.input.enterTheCodeFromTheEmail' })}
                        type="text"
                        name="code"
                        id="code"
                        required
                    />
                    <span className={style.error}>{error}</span>
                    <span className={style.message}>{message}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>
                        {intl.formatMessage({ id: 'twoFactorAuthLogin.button.submit' })}
                    </button>
                    {newEmailCodLoader != false ? (
                        <button className={style.styleButtonSubmitLoader} type="button">
                            <svg
                                width="25"
                                height="25"
                                className={style.loaderImg}
                                viewBox="0 0 50 50"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_223_516)">
                                    <circle cx="25" cy="25" r="22.5" stroke="#434343" strokeWidth="5" />
                                    <path
                                        d="M34.5524 45.3716C35.1386 46.6217 34.6033 48.1232 33.3009 48.5817C29.1743 50.0343 24.7234 50.3834 20.3948 49.5722C15.2442 48.6069 10.5271 46.0475 6.91016 42.2557C3.29318 38.4638 0.959162 33.6313 0.237921 28.4408C-0.368215 24.0788 0.19048 19.6493 1.83617 15.5958C2.35556 14.3165 3.88066 13.8527 5.10172 14.4972V14.4972C6.32277 15.1417 6.77389 16.6504 6.28665 17.9423C5.1119 21.0571 4.72854 24.4293 5.19034 27.7527C5.76733 31.905 7.63454 35.7711 10.5281 38.8045C13.4217 41.838 17.1954 43.8855 21.3159 44.6578C24.6137 45.2758 28.0003 45.052 31.1671 44.0255C32.4805 43.5997 33.9662 44.1215 34.5524 45.3716V45.3716Z"
                                        fill="#ffffff"
                                    />
                                </g>

                                <defs>
                                    <clipPath id="clip0_223_516">
                                        <rect width="50" height="50" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    ) : (
                        <button type="button" onClick={() => buttonGetТewСode()} className={style.buttonGetТewСode}>
                            {intl.formatMessage({ id: 'twoFactorAuthLogin.button.getNewCode' })}
                        </button>
                    )}

                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>
                        {intl.formatMessage({ id: 'twoFactorAuthLogin.button.cancel' })}
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

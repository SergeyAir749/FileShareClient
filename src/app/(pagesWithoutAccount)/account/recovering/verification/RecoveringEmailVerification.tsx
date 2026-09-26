'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import style from '@/style/recovering.email.verification.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppSelector } from '@/components/hooks';
import { useIntl } from 'react-intl';
import {
    getТewСodeFunServer,
    submitChangeUserEmailCancelServer,
    submitRecoveringAccountUserEmailVerifyServer,
} from './actions';

export default function RecoveringEmailVerification() {
    const { userData } = useAppSelector((state) => state.authReducer);
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(false);
    const [newEmailCodLoader, setNewEmailCodLoader] = useState(false);

    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const intl = useIntl();

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
        //console.log(code);
    };

    const submitRecoveringAccountUserEmailVerify = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const codeObj = {
                code: code,
            };

            //console.log(codeObj);

            const response = await axios.post('/api/account/recovering/verification', codeObj, {
                withCredentials: true,
            });
            //console.log('Response:', response);

            location.pathname = '/account/recovering/successfully';
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

    const buttonGetТewСode = async () => {
        try {
            showNewEmailCodLoaderFun();

            const response = await getТewСodeFunServer();
            //console.log('Response:', response);

            setMessage(intl.formatMessage({ id: 'recovering.account.verification.message.getТewСode' }));
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
            //console.log('Response:', response);

            const response = await submitChangeUserEmailCancelServer();

            router.back();
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
        <div className={style.accounRecoveringEmailVerification}>
            <form
                className={style.formAccounRecoveringEmailVerification}
                onSubmit={(e) => submitRecoveringAccountUserEmailVerify(e)}
            >
                <div className={style.formHead}>
                    <div className={style.formIcon}>
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'recovering.account.verification.formTitleH2' })}</h2>

                        {userData != null ? (
                            <div>
                                <p>{intl.formatMessage({ id: 'recovering.account.verification.formDescriptionP' })}</p>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>

                <div className={style.formInputs}>
                    <input
                        className={style.inputStyle}
                        value={code}
                        onChange={(e) => validationInputCode(e)}
                        placeholder={intl.formatMessage({ id: 'recovering.account.verification.input.code' })}
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
                        {intl.formatMessage({ id: 'recovering.account.verification.button.submit' })}
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
                                    <circle cx="25" cy="25" r="22.5" stroke="var(--color-gray-600)" strokeWidth="5" />
                                    <path
                                        d="M34.5524 45.3716C35.1386 46.6217 34.6033 48.1232 33.3009 48.5817C29.1743 50.0343 24.7234 50.3834 20.3948 49.5722C15.2442 48.6069 10.5271 46.0475 6.91016 42.2557C3.29318 38.4638 0.959162 33.6313 0.237921 28.4408C-0.368215 24.0788 0.19048 19.6493 1.83617 15.5958C2.35556 14.3165 3.88066 13.8527 5.10172 14.4972V14.4972C6.32277 15.1417 6.77389 16.6504 6.28665 17.9423C5.1119 21.0571 4.72854 24.4293 5.19034 27.7527C5.76733 31.905 7.63454 35.7711 10.5281 38.8045C13.4217 41.838 17.1954 43.8855 21.3159 44.6578C24.6137 45.2758 28.0003 45.052 31.1671 44.0255C32.4805 43.5997 33.9662 44.1215 34.5524 45.3716V45.3716Z"
                                        fill="var(--color-gray-100)"
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
                            {intl.formatMessage({ id: 'recovering.account.verification.button.getТewСode' })}
                        </button>
                    )}

                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>
                        {intl.formatMessage({ id: 'recovering.account.verification.button.cancel' })}
                    </button>
                </div>

                {showLoader != false ? (
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

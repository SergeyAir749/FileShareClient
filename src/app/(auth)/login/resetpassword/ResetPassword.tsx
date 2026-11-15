/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import style from '@/style/resetpassword.module.css';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { submitResetPasswordUserServer } from './actions';
import Cookies from 'js-cookie';
import { Loading } from '@/components/loader';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(false);

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

    // const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    const validationInputEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(emailRegexp.test(value));
        setEmail(value);
        closeLoaderFun();
        //console.log(email);
    };

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const submitResetPasswordUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            let lang = Cookies.get('language');

            if (lang == undefined) {
                lang = 'ru';
            }

            const userData = {
                email: email,
                lang: lang,
            };

            //console.log(userData);

            sessionStorage.setItem('userEmail', email);
            const response = await submitResetPasswordUserServer(userData);

            router.push('/login/resetpassword/verification');

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
        <div className={style.resetPassword}>
            <form className={style.fornResetPassword} onSubmit={(e) => submitResetPasswordUser(e)}>
                <div className={style.formHead}>
                    <div className={style.formIcon}>
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
                            <circle cx="51" cy="54" r="12" fill="white" stroke="white" strokeWidth="2" />
                            <rect
                                x="44.0859"
                                y="45.3489"
                                width="5.99895"
                                height="1.6361"
                                rx="0.818052"
                                transform="rotate(90 44.0859 45.3489)"
                                fill="#008CFF"
                            />
                            <rect
                                x="48.4482"
                                y="51.3479"
                                width="5.99855"
                                height="1.63621"
                                rx="0.818107"
                                transform="rotate(180 48.4482 51.3479)"
                                fill="#008CFF"
                            />
                            <path
                                d="M59.19 54C59.6374 54 60.0038 53.6366 59.9636 53.1911C59.8051 51.4352 59.1336 49.758 58.0239 48.3728C56.7447 46.7762 54.9598 45.663 52.9633 45.2167C50.9668 44.7705 48.8777 45.0177 47.0405 45.9178C45.4467 46.6986 44.1249 47.9303 43.2339 49.4515C43.0079 49.8376 43.1847 50.3224 43.5895 50.5129V50.5129C43.9942 50.7033 44.4731 50.5267 44.7068 50.1452C45.4356 48.9553 46.4903 47.9913 47.7532 47.3726C49.2597 46.6345 50.9727 46.4318 52.6099 46.7977C54.2471 47.1637 55.7107 48.0765 56.7596 49.3857C57.6389 50.4833 58.1828 51.8046 58.3356 53.1916C58.3846 53.6363 58.7426 54 59.19 54V54Z"
                                fill="#008CFF"
                            />
                            <rect
                                x="57.9141"
                                y="62.6511"
                                width="5.99892"
                                height="1.63611"
                                rx="0.818057"
                                transform="rotate(-90 57.9141 62.6511)"
                                fill="#008CFF"
                            />
                            <rect
                                x="53.5518"
                                y="56.6521"
                                width="5.99858"
                                height="1.63621"
                                rx="0.818103"
                                fill="#008CFF"
                            />
                            <path
                                d="M42.81 54C42.3626 54 41.9962 54.3634 42.0364 54.8089C42.1949 56.5648 42.8664 58.242 43.9761 59.6272C45.2553 61.2238 47.0402 62.337 49.0367 62.7832C51.0332 63.2295 53.1223 62.9823 54.9595 62.0822C56.5533 61.3014 57.8751 60.0697 58.7661 58.5485C58.9921 58.1624 58.8153 57.6776 58.4105 57.4871V57.4871C58.0058 57.2967 57.5269 57.4733 57.2932 57.8548C56.5644 59.0447 55.5097 60.0087 54.2468 60.6274C52.7403 61.3655 51.0273 61.5682 49.3901 61.2023C47.7529 60.8363 46.2893 59.9235 45.2404 58.6143C44.3611 57.5167 43.8172 56.1954 43.6644 54.8084C43.6154 54.3637 43.2573 54 42.81 54V54Z"
                                fill="#008CFF"
                            />
                        </svg>
                    </div>

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'resetPassword.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'resetPassword.formDescriptionP' })}</p>
                    </div>
                </div>

                <div className={style.formInputs}>
                    <input
                        className={style.inputStyle}
                        value={email}
                        onChange={(e) => validationInputEmail(e)}
                        placeholder={intl.formatMessage({ id: 'resetPassword.input.email' })}
                        type="email"
                        name="email"
                        id="email"
                        required
                    />

                    <span className={style.error}>{error}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>
                        {intl.formatMessage({ id: 'resetPassword.button.submit' })}
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

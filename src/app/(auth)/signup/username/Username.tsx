/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import style from '@/style/signup.username.module.css';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import axios from 'axios';
import Link from 'next/link';
import { isGuestFunServer, isUserInDBServer, signUpServer } from './actions';
import Cookies from 'js-cookie';
import { Loading } from '@/components/loader';

interface SignupData {
    username?: string;
}

export default function SignupUserName() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [errorValidation, setErrorValidation] = useState('');
    const [error, setError] = useState('');

    const [isGuest, setIsGuest] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const intl = useIntl();

    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    useEffect(() => {
        if (document.readyState === 'complete') {
            setShowLoader(false);
            return;
        } else {
            setShowLoader(true);
            return;
        }
    }, []);

    useEffect(() => {
        const isGuestFun = async () => {
            try {
                const response = await isGuestFunServer();

                if (response.isGuest == true) {
                    setIsGuest(true);
                } else {
                    setIsGuest(false);
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error.message);
                setIsGuest(false);
                // setError(error.message);
            }
        };

        isGuestFun();
    }, []);

    useEffect(() => {
        const userDataString: string | null = sessionStorage.getItem('signUpUserData');

        if (userDataString == null) {
            router.push('/signup');
        }
    }, []);

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const validationInputUserName = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        closeLoaderFun();
    };

    const validationInputSurname = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSurname(value);
        closeLoaderFun();
    };

    const submitSignUpUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const userDataString: string | null = sessionStorage.getItem('signUpUserData');
            let userDataObject: SignupData = {};

            if (userDataString != null) {
                userDataObject = JSON.parse(userDataString);

                if (surname != '') {
                    userDataObject['username'] = `${name} ${surname}`;
                } else {
                    userDataObject['username'] = `${name}`;
                }
            } else {
                router.push('/signup');
            }

            if (errorValidation == '') {
                if (isGuest == false) {
                    // const response = await signUpServer(userData);
                    const response = await axios.post('/api/signup', userDataObject, { withCredentials: true });
                    router.push('/signup/email/verification');
                } else {
                    const response = await isUserInDBServer(userDataObject);
                    sessionStorage?.setItem('signUpUserData', JSON.stringify(userDataObject));
                    router.push('/signup/whatyouwanttochoose');
                }
            } else {
                closeLoaderFun();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();

            const serverMessage = error.response.data.error || error.message;
            console.log(error);

            setError(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    return (
        <div className={style.signupUserName}>
            <form className={style.formSignupUserName} onSubmit={(e) => submitSignUpUser(e)}>
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

                    <div className={style.formTitle}>
                        <h2>{intl.formatMessage({ id: 'signupUserName.formTitleH2' })}</h2>
                    </div>
                </div>

                <div className={style.formInputs}>
                    <input
                        className={style.inputStyle}
                        onChange={(e) => validationInputUserName(e)}
                        placeholder={intl.formatMessage({ id: 'signupUserName.input.username' })}
                        type="text"
                        name="username"
                        id="username"
                        required
                    />
                    <input
                        className={style.inputStyle}
                        onChange={(e) => validationInputSurname(e)}
                        placeholder={intl.formatMessage({ id: 'signupUserName.input.surname' })}
                        type="text"
                        name="surname"
                        id="surname"
                    />

                    <div>
                        <span className={style.error}>{error}</span>
                        <span className={style.error}>{errorValidation}</span>
                    </div>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>
                        {intl.formatMessage({ id: 'signupUserName.button.submit' })}
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

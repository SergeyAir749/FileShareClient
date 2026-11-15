/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import style from '@/style/change.name.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppSelector } from '@/components/hooks';
import { submitChangeUserNameServer } from './actions';
import { useIntl } from 'react-intl';
import { Loading } from '@/components/loader';

interface SignupData {
    usernameNew?: string;
}

export default function ChangeName() {
    const { userData } = useAppSelector((state) => state.authReducer);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [error, setError] = useState('');

    const [showLoader, setShowLoader] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

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

    const submitChangeUserName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const userDataObject: SignupData = {};

            if (surname != '') {
                userDataObject['usernameNew'] = `${name} ${surname}`;
            } else {
                userDataObject['usernameNew'] = `${name}`;
            }

            //console.log(userUpData);

            const response = await submitChangeUserNameServer(userDataObject);

            //console.log('Response:', response);

            location.pathname = '/account';
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

    const buttonBackPage = () => {
        router.push('/account');
    };

    return (
        <div className={style.changeName}>
            <form className={style.formChangeName} onSubmit={(e) => submitChangeUserName(e)}>
                {/* <header className={style.accountHeader}>
  
                    <div className={style.buttonBackPageBlock}>
                        <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                        </button>
                    </div>           
                                
                    {/*<div className={style.headerTitle}>
                        
                    </div> 

                </header> */}

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
                        <h2>{intl.formatMessage({ id: 'changeUserName.formTitleH2' })}</h2>
                        <p>{intl.formatMessage({ id: 'changeUserName.formDescriptionP' })}</p>
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

                    {userData != null ? (
                        <div className={style.currentName}>
                            <h3>{intl.formatMessage({ id: 'changeUserName.info.currentName' })}: </h3>
                            <span>{userData.username}</span>
                        </div>
                    ) : (
                        <div className={style.currentName}>
                            <span>{intl.formatMessage({ id: 'changeUserName.info.currentName.loding' })}</span>
                        </div>
                    )}

                    <span className={style.error}>{error}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>
                        {intl.formatMessage({ id: 'changeUserName.button.submit' })}
                    </button>
                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>
                        {intl.formatMessage({ id: 'changeUserName.button.cancel' })}
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

/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { FormEvent, useEffect, useState } from 'react';
import style from '@/style/twoFactorAuth.account.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useIntl } from 'react-intl';
import {
    getStatusTwoFactorAuthServer,
    submitEnebaltTwoFactorAuthServer,
    verifyTwoFactorAuthSessionServer,
} from './actions';
import { Loading } from '@/components/loader';

export default function TwoFactorAuth() {
    const [isVerify, setIsVerify] = useState(false);
    const [statusTwoFactorAuth, setStatusTwoFactorAuth] = useState(false);
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

    const showLoaderFun = () => {
        setShowLoader(true);
    };

    const closeLoaderFun = () => {
        setShowLoader(false);
    };

    const router = useRouter();

    const intl = useIntl();

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    useEffect(() => {
        const verifyTwoFactorAuthSession = async () => {
            try {
                const response = await verifyTwoFactorAuthSessionServer();

                const localSession = sessionStorage.getItem('session');
                const serverSession = response.sessionId;

                if (localSession != serverSession) {
                    router.back();
                } else {
                    setIsVerify(true);

                    const response = await getStatusTwoFactorAuthServer();
                    console.log('Response:', response);
                    setStatusTwoFactorAuth(response.twoFactorAuthstatus);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                closeLoaderFun();

                if (error.message == 'noSessions') {
                    location.pathname = '/account/twoFactorAuth/verification';
                    console.log(error.message);
                } else {
                    console.log(error.message);

                    const serverMessage = error.message;

                    setError(
                        intl.formatMessage({
                            id: `error.massage.${serverMessage}`,
                            defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                        })
                    );
                }
            }
        };

        verifyTwoFactorAuthSession();
    }, []);

    const submitEnebaltTwoFactorAuth = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            showLoaderFun();

            const localSession = sessionStorage.getItem('session');

            if (localSession != null) {
                const sessionObj = {
                    sessionId: localSession,
                };

                const response = await submitEnebaltTwoFactorAuthServer(sessionObj);
                // location.pathname = '/account';
                console.log('Response:', response);
            } else {
                location.pathname = '/account/twoFactorAuth/verification';
            }

            // sessionStorage.removeItem('token');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            closeLoaderFun();
            console.log(error.message);

            const serverMessage = error.message;

            if (serverMessage == 'sessionError') {
                location.pathname = '/account/delete/verification';
            } else {
                setError(
                    intl.formatMessage({
                        id: `error.massage.${serverMessage}`,
                        defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                    })
                );
            }
        }
    };

    const buttonBackPage = () => {
        router.push('/account');
    };

    return (
        <div className={style.twoFactorAuth}>
            <form onSubmit={(e) => submitEnebaltTwoFactorAuth(e)} className={style.twoFactorAuthForm}>
                <header className={style.twoFactorAuthHead}>
                    {/* <div className={style.buttonBackPageBlock}>
                        <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                        </button>
                    </div>            */}

                    {/* <div className={style.headerTitle}>
                        <h2>Аккаунт</h2>
                    </div> */}
                </header>

                <div className={style.content}>
                    <div className={style.formHead}>
                        <div className={style.formIcon}>
                            <svg
                                width="70"
                                height="70"
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
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
                            <h2>{intl.formatMessage({ id: 'twoFactorAuth.formTitleH2' })}</h2>
                            <p>{intl.formatMessage({ id: 'twoFactorAuth.formDescriptionP' })}</p>
                        </div>
                    </div>

                    <div className={style.formInputs}>
                        <div className={style.twoFactorAuthInfo}>
                            {isVerify == true ? (
                                <div className={style.twoFactorAuthStatusBlock}>
                                    <div className={style.twoFactorAuthStatusIcon}>
                                        {statusTwoFactorAuth == true ? (
                                            <img src={'../statusTwoFactorAuthTrue.svg'} alt={'true'} />
                                        ) : (
                                            <img src={'../statusTwoFactorAuthFalse.svg'} alt={'false'} />
                                        )}
                                    </div>

                                    <div className={style.twoFactorAuthStatusText}>
                                        {statusTwoFactorAuth == true ? (
                                            <span>{intl.formatMessage({ id: 'twoFactorAuth.status.true' })}</span>
                                        ) : (
                                            <span>{intl.formatMessage({ id: 'twoFactorAuth.status.false' })}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    <span className={style.error}>{error}</span>

                    {isVerify == true ? (
                        <div className={style.formButtons}>
                            {statusTwoFactorAuth == true ? (
                                <button type="submit" className={style.styleButtonSubmitOFF}>
                                    {intl.formatMessage({ id: 'twoFactorAuth.button.submit.on.false' })}
                                </button>
                            ) : (
                                <button type="submit" className={style.styleButtonSubmitON}>
                                    {intl.formatMessage({ id: 'twoFactorAuth.button.submit.on.true' })}
                                </button>
                            )}

                            <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>
                                {intl.formatMessage({ id: 'twoFactorAuth.button.cancel' })}
                            </button>
                        </div>
                    ) : (
                        <div></div>
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
            </form>
        </div>
    );
}

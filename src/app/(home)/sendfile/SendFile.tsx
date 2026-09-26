'use client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import style from '@/style/sendfile.module.css';
import Link from 'next/link';
import { useIntl } from 'react-intl';

import { useAppSelector } from '@/components/hooks';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
// import { useTranslations } from "next-intl";

import { upLoadFilesServer, upLoadTextServer, valueShareIdServer } from './actions';

interface recipientDetailsData {
    avatar: {
        '400': string;
        '1000': string;
    };
    username: string;
    isGuest: boolean;
}

// sendToUserId - для статуса
// userWillReceiveId - для отмены отправки

function Sendfile() {
    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState('');
    const [shareId, setShareId] = useState('');

    const [option, setOption] = useState('File');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [recipientDetailsDataShow, setRecipientDetailsDataShow] = useState<boolean>(false);
    const [recipientDetailsData, setRecipientDetails] = useState<null | recipientDetailsData>(null);

    const [submitFileLoader, setSubmitFileLoader] = useState(false);

    const [showMessageWhatDeviceID, setShowMessageWhatDeviceID] = useState(false);

    const [progressBarAggregate, setProgressBarAggregate] = useState<number>(0);

    const [successfullySent, setSuccessfullySent] = useState<boolean>(false);

    const { userData } = useAppSelector((state) => state.authReducer);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const fileAddInputRef = useRef<HTMLInputElement | null>(null);
    const textareaInputRef = useRef<HTMLTextAreaElement | null>(null);

    const socketRef = useRef<Socket>(null);
    const intl = useIntl();

    // console.log(intl.messages);
    // console.log('Количество пеерведёных слов:', Object.keys(intl.messages).length);

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
    const fileApiUrl = process.env.NEXT_PUBLIC_SERVER_FILE_API_URL;
    const soketUrl = process.env.NEXT_PUBLIC_SERVER_SOCET_URL;

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(`${soketUrl}/`);
        }

        return () => {
            if (socketRef.current != null) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const showSubmitFileLoaderFun = () => {
        setSubmitFileLoader(true);
    };

    const closeSubmitFileLoaderFun = () => {
        setSubmitFileLoader(false);
    };

    const fileInputChange = () => {
        fileInputRef.current?.click();
    };

    const fileInputAddChange = () => {
        fileAddInputRef.current?.click();
    };

    const selectFunChange = (e: ChangeEvent<HTMLSelectElement>) => {
        //console.log(e.target.value);
        setOption(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        //console.log(1);
        //console.log(e.target.files);

        if (e.target.files != null) {
            const files = e.target.files;
            //console.log(files);
            const fileFilter = [];

            for (let i = 0; i < files.length; i++) {
                if (files[i].size != 0) {
                    fileFilter.push(files[i]);
                }

                //console.log(fileFilter);
            }

            setFiles(fileFilter);
        }
    };

    const CloseFileFun = (index: number) => {
        if (files != null) {
            const fileFilter = [];

            for (let i = 0; i < files.length; i++) {
                if (i != index) {
                    fileFilter.push(files[i]);
                }

                //console.log(fileFilter);
            }

            if (JSON.stringify(fileFilter) == JSON.stringify([])) {
                setFiles([]);
            } else {
                setFiles(fileFilter);
            }
        }
    };

    const AddFileFun = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const filesValue = e.target.files;
            //console.log(filesValue);
            const fileFilter = files;

            for (let i = 0; i < filesValue.length; i++) {
                if (filesValue[i].size != 0) {
                    fileFilter.push(filesValue[i]);
                }

                //console.log(fileFilter);
            }

            setFiles([...fileFilter]);
        }
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (textareaInputRef.current != null) {
            textareaInputRef.current.style.height = 'auto';
            textareaInputRef.current.style.height = `${textareaInputRef.current.scrollHeight + 2}px`;
        }

        setText(e.target.value);
    };

    const valueShareId = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setShareId(value);

        try {
            if (value.length >= 8) {
                setRecipientDetailsDataShow(true);

                const data = await valueShareIdServer(value);

                console.log('Response:', data);

                setRecipientDetails(data);
            } else {
                setRecipientDetails(null);
                setRecipientDetailsDataShow(false);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);
            // console.log('Client caught error:', error.message);

            if (error.message == 'userNotFound') {
                setRecipientDetails(null);
            } else {
                setRecipientDetails(null);
                setRecipientDetailsDataShow(false);
            }
        }
    };

    const upLoadFiles = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (recipientDetailsData != null) {
            try {
                showSubmitFileLoaderFun();

                let username: string = '';

                if (userData?.username != undefined) {
                    username = userData?.username;
                } else {
                    username = 'Гость';
                }

                const sentToUserId = userData?._id; // Для коректной работы статуса файла

                // let sentToUserId = userData?.shareId // Для коректной работы статуса файла
                //console.log(sentToUserId);

                const date = new Date();
                let device = '';

                let hours: number | string = date.getHours();
                let minutes: string | number = date.getMinutes();
                let month: number | string = date.getMonth() + 1;
                let day: number | string = date.getDate();

                if (hours < 10) {
                    hours = '0' + hours;
                }

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }

                if (day < 10) {
                    day = '0' + day;
                }

                if (month < 10) {
                    month = '0' + month;
                }

                const offsetMinutes = new Date().getTimezoneOffset();
                const offsetTo = -offsetMinutes / 60;

                // if -300 = +5 else 300 = -5

                let gtm = '';

                if (offsetTo >= 0) {
                    gtm = '+' + offsetTo;
                } else {
                    gtm = String(offsetTo);
                }

                const dateParse = `${day}.${month}.${date.getFullYear()}, ${hours}:${minutes}`;
                const dateObj = { data: dateParse, gtm: gtm };

                const userAgentString = navigator.userAgent;

                if (/iPhone/i.test(userAgentString)) {
                    device = 'iPhone';
                } else if (/iPad/i.test(userAgentString)) {
                    device = 'iPad';
                } else if (/Macintosh/i.test(userAgentString)) {
                    device = 'MacOS';
                } else if (/Linux/i.test(userAgentString)) {
                    device = 'Linux';
                } else if (/Android/i.test(userAgentString)) {
                    device = 'Android';
                } else if (/Windows/i.test(userAgentString)) {
                    device = 'Windows';
                } else {
                    device = 'Не опредилён';
                }

                if (option == 'Text') {
                    if (text != null) {
                        //console.log(device);
                        //console.log(username);

                        const blob = new Blob([text]);
                        const bayt = blob.size;
                        console.log(bayt.toString());

                        const formData = new FormData();

                        console.log(sentToUserId as string);

                        formData.append('textValue', text);
                        formData.append('data', JSON.stringify(dateObj));
                        formData.append('device', device);
                        formData.append('username', username as string);
                        formData.append('sentToUserId', sentToUserId as string);
                        formData.append('size', bayt.toString());

                        // const formData = {
                        //     textValue: text,
                        //     device: device,
                        //     data: JSON.stringify(dateObj),
                        //     username: username,
                        //     sentToUserId: sentToUserId,
                        //     size: bayt.toString(),
                        // };

                        console.log(formData);

                        // console.log('Response:', response);

                        // const data = await upLoadTextServer(shareId, obj);
                        // console.log('Response:', data);

                        setProgressBarAggregate(0);

                        await axios.post('/api/textLoad/' + shareId, formData, {
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                    setProgressBarAggregate(percent);
                                }
                            },
                        });

                        setProgressBarAggregate(0);

                        // setShareId('');
                        // setText('');

                        if (socketRef.current != null) {
                            socketRef.current.emit('pingfilesShareId', shareId);
                        }

                        // setMessage(intl.formatMessage({ id: 'sendfilePage.massage.sendTextSuccessful' }));
                        // closeSubmitFileLoaderFun();
                        setSuccessfullySent(true);
                        // setRecipientDetailsDataShow(false);
                    }
                } else if (option == 'File') {
                    if (files != null) {
                        const formData = new FormData();

                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        // let filesSize: number = 0;

                        for (let i = 0; i < files.length; i++) {
                            //console.log(files[i]);
                            formData.append('files', files[i]); // 'files' ключ по которому будут переданы файлы
                            // filesSize += files[i].size;
                        }

                        formData.append('device', device);
                        formData.append('data', JSON.stringify(dateObj));
                        formData.append('username', username as string);
                        formData.append('sentToUserId', sentToUserId as string);
                        // formData.append('size', filesSize.toString());

                        setProgressBarAggregate(0);

                        await axios.post('/api/fileLoad/' + shareId, formData, {
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                    setProgressBarAggregate(percent);
                                }
                            },
                        });

                        setProgressBarAggregate(0);

                        // console.log('Response:', response);

                        // const data = await upLoadFilesServer(shareId, formData);
                        // console.log('Response:', data);

                        // setShareId('');
                        // setText('');
                        // setFiles([]);

                        if (fileInputRef.current && fileAddInputRef.current) {
                            fileInputRef.current.value = ''; // Очищаем сам инпут
                            fileAddInputRef.current.value = ''; // Очищаем сам инпут
                        }

                        if (socketRef.current != null) {
                            socketRef.current.emit('pingfilesShareId', shareId);
                        }

                        // setMessage(intl.formatMessage({ id: 'sendfilePage.massage.sendFileSuccessful' }));
                        // closeSubmitFileLoaderFun();
                        setSuccessfullySent(true);
                        // setRecipientDetailsDataShow(false);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setProgressBarAggregate(0);
                closeSubmitFileLoaderFun();

                const serverMessage = error.response.data.error || error.message;
                console.log(error);

                setError(
                    intl.formatMessage({
                        id: `error.massage.${serverMessage}`,
                        defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                    })
                );
            }
        } else {
            setError(
                intl.formatMessage({
                    id: `error.massage.invalidUserID`,
                })
            );
        }
    };

    const funConvertFileSize = (size: string) => {
        const byteSizeNum = Number(size);
        let kilobyteSizeNumRender = 0;

        // Переводим из байтов в киловайты
        kilobyteSizeNumRender = byteSizeNum / 1024;
        console.log('kilobyteSizeNumRender: ', kilobyteSizeNumRender);

        if (kilobyteSizeNumRender >= 1024) {
            // Переводим из киловайты в мегобайт
            kilobyteSizeNumRender = Math.floor(kilobyteSizeNumRender / 1024);

            if (kilobyteSizeNumRender >= 1024) {
                // Переводим из мегобайт в гигабайты
                kilobyteSizeNumRender = Math.floor(kilobyteSizeNumRender / 1024);
                console.log(
                    `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.gigabyte' })}`
                );

                return `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.gigabyte' })}`;
            } else {
                console.log(
                    `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.megabyte' })}`
                );

                return `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.megabyte' })}`;
            }
        } else if (kilobyteSizeNumRender < 1) {
            const byteSizeStrRemoveZeros = String(kilobyteSizeNumRender).replaceAll('0', '');
            const byteSizeStrMin = byteSizeStrRemoveZeros.slice(1, 3);

            console.log(`${byteSizeStrMin} ${intl.formatMessage({ id: 'getfilePage.file.size.byte' })}`);
            return `${byteSizeStrMin} ${intl.formatMessage({ id: 'getfilePage.file.size.byte' })}`;
        } else {
            console.log(
                `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.kilobyte' })}`
            );
            return `${Math.floor(kilobyteSizeNumRender)} ${intl.formatMessage({ id: 'getfilePage.file.size.kilobyte' })}`;
        }
    };

    const showMessageWhatDeviceIDFun = () => {
        if (showMessageWhatDeviceID == true) {
            setShowMessageWhatDeviceID(false);
        } else {
            setShowMessageWhatDeviceID(true);
        }
    };

    const submitFileLoaderPopUpCloseFun = () => {
        setSuccessfullySent(false);
        setSubmitFileLoader(false);

        setShareId('');
        setText('');
        setFiles([]);

        setRecipientDetailsDataShow(false);
    };

    return (
        <div className={style.sendfile}>
            <div className={style.blockForm}>
                <form className={style.formSendFile} onSubmit={(e) => upLoadFiles(e)}>
                    <div className={style.formHead}>
                        <div className={style.formIcon}>
                            {/* <button type="button" onClick={() => changeLanguage("en")}>EN</button>
              <button type="button" onClick={() => changeLanguage("ru")}>RU</button> */}

                            <svg
                                width="70"
                                height="70"
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="10" y="55" width="50" height="4" rx="2" fill="#96C3FF" />
                                <rect
                                    x="33"
                                    y="48"
                                    width="35"
                                    height="4"
                                    rx="2"
                                    transform="rotate(-90 33 48)"
                                    fill="#008CFF"
                                />
                                <rect
                                    width="14.3294"
                                    height="3.82117"
                                    rx="1.91059"
                                    transform="matrix(0.697868 -0.716226 0.697868 0.716226 25 21.2632)"
                                    fill="#008CFF"
                                />
                                <rect
                                    width="14.3294"
                                    height="3.82117"
                                    rx="1.91059"
                                    transform="matrix(0.697868 0.716226 -0.697868 0.716226 35 11)"
                                    fill="#008CFF"
                                />
                            </svg>
                        </div>

                        <div className={style.formTitle}>
                            <h2>{intl.formatMessage({ id: 'sendfilePage.formTitleH2' })}</h2>
                            <p>{intl.formatMessage({ id: 'sendfilePage.formDescriptionP' })}</p>
                        </div>

                        <div className={style.selectBlock}>
                            <select className={style.selectOptionStyle} onChange={(e) => selectFunChange(e)}>
                                <option value="File" defaultValue="">
                                    {intl.formatMessage({ id: 'sendfilePage.selectOptionSend.file' })}
                                </option>
                                <option value="Text">
                                    {intl.formatMessage({ id: 'sendfilePage.selectOptionSend.text' })}
                                </option>
                            </select>
                        </div>
                    </div>

                    {JSON.stringify(files) != JSON.stringify([]) && option != 'Text' ? (
                        <div className={style.filePreview}>
                            <div className={style.filePreviewTitle}>
                                <h3 className={style.setFilePopUpTitleInfo}>
                                    {intl.formatMessage({ id: 'sendfilePage.setFilePopUpTitleInfo' })}
                                </h3>

                                <span className={style.setFilePopUpFilesLength}>
                                    {intl.formatMessage({ id: 'sendfilePage.setFilePopUpFilesLength' })}: {files.length}
                                </span>
                            </div>

                            <div className={style.filePreviewFiles}>
                                {files.map((file, index) => (
                                    <div key={index} className={style.fileItem}>
                                        <div className={style.fileInfo}>
                                            <div className={style.fileIcon}>
                                                <svg
                                                    width="35"
                                                    height="35"
                                                    viewBox="0 0 100 100"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g clipPath="url(#clip0_358_516)">
                                                        <path
                                                            d="M60 30L60.0127 30.5146C60.2805 35.7983 64.6498 40 70 40H100V90C100 95.5228 95.5229 100 90 100H10C4.47715 100 0 95.5228 0 90V10C1.03081e-06 4.47715 4.47715 0 10 0H60V30ZM97.7861 36H70C66.6863 36 64 33.3137 64 30V2.21289L97.7861 36Z"
                                                            fill="#ADADAD"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_358_516">
                                                            <rect width="100" height="100" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>

                                            <div className={style.fileInfoData}>
                                                <span className={style.fileInfoDataName}>{file.name}</span>
                                                <span className={style.fileInfoDataSize}>
                                                    {funConvertFileSize(String(file.size))}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={style.fileClose}>
                                            <button
                                                type="button"
                                                onClick={() => CloseFileFun(index)}
                                                className={style.buttonFileClose}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24px"
                                                    viewBox="0 -960 960 960"
                                                    width="24px"
                                                    fill="var(--color-text)"
                                                >
                                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className={style.Fileblock}>
                                    <button
                                        type="button"
                                        className={style.styleButton}
                                        onClick={() => fileInputAddChange()}
                                    >
                                        {intl.formatMessage({ id: 'sendfilePage.addFile' })}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : option == 'Text' ? (
                        <div></div>
                    ) : (
                        <div className={style.notFile}>
                            <span>{intl.formatMessage({ id: 'sendfilePage.noFilesSelected' })}</span>
                        </div>
                    )}

                    <div className={style.formInputs}>
                        {option == 'Text' ? (
                            <textarea
                                ref={textareaInputRef}
                                value={text}
                                placeholder={intl.formatMessage({ id: 'sendfilePage.inputTextTextarea' })}
                                onChange={(e) => handleTextChange(e)}
                                className={style.styleTextareaInput}
                            ></textarea>
                        ) : option == 'File' ? (
                            <div className={style.Fileblock}>
                                <input
                                    type="file"
                                    name="files"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFileChange(e)}
                                    className={style.fileInput}
                                    required
                                    multiple
                                />
                                <input
                                    type="file"
                                    name="filesAdd"
                                    ref={fileAddInputRef}
                                    onChange={(e) => AddFileFun(e)}
                                    className={style.fileInput}
                                    multiple
                                />
                                <button
                                    className={style.styleButtonFileSelect}
                                    type="button"
                                    onClick={() => fileInputChange()}
                                >
                                    {intl.formatMessage({ id: 'sendfilePage.inputSelectFile' })}
                                </button>
                            </div>
                        ) : null}

                        <div className={style.inputDeviceIDBlock}>
                            <input
                                type="tel"
                                value={shareId}
                                name="userId"
                                onChange={(e) => valueShareId(e)}
                                placeholder={intl.formatMessage({ id: 'sendfilePage.inputDeviceID' })}
                                className={` ${style.styleInputDeviceID} `}
                                required
                            />
                            <button
                                type="button"
                                className={style.styleButtonWhatDeviceID}
                                onClick={() => showMessageWhatDeviceIDFun()}
                            >
                                {showMessageWhatDeviceID != false ? (
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 100 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_366_516)">
                                            <path
                                                d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM74.749 24.251C73.187 22.689 70.6539 22.689 69.0918 24.251L50 43.3428L30.9082 24.251C29.3461 22.689 26.813 22.6889 25.251 24.251C23.6889 25.813 23.689 28.3461 25.251 29.9082L44.3428 49L25.251 68.0918C23.689 69.6539 23.689 72.1869 25.251 73.749C26.8131 75.3111 29.3461 75.3111 30.9082 73.749L50 54.6572L69.0918 73.749C70.6539 75.311 73.187 75.3111 74.749 73.749C76.3111 72.187 76.311 69.6539 74.749 68.0918L55.6572 49L74.749 29.9082C76.311 28.3461 76.3111 25.813 74.749 24.251Z"
                                                fill="#777777"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_366_516">
                                                <rect width="100" height="100" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                ) : (
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_364_516)">
                                            <path
                                                d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM50 78C48.3431 78 47 79.3431 47 81C47 82.6569 48.3431 84 50 84C51.6569 84 53 82.6569 53 81C53 79.3431 51.6569 78 50 78ZM53.6553 16.3613C49.9818 15.6359 46.1736 16.0082 42.7119 17.4316C39.25 18.8552 36.2871 21.2672 34.2012 24.3662C32.1151 27.4656 31.0001 31.112 31 34.8438C31 36.5006 32.3431 37.8438 34 37.8438C35.6569 37.8438 37 36.5006 37 34.8438C37.0001 32.3084 37.7575 29.8284 39.1787 27.7168C40.6002 25.6049 42.6226 23.9553 44.9932 22.9805C47.3639 22.0056 49.974 21.7508 52.4922 22.248C55.0103 22.7453 57.3208 23.9716 59.1318 25.7695C60.9427 27.5672 62.1735 29.8555 62.6719 32.3428C63.1701 34.8298 62.9145 37.4078 61.9365 39.752C60.9584 42.0963 59.3004 44.1036 57.1689 45.5176C56.1715 46.1792 55.0911 46.697 53.9609 47.0605C50.6362 48.1301 46.96 51.1312 46.96 55.6885V65.7402C46.96 67.397 48.3032 68.7402 49.96 68.7402C51.6168 68.7402 52.9599 67.397 52.96 65.7402V55.6885C52.96 54.7229 53.8661 53.3942 55.7988 52.7725C57.4486 52.2417 59.0267 51.4851 60.4854 50.5176C63.6029 48.4496 66.0359 45.5082 67.4736 42.0625C68.9114 38.6166 69.2879 34.8237 68.5547 31.1641C67.8214 27.5046 66.0125 24.1456 63.3594 21.5117C60.7065 18.8781 57.3288 17.0868 53.6553 16.3613Z"
                                                fill="#777777"
                                            />
                                        </g>

                                        <defs>
                                            <clipPath id="clip0_364_516">
                                                <rect width="100" height="100" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {recipientDetailsDataShow != false ? (
                            recipientDetailsData != null ? (
                                <div className={style.recipientDetailsBlock}>
                                    {recipientDetailsData.isGuest == undefined ? (
                                        <div className={style.recipientDetails}>
                                            <div className={style.recipientDetailsAvatarBlock}>
                                                <img
                                                    src={recipientDetailsData.avatar[400]}
                                                    alt=""
                                                    className={style.recipientDetailsAvatar}
                                                />
                                            </div>

                                            <div className={style.recipientDetailsInfo}>
                                                <span>{recipientDetailsData.username}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={style.recipientDetails}>
                                            <div className={style.recipientDetailsAvatarBlock}>
                                                <img
                                                    src={apiUrl + '/api/images/avatars/default'}
                                                    alt=""
                                                    className={style.recipientDetailsAvatar}
                                                />
                                            </div>

                                            <div className={style.recipientDetailsInfo}>
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'userIsGuest.username',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={style.recipientDetailsNotFound}>
                                    <span>{intl.formatMessage({ id: 'sendfilePage.userNotfound' })}</span>
                                </div>
                            )
                        ) : (
                            <div style={{ display: 'none' }}></div>
                        )}

                        {showMessageWhatDeviceID != false ? (
                            <div className={style.messageWhatDeviceIDBlock}>
                                <span>
                                    {intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.1' })}&nbsp;
                                    <Link href={window?.location?.origin}>{window?.location?.origin}</Link>
                                    &nbsp;{intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.1.5' })}
                                </span>
                                <span>{intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.2' })}</span>
                                <span>{intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.3' })}</span>

                                {option == 'File' ? (
                                    <span>
                                        {intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.4.file' })}
                                    </span>
                                ) : option == 'Text' ? (
                                    <span>
                                        {intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.4.text' })}
                                    </span>
                                ) : (
                                    <span>
                                        {intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.4.file' })}
                                    </span>
                                )}

                                <span>{intl.formatMessage({ id: 'sendfilePage.messageWhatDeviceIDBlock.5' })}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>

                    {/* <button type="button" onClick={() => setSubmitFileLoader(true)}>
                        O
                    </button> */}

                    {submitFileLoader != false ? (
                        <div className={style.submitFileLoaderBackground}>
                            <div className={style.submitFileLoaderPopUp}>
                                <div className={style.submitFileLoaderPopUpHeader}>
                                    {successfullySent != true ? (
                                        <div>
                                            <h2>{intl.formatMessage({ id: 'sendfilePage.submitLoaderPopUp.h2' })}</h2>
                                        </div>
                                    ) : (
                                        <div>
                                            {JSON.stringify(files) != JSON.stringify([]) && option != 'Text' ? (
                                                <h2>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.submitLoaderPopUp.h2.file.successful',
                                                    })}
                                                </h2>
                                            ) : option == 'Text' ? (
                                                <h2>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.submitLoaderPopUp.h2.text.successful',
                                                    })}
                                                </h2>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    )}

                                    {/* <button type="button" onClick={() => setSubmitFileLoader(false)}>
                                        X
                                    </button>

                                    {successfullySent != true ? (
                                        <button type="button" onClick={() => setSuccessfullySent(true)}>
                                            S
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => setSuccessfullySent(false)}>
                                            SC
                                        </button>
                                    )} */}
                                </div>

                                <div className={style.submitFileLoaderPopUpContent}>
                                    <div className={style.submitFileLoaderPopUpUserRecipientDataBlock}>
                                        <div className={style.submitFileLoaderPopUpWhoToSendItToHeader}>
                                            <h3>
                                                {intl.formatMessage({
                                                    id: 'sendfilePage.submitLoaderPopUp.WhoToSendItTo',
                                                })}
                                            </h3>
                                        </div>

                                        {recipientDetailsDataShow != false ? (
                                            recipientDetailsData != null ? (
                                                <div className={style.submitFileLoaderPopUpRecipientDetailsBlock}>
                                                    {recipientDetailsData.isGuest == undefined ? (
                                                        <div className={style.recipientDetails}>
                                                            <div
                                                                className={
                                                                    style.submitFileLoaderPopUpRecipientDetailsAvatarBlock
                                                                }
                                                            >
                                                                <img
                                                                    src={recipientDetailsData.avatar[400]}
                                                                    alt=""
                                                                    className={
                                                                        style.submitFileLoaderPopUpRecipientDetailsAvatar
                                                                    }
                                                                />
                                                            </div>

                                                            <div
                                                                className={
                                                                    style.submitFileLoaderPopUpRecipientDetailsInfo
                                                                }
                                                            >
                                                                <span>{recipientDetailsData.username}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={style.recipientDetails}>
                                                            <div className={style.recipientDetailsAvatarBlock}>
                                                                <img
                                                                    src={apiUrl + '/api/images/avatars/default'}
                                                                    alt=""
                                                                    className={
                                                                        style.submitFileLoaderPopUpRecipientDetailsAvatar
                                                                    }
                                                                />
                                                            </div>

                                                            <div
                                                                className={
                                                                    style.submitFileLoaderPopUpRecipientDetailsInfo
                                                                }
                                                            >
                                                                <span>
                                                                    {intl.formatMessage({
                                                                        id: 'userIsGuest.username',
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={style.submitFileLoaderPopUpRecipientDetailsNotFound}>
                                                    <span>
                                                        {intl.formatMessage({ id: 'sendfilePage.userNotfound' })}
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            <div style={{ display: 'none' }}></div>
                                        )}
                                    </div>

                                    <div className={style.submitFileLoaderPopUpPreviewFilesBlock}>
                                        {JSON.stringify(files) != JSON.stringify([]) && option != 'Text' ? (
                                            <div className={style.submitFileLoaderPopUpPreviewFilesInfo}>
                                                <h3>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.submitLoaderPopUp.sendFileBlock.title.files',
                                                    })}
                                                </h3>
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.submitLoaderPopUp.sendFileBlock.filesLength',
                                                    })}
                                                    : {files.length}
                                                </span>
                                            </div>
                                        ) : option == 'Text' ? (
                                            <div className={style.submitFileLoaderPopUpPreviewFilesInfo}>
                                                <h3>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.submitLoaderPopUp.sendFileBlock.title.text',
                                                    })}
                                                </h3>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}

                                        {JSON.stringify(files) != JSON.stringify([]) && option != 'Text' ? (
                                            <div className={style.submitFileLoaderPopUpPreviewFilesListBlock}>
                                                <div className={style.submitFileLoaderPopUpPreviewFilesList}>
                                                    {files.map((file, index) => (
                                                        <div key={index} className={style.fileItem}>
                                                            <div className={style.fileInfo}>
                                                                <div className={style.fileIcon}>
                                                                    <svg
                                                                        width="35"
                                                                        height="35"
                                                                        viewBox="0 0 100 100"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <g clipPath="url(#clip0_358_516)">
                                                                            <path
                                                                                d="M60 30L60.0127 30.5146C60.2805 35.7983 64.6498 40 70 40H100V90C100 95.5228 95.5229 100 90 100H10C4.47715 100 0 95.5228 0 90V10C1.03081e-06 4.47715 4.47715 0 10 0H60V30ZM97.7861 36H70C66.6863 36 64 33.3137 64 30V2.21289L97.7861 36Z"
                                                                                fill="#ADADAD"
                                                                            />
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_358_516">
                                                                                <rect
                                                                                    width="100"
                                                                                    height="100"
                                                                                    fill="white"
                                                                                />
                                                                            </clipPath>
                                                                        </defs>
                                                                    </svg>
                                                                </div>

                                                                <div className={style.fileInfoData}>
                                                                    <span className={style.fileInfoDataName}>
                                                                        {file.name}
                                                                    </span>
                                                                    <span className={style.fileInfoDataSize}>
                                                                        {funConvertFileSize(String(file.size))}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : option == 'Text' ? (
                                            <div className={style.styleTextareaInputLoaderPopUpPreview}>{text}</div>
                                        ) : (
                                            <div className={style.submitFileLoaderPopUpPreviewListNotFile}>
                                                <span>
                                                    {intl.formatMessage({ id: 'sendfilePage.noFilesSelected' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {successfullySent != true ? (
                                    <div className={style.submitFileLoaderPopUpFooter}>
                                        <div className={style.submitFileLoaderPopUpProgressBarBlock}>
                                            <div className={style.submitFileLoaderPopUpProgressBar}>
                                                <div
                                                    style={{ width: progressBarAggregate + '%' }}
                                                    className={style.submitFileLoaderPopUpProgressBarAggregate}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className={style.submitFileLoaderPopUpWarningDoNotClose}>
                                            <span>
                                                {intl.formatMessage({
                                                    id: 'sendfilePage.submitLoaderPopUp.warningDoNotClosePopUp',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={style.submitFileLoaderPopUpFooter}>
                                        <div className={style.submitFileLoaderPopUpSuccessfulBlock}>
                                            {JSON.stringify(files) != JSON.stringify([]) && option != 'Text' ? (
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.massage.sendFileSuccessful',
                                                    })}
                                                </span>
                                            ) : option == 'Text' ? (
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'sendfilePage.massage.sendTextSuccessful',
                                                    })}
                                                </span>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>

                                        <div className={style.styleButtonFileLoaderPopUpCloseBlock}>
                                            <button
                                                type="button"
                                                onClick={() => submitFileLoaderPopUpCloseFun()}
                                                className={style.styleButtonFileLoaderPopUpClose}
                                            >
                                                {intl.formatMessage({
                                                    id: 'sendfilePage.submitLoaderPopUp.close',
                                                })}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <div className={style.formButtons} style={{ color: 'white' }}>
                        {submitFileLoader != false ? (
                            <button className={style.styleButtonSubmitFileLoader} type="button">
                                <svg
                                    width="25"
                                    height="25"
                                    className={style.userDataLoaderImg}
                                    viewBox="0 0 50 50"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_223_516)">
                                        <circle cx="25" cy="25" r="22.5" stroke="#132a47" strokeWidth="5" />
                                        <path
                                            d="M34.5524 45.3716C35.1386 46.6217 34.6033 48.1232 33.3009 48.5817C29.1743 50.0343 24.7234 50.3834 20.3948 49.5722C15.2442 48.6069 10.5271 46.0475 6.91016 42.2557C3.29318 38.4638 0.959162 33.6313 0.237921 28.4408C-0.368215 24.0788 0.19048 19.6493 1.83617 15.5958C2.35556 14.3165 3.88066 13.8527 5.10172 14.4972V14.4972C6.32277 15.1417 6.77389 16.6504 6.28665 17.9423C5.1119 21.0571 4.72854 24.4293 5.19034 27.7527C5.76733 31.905 7.63454 35.7711 10.5281 38.8045C13.4217 41.838 17.1954 43.8855 21.3159 44.6578C24.6137 45.2758 28.0003 45.052 31.1671 44.0255C32.4805 43.5997 33.9662 44.1215 34.5524 45.3716V45.3716Z"
                                            fill="#C7E6FF"
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
                            <button className={style.styleButtonSubmit} type="submit">
                                {intl.formatMessage({ id: 'sendfilePage.buttonSubmitSend' })}
                            </button>
                        )}

                        <span className={style.message}>{message}</span>
                        <span className={style.error}>{error}</span>
                    </div>

                    <div className={style.navExchangeBlock}>
                        <div className={style.navExchange}>
                            <a className={`${style.LinkExchange}`} href={'/getfile'}>
                                {intl.formatMessage({ id: 'sendfilePage.buttonLinkGet' })}
                            </a>
                            <Link className={`${style.LinkExchange} ${style.select}`} href={'/sendfile'}>
                                {intl.formatMessage({ id: 'sendfilePage.buttonLinkSend' })}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Sendfile;

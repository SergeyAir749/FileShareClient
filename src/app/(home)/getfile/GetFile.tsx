'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import style from '@/style/getfile.module.css';

import { useAppSelector } from '@/components/hooks';
import { io, Socket } from 'socket.io-client';

import { useIntl } from 'react-intl';

import Link from 'next/link';
import axios from 'axios';
import { allFilesCancelFunServer, fileAcceptFunServer, fileCancelFunServer, textCopyFunServer } from './actions';

import Cookies from 'js-cookie';

interface FileItem {
    filename: string;
    sentFromDevice: string;
    sentToUser: string;
    userWillReceive: string;
    text: string;
    data:
        | {
              data: string;
              gtm: string;
          }
        | string;
    size: string;
    id: string;
}

export default function Getfile() {
    const [showFilePopUp, setShowFilePopUp] = useState(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const { userData } = useAppSelector((state) => state.authReducer);
    const [timeFormat, setTimeFormat] = useState<string | null>(null);
    const [popUpFilesErrorMessage, setPopUpFilesErrorMessage] = useState<string>('');
    // const [popUpFilesMessage, setPopUpFilesMessage] = useState<string>(э);
    const [showTextCopyMessage, setShowTextCopyMessage] = useState<boolean>(false);

    const [shareIdCopy, setShareIdCopy] = useState<boolean>(false);

    const [showFiltersPopUp, setShowFiltersPopUp] = useState(false);

    const intl = useIntl();

    // console.log(intl);

    useEffect(() => {
        const timeFormat = localStorage.getItem('timeFormat');
        if (timeFormat != null) {
            setTimeFormat(timeFormat);
        }
    }, []);

    // const [timeZone, setTimeZone] = useState('');

    const socketRef = useRef<Socket>(null);

    const fileApiUrl = process.env.NEXT_PUBLIC_SERVER_FILE_API_URL;
    const soketUrl = process.env.NEXT_PUBLIC_SERVER_SOCET_URL;

    // При локальном тестировании сокеты могут не работь из-за вот этого кода:

    //return () => {
    //     if (socketRef.current != null) {
    //         socketRef.current.disconnect();
    //         socketRef.current = null;
    //     }
    // };

    // На сервере (хостинге) всё будит работать нармольно

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(`${soketUrl}/`);
        }

        console.log('socketRef.current: ', socketRef.current);

        return () => {
            if (socketRef.current != null) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            console.log('return socketRef.current: ', socketRef.current);
        };
    }, []);

    useEffect(() => {
        // console.log('wsfc1');

        if (userData?.shareId != undefined && socketRef.current != null) {
            // console.log('wsfc2');

            socketRef.current.on('files', async (files: []) => {
                // console.log('wsfc4');
                //console.log(files);
                // setFiles([]);
                setFiles(files);
                showFilesPopUpFun();
            });

            socketRef.current.emit('pingfilesShareId', userData?.shareId);

            // console.log('wsfc3');
        }
    }, [userData?.shareId]);

    const [filters, setFilters] = useState({
        sentToUser: '',
        date: '',
        dateParse: '',
        type: 'all', // all | file | text
        status: 'all', // all | sent | accepted | refusal
        search: '',
    });

    const filteredGetFile = files?.filter((file) => {
        // Фильтр по дате
        if (filters.dateParse) {
            console.log(filters.dateParse);

            if (typeof file.data === 'object') {
                if (!file.data.data?.includes(filters.dateParse)) return false;
            } else if (typeof file.data === 'string') {
                if (!file.data?.includes(filters.dateParse)) return false;
            }
        }

        // Поиск по имени отпровителя
        if (filters.sentToUser != '') {
            console.log('file.sentToUser:', file.sentToUser);
            const sentToUserNames = filters.sentToUser.split(', ');
            console.log(sentToUserNames);

            if (!sentToUserNames.includes(file.sentToUser)) return false;
        }

        // Тип
        if (filters.type == 'file' && !file.filename) return false;
        if (filters.type == 'text' && !file.text) return false;

        // Поиск
        if (filters.search) {
            const search = filters.search.toLowerCase();
            let target = '';

            if (file.filename != undefined) {
                target = file.filename.toLowerCase();
            } else if (file.text != undefined) {
                target = file.text.toLowerCase();
            }

            if (!target.includes(search)) return false; // <- Исключить файл
        }

        return true; // <- Оставить файл
    });

    function dateParser(e: ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value;

        const date = new Date(value);

        let dateParse = '';

        let day: string | number = date.getDate();
        let month: string | number = date.getMonth() + 1;

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        console.log(date);

        dateParse = `${day}.${month}.${date.getFullYear()}`;

        setFilters({ ...filters, date: value, dateParse: dateParse });
    }

    const filesResetFiltersFun = () => {
        setFilters({
            sentToUser: '',
            date: '',
            dateParse: '',
            type: 'all',
            status: 'all',
            search: '',
        });
    };

    const showFilesPopUpFun = () => {
        setShowFilePopUp(true);
    };

    const closeFilesPopUpFun = () => {
        setShowFilePopUp(false);
    };

    const fileAcceptFun = async (filename: string, id: string) => {
        try {
            //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

            if (userData?.shareId != undefined) {
                const response = await fileAcceptFunServer(userData?.shareId, id);

                const link = document.createElement('a');
                link.download = String(filename);

                link.href = response.url;
                link.click();
            }
            //console.log(response.data);

            //console.log(link);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);

            const serverMessage = error.message;

            setPopUpFilesErrorMessage(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }

        //console.log({msg:'Файлы загружины'});

        const newFiles = files.filter((item) => item.id != id);

        if (JSON.stringify(newFiles) == JSON.stringify([])) {
            setShowFilePopUp(false);
        }
        setFiles(newFiles);
    };

    const textCopyFun = async (text: string, id: string) => {
        try {
            //console.log(text);
            navigator.clipboard.writeText(String(text));

            if (userData?.shareId != undefined) {
                const response = await textCopyFunServer(userData?.shareId, id);
                //console.log(response.data);

                const newFiles = files.filter((item) => item.id != id);
                if (JSON.stringify(newFiles) == JSON.stringify([])) {
                    setShowFilePopUp(false);
                }
                setFiles(newFiles);

                if (showTextCopyMessage) return;

                setShowTextCopyMessage(true);

                setTimeout(() => {
                    setShowTextCopyMessage(false);
                }, 5000);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);

            const serverMessage = error.message;

            setPopUpFilesErrorMessage(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    const filesAcceptFun = async () => {
        //console.log(String(files[0]?.filename));

        for (let i = 0; i < files.length; i++) {
            if (files[i].text != undefined) {
                try {
                    navigator.clipboard.writeText(String(files[i].text));

                    if (userData?.shareId != undefined) {
                        const response = await textCopyFunServer(userData?.shareId, files[i].id);
                        //console.log(response.data);

                        const newFiles = files.filter((item) => item.id != files[i].id);
                        if (JSON.stringify(newFiles) == JSON.stringify([])) {
                            setShowFilePopUp(false);
                        }
                        setFiles(newFiles);

                        if (showTextCopyMessage) return;

                        setShowTextCopyMessage(true);

                        setTimeout(() => {
                            setShowTextCopyMessage(false);
                        }, 5000);
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.log(error.message);

                    const serverMessage = error.message;

                    setPopUpFilesErrorMessage(
                        intl.formatMessage({
                            id: `error.massage.${serverMessage}`,
                            defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                        })
                    );
                }
            } else if (files[i].filename != undefined) {
                try {
                    //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

                    if (userData?.shareId != undefined) {
                        const response = await fileAcceptFunServer(userData?.shareId, files[i].id);

                        const link = document.createElement('a');
                        link.download = String(files[i].filename);
                        link.href = response.url;
                        link.classList.add('hide');

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        const newFiles = files.filter((item) => item.id != files[i].id);
                        setFiles(newFiles);

                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }

                    //console.log(response.data);

                    //console.log(link);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.log(error.message);

                    const serverMessage = error.message;

                    setPopUpFilesErrorMessage(
                        intl.formatMessage({
                            id: `error.massage.${serverMessage}`,
                            defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                        })
                    );
                }
            }
        }

        //console.log({msg:'Файлы загружины'});
        setShowFilePopUp(false);
        setFiles([]);
    };

    const allFilesCancelFun = async () => {
        try {
            if (userData?.shareId != undefined) {
                const response = await allFilesCancelFunServer(userData?.shareId);
                setFiles([]);
            }
            //console.log(response.data);

            setShowFilePopUp(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);

            const serverMessage = error.message;

            setPopUpFilesErrorMessage(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    const fileCancelFun = async (id: string) => {
        try {
            if (userData?.shareId != undefined) {
                const response = await fileCancelFunServer(userData?.shareId, id);
                //console.log(response.data);

                if (JSON.stringify(response.data) == JSON.stringify([])) {
                    setShowFilePopUp(false);
                }
            }

            const newFiles = files.filter((item) => item.id != id);
            setFiles(newFiles);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);

            const serverMessage = error.message;

            setPopUpFilesErrorMessage(
                intl.formatMessage({
                    id: `error.massage.${serverMessage}`,
                    defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                })
            );
        }
    };

    const dateParserTimeZone = (date: string, gtm: string | undefined) => {
        // -300 -> GTM+5
        // 300 -> GTM-5
        // -180 -> GTM+3
        // 180 -> GTM-3

        if (gtm != undefined) {
            if (!!Number(gtm)) {
                console.log(date);
                console.log(gtm);

                const dateSplit = date.split(', ');

                // console.log(dateSplit);

                const dayMonthFullSplit = dateSplit[0].split('.');
                const taimSplit = dateSplit[1].split(':');

                // console.log(dayMonthFullSplit);
                // console.log(taimSplit);

                let month: string | number = Number(dayMonthFullSplit[1]);

                if (month < 10) {
                    month = '0' + month;
                }

                // //${year}-${month}-${day}T${time}:00
                const dateParse = `${dayMonthFullSplit[2]}-${month}-${dayMonthFullSplit[0]}T${taimSplit[0] + ':' + taimSplit[1]}:00`;
                const newDate = new Date(dateParse);
                console.log(newDate);
                console.log(newDate.getMinutes());

                // console.log(dateParse);

                // Получаем дату в удобном формате
                // Пример: "08.03.2026, 11:43" -> "Sun Feb 08 2026 11:43:00 GMT+0500"

                // Перевести в часы (знак меняется на противоположный)
                const offsetFrom = Number(gtm);
                const offsetMinutes = new Date().getTimezoneOffset();
                console.log('offsetMinutes:', offsetMinutes);
                const offsetTo = -offsetMinutes / 60; // -5 -> 5 | 5 -> -5
                const diff = offsetFrom - offsetTo; // 5 - 4 = 1 | 5 - (-4) = 9

                // const diff = offsetTo - offsetFrom
                console.log('offsetTo:', offsetTo);
                console.log('-');
                console.log('offsetFrom:', offsetFrom);
                console.log('=');
                console.log('diff:', diff);

                console.log("String(offsetTo).includes('.5')", String(offsetTo).includes('.5'));
                console.log("String(offsetTo).includes('.75')", String(offsetTo).includes('.75'));

                console.log('-offsetMinutes >= 0', -offsetMinutes >= 0);

                if (-offsetMinutes >= 0) {
                    // +

                    const sign = offsetTo >= 0 ? '+' : '';
                    console.log('GTM' + sign + offsetTo);
                    // newDate.setHours(newDate.getHours() + diff);

                    if (String(offsetTo).includes('.5') == true) {
                        const diffHours = String(diff).split('.');
                        console.log('diffHours:', diffHours);

                        console.log('diffHours[0].split()[0]:', diffHours[0].split('')[0]);

                        if (diffHours[0].split('')[0] == '-') {
                            newDate.setMinutes(newDate.getMinutes() + 30);
                            console.log('newDate.getMinutes():', newDate.getMinutes());
                            console.log('newDate.getMinutes() + 30:', newDate.getMinutes() + 30);
                            newDate.setHours(newDate.getHours() - Number(diffHours[0]));
                        } else if (diffHours[0].split('')[0] != '-') {
                            if (typeof Number(diffHours[0]) == 'number') {
                                newDate.setMinutes(newDate.getMinutes() - 30);
                                console.log('newDate.getMinutes():', newDate.getMinutes());
                                console.log('newDate.getMinutes() - 30:', newDate.getMinutes() - 30);
                                newDate.setHours(newDate.getHours() - Number(diffHours[0]));
                            }
                        }
                    } else if (String(offsetTo).includes('.75') == true) {
                        const diffHours = String(diff).split('.');
                        console.log('diffHours:', diffHours);

                        console.log('diffHours[0].split()[0]:', diffHours[0].split('')[0]);

                        if (diffHours[0].split('')[0] == '-') {
                            newDate.setMinutes(newDate.getMinutes() + 45);
                            console.log('newDate.getMinutes():', newDate.getMinutes());
                            console.log('newDate.getMinutes() + 45:', newDate.getMinutes() + 45);
                            newDate.setHours(newDate.getHours() - Number(diffHours[0]));
                        } else if (diffHours[0].split('')[0] != '-') {
                            if (typeof Number(diffHours[0]) == 'number') {
                                newDate.setMinutes(newDate.getMinutes() - 45);
                                console.log('newDate.getMinutes():', newDate.getMinutes());
                                console.log('newDate.getMinutes() - 45:', newDate.getMinutes() - 45);
                                newDate.setHours(newDate.getHours() - Number(diffHours[0]));
                            }
                        }
                    } else {
                        newDate.setHours(newDate.getHours() - diff);
                    }
                }

                console.log('newDate:', newDate);

                const hourCycle =
                    timeFormat == '12' ? 'h12' : timeFormat == '23' ? 'h23' : timeFormat == null ? 'h23' : 'h23';

                const formatter = new Intl.DateTimeFormat('en-EN', {
                    hourCycle,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                const newDateForma = formatter.format(newDate);
                const newDateFormaSplit = newDateForma.split('/');

                console.log(newDateForma);
                console.log(newDateFormaSplit);
                console.log(`${newDateFormaSplit[1]}.${newDateFormaSplit[0]}.${newDateFormaSplit[2]}`);

                const newDateParse = `${newDateFormaSplit[1]}.${newDateFormaSplit[0]}.${newDateFormaSplit[2]}`;

                console.log(newDateParse);

                return newDateParse;

                // // 3. Вычисляем смещение в миллисекундах
                // // Разница между текущим (UTC+5) и целевым (UTC+target)
                // const diffInHours = offsetHours - 5;
                // date.setHours(date.getHours() + diffInHours);

                // // 4. Форматируем результат обратно в красивый вид
                // return date.toLocaleString('ru-RU', {
                //     day: '2-digit',
                //     month: '2-digit',
                //     year: 'numeric',
                //     hour: '2-digit',
                //     minute: '2-digit',
                // });
            } else {
                return `${date} (${intl.formatMessage({ id: 'error.massage.senderTimeZoneUndefined' })})`;
            }
        } else {
            return `${date} (${intl.formatMessage({ id: 'error.massage.senderTimeZoneUndefined' })})`;
        }
    };

    // dateParserTimeZone('08.03.2026, 11:43', '+5');

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

    // funConvertFileSize('50');
    // funConvertFileSize('500');
    // funConvertFileSize('1000');

    // funConvertFileSize('5000');
    // funConvertFileSize('50000');
    // funConvertFileSize('5000000');
    // funConvertFileSize('1024');

    //console.log(JSON.stringify(files));
    //console.log(JSON.stringify(files) != JSON.stringify([]));

    const showFiltersPopUpFun = () => {
        setShowFiltersPopUp(true);
    };

    const closeFiltersPopUpFun = () => {
        setShowFiltersPopUp(false);
    };

    const shareIdCopyFun = async () => {
        navigator.clipboard.writeText(String(userData?.shareId));

        setShareIdCopy(true);

        setTimeout(() => {
            setShareIdCopy(false);
        }, 5000);
    };

    return (
        <div className={style.getfile}>
            <div className={style.pageContent}>
                <div className={style.pageGetfile}>
                    {/* popup filters file */}

                    {/* {showFiltersPopUp != false ? ( */}
                    <div
                        className={`${style.filtersGetFilePopUpBackground} ${showFiltersPopUp == true ? style.filtersGetFilePopUpShow : ''}`}
                    >
                        <div className={style.filtersGetFilePopUp}>
                            <div className={style.filtersGetFilePopUpMain}>
                                <div className={style.filtersGetFilePopUpHeader}>
                                    <h2>{intl.formatMessage({ id: 'filtersFilePop.titleH2' })}</h2>

                                    <button
                                        type="button"
                                        onClick={() => closeFiltersPopUpFun()}
                                        className={style.buttonFilePopUpClose}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="30px"
                                            viewBox="0 -960 960 960"
                                            width="30px"
                                            fill="var(--color-text)"
                                        >
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className={style.filtersGetFilePopUpOptions}>
                                    <div className={style.filtersGetFilePopUpOptionBlock}>
                                        <input
                                            type="date"
                                            className={style.inputFiltersDate}
                                            value={filters.date}
                                            onChange={(e) => dateParser(e)}
                                            name="date"
                                        />

                                        <select
                                            className={style.selectOptionStyle}
                                            value={filters.type}
                                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        >
                                            <option value="all">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfilters.all',
                                                })}
                                            </option>
                                            <option value="file">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfilters.files',
                                                })}
                                            </option>
                                            <option value="text">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfilters.texts',
                                                })}
                                            </option>
                                        </select>

                                        <input
                                            type="text"
                                            className={style.inputFiltersText}
                                            value={filters.sentToUser}
                                            onChange={(e) => setFilters({ ...filters, sentToUser: e.target.value })}
                                            name="sentToUser"
                                            placeholder={intl.formatMessage({
                                                id: 'filtersFilePop.selectOptionfilters.sentToUserNames',
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={style.filtersGetFilePopUpButtons}>
                                <button
                                    type="button"
                                    onClick={() => filesResetFiltersFun()}
                                    className={style.styleButtonResetFilters}
                                >
                                    {intl.formatMessage({
                                        id: 'filtersFilePop.resetFilters',
                                    })}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ) : (
                        <div></div>
                    )} */}

                    {/* file popup */}

                    {/* {JSON.stringify(files) != JSON.stringify([]) && showFilePopUp != false ? ( */}
                    <div
                        className={` ${style.getFilePopUpBackground} ${JSON.stringify(files) != JSON.stringify([]) && showFilePopUp != false ? style.getFilePopUpBackgroundShow : ''} `}
                    >
                        <div className={style.getFilePopUp}>
                            <div className={style.acceptFiles}>
                                <header className={style.getFilePopUpHeader}>
                                    <div className={style.getFilePopUpTitle}>
                                        <h2 className={style.getFilePopUpTitleInfo}>
                                            {intl.formatMessage({ id: 'getfilePage.getFilePopUpTitleInfoH2' })}
                                        </h2>

                                        <span className={style.getFilePopUpFilesLength}>
                                            {intl.formatMessage({ id: 'getfilePage.getFilePopUpFilesLengthSpan' })}:{' '}
                                            {filteredGetFile.length}
                                        </span>
                                    </div>

                                    <div className={style.getFilePopUpHeaderButtons}>
                                        <button
                                            type="button"
                                            onClick={() => showFiltersPopUpFun()}
                                            className={style.buttonFilefilterPopUp}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="30px"
                                                viewBox="0 -960 960 960"
                                                width="30px"
                                                fill="var(--color-text)"
                                            >
                                                <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => closeFilesPopUpFun()}
                                            className={style.buttonFilePopUpClose}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="30px"
                                                viewBox="0 -960 960 960"
                                                width="30px"
                                                fill="var(--color-text)"
                                            >
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </header>

                                <div className={style.intermediateBlock}>
                                    <div className={style.inputSearchBlock}>
                                        <input
                                            className={style.inputFilters}
                                            type="text"
                                            placeholder={intl.formatMessage({ id: 'getFileStory.inputSearch' })}
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        />
                                    </div>
                                    {popUpFilesErrorMessage != '' ? (
                                        <div className={style.fileErrorMessageBlock}>
                                            <div className={style.fileErrorMessage}>
                                                <span>{popUpFilesErrorMessage}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    {showTextCopyMessage == true ? (
                                        <div className={style.textCopyMessageBlock}>
                                            <div className={style.textCopyMessage}>
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'getfilePage.file.copy.click',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>

                                <div className={style.getFilePopUpFilesList}>
                                    <div className={style.getFilePopUpItems}>
                                        {JSON.stringify(filteredGetFile) != JSON.stringify([]) ? (
                                            filteredGetFile?.map((file, index) => (
                                                <div key={file.id} className={style.fileItem}>
                                                    {file.filename != undefined ? (
                                                        <div className={style.fileBlock}>
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

                                                            <div>
                                                                <span className={style.fileName}>{file.filename}</span>
                                                            </div>
                                                        </div>
                                                    ) : file.text != undefined ? (
                                                        <div className={style.textBlock}>
                                                            <span>{file.text}</span>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}

                                                    <div className={style.fileInfo}>
                                                        <span className={style.fileInfoText}>
                                                            {intl.formatMessage({
                                                                id: 'getfilePage.file.sentToUser',
                                                            })}
                                                            :{' '}
                                                            {file.sentToUser == 'guest'
                                                                ? ((file.sentToUser = intl.formatMessage({
                                                                      id: 'userIsGuest.username',
                                                                  })),
                                                                  file.sentToUser)
                                                                : file.sentToUser == 'deletedAccount'
                                                                  ? ((file.sentToUser = intl.formatMessage({
                                                                        id: 'userIsDelete.username',
                                                                    })),
                                                                    file.sentToUser)
                                                                  : file.sentToUser}
                                                        </span>
                                                        <span className={style.fileInfoText}>
                                                            {intl.formatMessage({
                                                                id: 'getfilePage.file.userWillReceive',
                                                            })}
                                                            :{' '}
                                                            {file.userWillReceive == 'guest'
                                                                ? ((file.userWillReceive = intl.formatMessage({
                                                                      id: 'userIsGuest.username',
                                                                  })),
                                                                  file.userWillReceive)
                                                                : file.userWillReceive == 'deletedAccount'
                                                                  ? ((file.userWillReceive = intl.formatMessage({
                                                                        id: 'userIsDelete.username',
                                                                    })),
                                                                    file.userWillReceive)
                                                                  : file.userWillReceive}
                                                        </span>
                                                        <span className={style.fileInfoText}>
                                                            {intl.formatMessage({
                                                                id: 'getfilePage.file.sentFromDevice',
                                                            })}
                                                            : {file.sentFromDevice}
                                                        </span>
                                                        <span className={style.fileInfoText}>
                                                            {intl.formatMessage({
                                                                id: 'getfilePage.file.date',
                                                            })}
                                                            :{' '}
                                                            {typeof file.data === 'object'
                                                                ? dateParserTimeZone(file.data.data, file.data.gtm)
                                                                : dateParserTimeZone(file.data, undefined)}
                                                        </span>
                                                        {file.size != null ? (
                                                            <span className={style.fileInfoText}>
                                                                {intl.formatMessage({
                                                                    id: 'getfilePage.file.size',
                                                                })}
                                                                : {funConvertFileSize(file.size)}
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                        <span className={style.fileInfoText}>
                                                            {intl.formatMessage({
                                                                id: 'file.fileWillBeDeleted',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className={style.fileButtons}>
                                                        <button
                                                            className={style.styleButtonDownlodeCancel}
                                                            type="button"
                                                            onClick={() => fileCancelFun(file.id)}
                                                        >
                                                            {intl.formatMessage({
                                                                id: 'getfilePage.file.reject',
                                                            })}
                                                        </button>

                                                        {file.filename != undefined ? (
                                                            <button
                                                                className={style.styleButtonDownlode}
                                                                type="button"
                                                                onClick={() => fileAcceptFun(file.filename, file.id)}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'getfilePage.file.download',
                                                                })}
                                                            </button>
                                                        ) : file.text != undefined ? (
                                                            <button
                                                                className={style.styleButtonDownlode}
                                                                type="button"
                                                                onClick={() => textCopyFun(file.text, file.id)}
                                                            >
                                                                {intl.formatMessage({
                                                                    id: 'getfilePage.file.copy',
                                                                })}
                                                            </button>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={style.notFilesStory}>
                                                <span className={style.notFilesStorySpan}>
                                                    {intl.formatMessage({
                                                        id: 'file.notFound',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={style.getFilePopUpButtonsBlock}>
                                <div className={style.getFilePopUpButtons}>
                                    <button
                                        type="button"
                                        onClick={() => allFilesCancelFun()}
                                        className={style.styleButtonCancel}
                                    >
                                        {intl.formatMessage({
                                            id: 'getfilePage.files.rejectAll',
                                        })}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => filesAcceptFun()}
                                        className={style.styleButtonAccept}
                                    >
                                        {intl.formatMessage({
                                            id: 'getfilePage.files.acceptEverything',
                                        })}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ) : (
                        <div></div>
                    )} */}

                    {/* getfile */}

                    <div className={style.pageHead}>
                        <div className={style.pageIcon}>
                            <svg
                                width="70"
                                height="70"
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="10" y="55" width="50" height="4" rx="2" fill="#008CFF" />
                                <rect
                                    x="33"
                                    y="48"
                                    width="35"
                                    height="4"
                                    rx="2"
                                    transform="rotate(-90 33 48)"
                                    fill="#96C3FF"
                                />
                                <rect
                                    width="14.3294"
                                    height="3.82117"
                                    rx="1.91059"
                                    transform="matrix(-0.697868 0.716226 -0.697868 -0.716226 45 38.7368)"
                                    fill="#96C3FF"
                                />
                                <rect
                                    width="14.3294"
                                    height="3.82117"
                                    rx="1.91059"
                                    transform="matrix(-0.697868 -0.716226 0.697868 -0.716226 35 49)"
                                    fill="#96C3FF"
                                />
                            </svg>
                        </div>

                        <div className={style.pageTitle}>
                            <h2>
                                {intl.formatMessage({
                                    id: 'getfilePage.formTitleH2',
                                })}
                            </h2>
                            <p>
                                {intl.formatMessage({
                                    id: 'getfilePage.formDescriptionP',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className={style.pageMain}>
                        <div className={style.userDataBlock}>
                            <p>
                                {intl.formatMessage({
                                    id: 'getfilePage.yourDeviceID',
                                })}
                            </p>
                            {userData == null ? (
                                <h2>
                                    {intl.formatMessage({
                                        id: 'getfilePage.loding',
                                    })}
                                </h2>
                            ) : (
                                <div className={style.userId}>
                                    <div className={style.userIdBlock} onClick={() => shareIdCopyFun()}>
                                        <h2>{userData?.shareId}</h2>
                                        <svg
                                            width="25"
                                            height="25"
                                            viewBox="0 0 40 40"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_427_660)">
                                                <path
                                                    d="M5.25 27C3.45507 27 2 25.5449 2 23.75V7C2 4.23858 4.23858 2 7 2H24.875C26.6009 2 28 3.39911 28 5.125"
                                                    stroke-width="4"
                                                    stroke-linecap="round"
                                                    stroke="var(--color-text)"
                                                />
                                                <rect
                                                    x="13"
                                                    y="13"
                                                    width="25"
                                                    height="25"
                                                    rx="5"
                                                    stroke="var(--color-text)"
                                                    stroke-width="4"
                                                    stroke-linecap="round"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_427_660">
                                                    <rect width="40" height="40" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>

                                    {shareIdCopy != false ? (
                                        <span className={style.yourDeviceIDCopy}>
                                            {intl.formatMessage({
                                                id: 'getfilePage.yourDeviceID.copy.click',
                                            })}
                                        </span>
                                    ) : (
                                        <div></div>
                                    )}

                                    {JSON.stringify(files) != JSON.stringify([]) ? (
                                        <button
                                            type="button"
                                            className={style.openFilePopUp}
                                            onClick={() => showFilesPopUpFun()}
                                        >
                                            {intl.formatMessage({
                                                id: 'getfilePage.openFileList',
                                            })}
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={style.navExchangeBlock}>
                        <div className={style.navExchange}>
                            {process.env.NEXT_PUBLIC_COOKIE_SECURE === 'production' ? (
                                <Link className={`${style.LinkExchange} ${style.select}`} href={'/getfile'}>
                                    {intl.formatMessage({ id: 'sendfilePage.buttonLinkGet' })}
                                </Link>
                            ) : (
                                <a className={`${style.LinkExchange} ${style.select}`} href={'/getfile'}>
                                    {intl.formatMessage({ id: 'sendfilePage.buttonLinkGet' })}
                                </a>
                            )}

                            <Link className={`${style.LinkExchange}`} href={'/sendfile'}>
                                {intl.formatMessage({ id: 'sendfilePage.buttonLinkSend' })}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

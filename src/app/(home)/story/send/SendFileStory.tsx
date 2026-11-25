'use client';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import style from '@/style/sendFileStory.module.css';

import { useAppDispatch } from '@/components/hooks';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

import Link from 'next/link';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import {
    deleteAllFilesStorySendServer,
    deleteFileStorySendServer,
    deleteSentFileServer,
    getStorySendFileServer,
} from './actions';

interface FileItem {
    userWillReceiveId: string;
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
    status: string;
    id: string;
}

export default function SendFileStory() {
    const [showSettingsPopUp, setShowSettingsPopUp] = useState(false);
    const [showFiltersPopUp, setShowFiltersPopUp] = useState(false);
    const [showMessageSettingsPopUp, setShowMessageSettingsPopUp] = useState(false);
    const [messageDeleteFileStoryPopUp, setMessageDeleteFileStoryPopUp] = useState({
        show: false,
        filename: '',
        id: '',
    });
    const [userFileStory, setUserFileStory] = useState<FileItem[]>([]);
    const [error, setError] = useState('');
    const [timeFormat, setTimeFormat] = useState<string | null>(null);

    const [fileAdditionallyMenuPopUpShow, setFileAdditionallyMenuPopUpShow] = useState<Record<string, boolean>>({});
    const [closeBackgroundAdditionallyMenu, setCloseBackgroundAdditionallyMenu] = useState(false);

    const intl = useIntl();

    useEffect(() => {
        const timeFormat = localStorage.getItem('timeFormat');
        if (timeFormat != null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeFormat(timeFormat);
        }
    }, []);

    const [filters, setFilters] = useState({
        sentToUser: '',
        date: '',
        dateParse: '',
        type: 'all', // all | file | text
        status: 'all', // all | sent | accepted | refusal
        search: '',
    });

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    const socketRef = useRef<Socket>(null);

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

    const router = useRouter();

    const getStorySendFile = async () => {
        try {
            const response = await getStorySendFileServer();

            console.log('Response:', response);

            if (response.status == false) {
                const serverMessage = response.msg;
                console.log('serverMessage:', serverMessage);

                return setError(
                    intl.formatMessage({
                        id: `error.massage.${serverMessage}`,
                        defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                    })
                );
            }

            for (let i = 0; i < response.length; i++) {
                const element = response[i];

                setFileAdditionallyMenuPopUpShow((prevState) => ({
                    ...prevState,
                    [element.id]: false,
                }));
            }

            setUserFileStory(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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

    useEffect(() => {
        const getStorySendFile = async () => {
            try {
                const response = await getStorySendFileServer();

                console.log('Response:', response);

                if (response.status == false) {
                    const serverMessage = response.msg;
                    console.log('serverMessage:', serverMessage);

                    return setError(
                        intl.formatMessage({
                            id: `error.massage.${serverMessage}`,
                            defaultMessage: intl.formatMessage({ id: 'error.massage.unknown' }) + serverMessage,
                        })
                    );
                }

                for (let i = 0; i < response.length; i++) {
                    const element = response[i];

                    setFileAdditionallyMenuPopUpShow((prevState) => ({
                        ...prevState,
                        [element.id]: false,
                    }));
                }

                setUserFileStory(response);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
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

        getStorySendFile();
    }, []);

    const filteredFileStory = userFileStory?.filter((file) => {
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

        // Статус
        if (filters.status !== 'all' && file.status !== filters.status) return false;

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

                console.log(dateSplit);

                const dayMonthFullSplit = dateSplit[0].split('.');
                const taimSplit = dateSplit[1].split(':');

                console.log(dayMonthFullSplit);
                console.log(taimSplit);

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

    const deleteAllFilesStory = async () => {
        closeMessageDeletePopUpFun();
        closeSettingsPopUpFun();

        try {
            await deleteAllFilesStorySendServer();

            //console.log('Response:', response.data);
            getStorySendFile();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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

    const deleteFileStory = async (id: string) => {
        closeMessageDeletePopUpFun();
        closeSettingsPopUpFun();

        try {
            await deleteFileStorySendServer(id);

            //console.log('Response:', response.data);

            getStorySendFile();
            closeMessageDeleteFileStoryPopUp();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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
    const deleteSentFile = async (id: string, userWillReceiveId: string) => {
        closeMessageDeletePopUpFun();
        closeSettingsPopUpFun();
        // const token = localStorage?.getItem('token');

        //console.log(token);

        try {
            await deleteSentFileServer(id, userWillReceiveId);

            //console.log('Response:', response.data);
            if (socketRef.current != null) {
                socketRef.current.emit('pingfilesUserId', userWillReceiveId);
            }

            getStorySendFile();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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
        router.push('/story');
    };

    const showMessageDeletePopUpFun = () => {
        setShowMessageSettingsPopUp(true);
    };

    const closeMessageDeletePopUpFun = () => {
        setShowMessageSettingsPopUp(false);
    };

    const showSettingsPopUpFun = () => {
        setShowSettingsPopUp(true);
    };

    const closeSettingsPopUpFun = () => {
        setShowSettingsPopUp(false);
    };

    const showFiltersPopUpFun = () => {
        setShowFiltersPopUp(true);
    };

    const closeFiltersPopUpFun = () => {
        setShowFiltersPopUp(false);
    };

    const showMessageDeleteFileStoryPopUp = (id: string, filename: string) => {
        setMessageDeleteFileStoryPopUp((messageDeleteFile) => ({
            ...messageDeleteFile,
            ['show']: true,
            ['id']: id,
            ['filename']: filename,
        }));
    };

    const closeMessageDeleteFileStoryPopUp = () => {
        setMessageDeleteFileStoryPopUp((messageDeleteFile) => ({
            ...messageDeleteFile,
            ['show']: false,
        }));
    };

    const openFileAdditionallyMenuFun = (id: string) => {
        console.log(fileAdditionallyMenuPopUpShow);

        if (fileAdditionallyMenuPopUpShow[id] != true) {
            setFileAdditionallyMenuPopUpShow({
                ...fileAdditionallyMenuPopUpShow,
                [id]: true,
            });

            setCloseBackgroundAdditionallyMenu(true);
        } else {
            setFileAdditionallyMenuPopUpShow({
                ...fileAdditionallyMenuPopUpShow,
                [id]: false,
            });
            setCloseBackgroundAdditionallyMenu(false);
        }
    };

    const closeAllFileAdditionallyMenuFun = () => {
        console.log(fileAdditionallyMenuPopUpShow);

        for (let i = 0; i != userFileStory.length; i++) {
            const element = userFileStory[i];

            setFileAdditionallyMenuPopUpShow((prevState) => ({
                ...prevState,
                [element.id]: false,
            }));

            setCloseBackgroundAdditionallyMenu(false);
        }
    };

    return (
        <div className={style.getFileStory}>
            <div className={style.blockStory}>
                <div className={style.formGetFileStory}>
                    {/* {showFiltersPopUp != false ? ( */}
                    <div
                        className={` ${style.filtersStoryPopUpBackground} ${showFiltersPopUp == true ? style.filtersStoryPopUpBackgroundShow : ''}`}
                    >
                        <div className={style.filtersStoryPopUp}>
                            <div className={style.filtersStoryPopUpMain}>
                                <div className={style.filtersStoryPopUpHeader}>
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

                                <div className={style.filtersStoryPopUpOptions}>
                                    <div className={style.filtersStoryPopUpOptionBlock}>
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

                                        <select
                                            className={style.selectOptionStyle}
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        >
                                            <option value="all">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfiltersStatus.all',
                                                })}
                                            </option>
                                            <option value="sent">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfiltersStatus.sent',
                                                })}
                                            </option>
                                            <option value="accepted">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfiltersStatus.accepted',
                                                })}
                                            </option>
                                            <option value="refusal">
                                                {intl.formatMessage({
                                                    id: 'filtersFilePop.selectOptionfiltersStatus.refusal',
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

                            <div className={style.filtersStoryPopUpButtons}>
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

                    {/* {showSettingsPopUp != false ? ( */}
                    <div
                        className={` ${style.settingsStoryPopUpBackground}  ${showSettingsPopUp != false ? style.settingsStoryPopUpBackgroundShow : ''}`}
                    >
                        <div className={style.settingsStoryPopUp}>
                            <div className={style.settingsStoryPopUpHeader}>
                                <h2>{intl.formatMessage({ id: 'sendFileStory.settingsStoryPopUpH2' })}</h2>

                                <button
                                    type="button"
                                    onClick={() => closeSettingsPopUpFun()}
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

                            <div className={style.settingsStoryPopUpOptions}>
                                <div className={style.settingsStoryPopUpOptionBlock}>
                                    <button
                                        type="button"
                                        onClick={() => showMessageDeletePopUpFun()}
                                        className={` ${style.settingsStoryPopUpOptionButton} ${style.delete} `}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="30px"
                                            viewBox="0 -960 960 960"
                                            width="30px"
                                            fill="var(--color-red-100)"
                                        >
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                        </svg>
                                        {intl.formatMessage({
                                            id: 'sendFileStory.settingsStoryPopUp.clearAllHistory',
                                        })}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ) : (
                        <div></div>
                    )} */}

                    {/* {showMessageSettingsPopUp != false ? ( */}
                    <div
                        className={` ${style.messageDeleteStoryPopUpBackground}  ${showMessageSettingsPopUp != false ? style.messageDeleteStoryPopUpBackgroundShow : ''} `}
                    >
                        <div className={style.messageDeleteStoryPopUp}>
                            <div className={style.messageDeleteStoryPopUpHeader}>
                                <h2>{intl.formatMessage({ id: 'sendFileStory.messageDeleteStoryPopUpH2' })}</h2>

                                <span>{intl.formatMessage({ id: 'sendFileStory.messageDeleteStoryPopUpSpan' })}</span>
                            </div>

                            <div className={style.messageDeleteStoryPopUpOptions}>
                                <button
                                    type="button"
                                    onClick={() => deleteAllFilesStory()}
                                    className={` ${style.messageDeletePopUpOptionButtonСancel} `}
                                >
                                    {intl.formatMessage({ id: 'sendFileStory.messageDeleteStoryPopUp.delete' })}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => closeMessageDeletePopUpFun()}
                                    className={` ${style.messageDeletePopUpOptionButton} `}
                                >
                                    {intl.formatMessage({ id: 'sendFileStory.messageDeleteStoryPopUp.cancel' })}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ) : (
                        <div></div>
                    )} */}

                    <div
                        className={` ${style.messageDeleteFileStoryPopUpBackground} ${messageDeleteFileStoryPopUp['show'] != false ? style.messageDeleteFileStoryPopUpBackgroundShow : ''} `}
                    >
                        <div className={style.messageDeleteFileStoryPopUp}>
                            <div className={style.messageDeleteFileStoryPopUpHeader}>
                                <h2>
                                    {intl.formatMessage({ id: 'getFileStory.messageDeleteFileStoryPopUpH2' })}{' '}
                                    <span className={style.messageDeleteFileStoryPopUpFilename}>
                                        {messageDeleteFileStoryPopUp['filename']}
                                    </span>
                                </h2>

                                <span>
                                    {intl.formatMessage({ id: 'getFileStory.messageDeleteFileStoryPopUpSpan' })}
                                </span>
                            </div>

                            <div className={style.messageDeleteFileStoryPopUpOptions}>
                                <button
                                    type="button"
                                    onClick={() => deleteFileStory(messageDeleteFileStoryPopUp['id'])}
                                    className={` ${style.messageDeleteFileStoryPopUpOptionButtonСancel}`}
                                >
                                    {intl.formatMessage({ id: 'getFileStory.messageDeleteFileStoryPopUp.delete' })}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => closeMessageDeleteFileStoryPopUp()}
                                    className={` ${style.messageDeleteFileStoryPopUpOptionButton} `}
                                >
                                    {intl.formatMessage({ id: 'getFileStory.messageDeleteFileStoryPopUp.cancel' })}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={style.formHead}>
                        <div className={style.navigationPage}>
                            <div className={style.buttonBackPageBlock}>
                                <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="36px"
                                        viewBox="0 -960 960 960"
                                        width="36px"
                                        fill="var(--color-text)"
                                    >
                                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                                    </svg>
                                </button>
                            </div>

                            <div className={style.navStoryOptionsBlock}>
                                <div className={style.navStoryOptions}>
                                    <Link className={`${style.LinkStoryOptions}`} href={'/story/get'}>
                                        {intl.formatMessage({ id: 'sendFileStory.linkStoryOptionsGet' })}
                                    </Link>
                                    <Link className={`${style.LinkStoryOptions} ${style.select}`} href={'/story/send'}>
                                        {intl.formatMessage({ id: 'sendFileStory.linkStoryOptionsSent' })}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className={style.formIcon}>
                            <svg
                                width="80"
                                height="80"
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M53 15C54.1046 15 55 15.8954 55 17V53C55 54.1046 54.1046 55 53 55H17C15.8954 55 15 54.1046 15 53V30L30 15H53ZM24.9189 33.3193C24.19 32.5908 23.0082 32.5906 22.2793 33.3193L17.6592 37.9395C17.2948 38.3039 17.2948 38.8953 17.6592 39.2598C18.0236 39.6242 18.615 39.6241 18.9795 39.2598L22.666 35.5723V52.0664C22.666 52.5818 23.0842 52.9999 23.5996 53C24.1151 53 24.5332 52.5819 24.5332 52.0664V35.5732L28.2197 39.2598C28.5842 39.6239 29.1747 39.624 29.5391 39.2598C29.9036 38.8953 29.9036 38.304 29.5391 37.9395L24.9189 33.3193ZM42 31C35.9249 31 31 35.9249 31 42C31 48.0751 35.9249 53 42 53C48.0751 53 53 48.0751 53 42C53 35.9249 48.0751 31 42 31ZM42 33C46.9706 33 51 37.0294 51 42C51 46.9706 46.9706 51 42 51C37.0294 51 33 46.9706 33 42C33 37.0294 37.0294 33 42 33ZM42 34.1426C41.5661 34.1426 41.2139 34.4948 41.2139 34.9287V41.6436L37.8867 44.4355C37.5547 44.7144 37.5115 45.2097 37.79 45.542C38.069 45.8744 38.565 45.9176 38.8975 45.6387L42.5088 42.6084C42.7163 42.4341 42.8113 42.1755 42.7852 41.9248V34.9287C42.7852 34.4948 42.4339 34.1427 42 34.1426Z"
                                    fill="#008CFF"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18.4133 26.5867L15.5858 29.4142L15 30H15.1796H19.8284H22.5H28C29.1046 30 30 29.1046 30 28V22.5V19.8284V15.1796V15L29.4142 15.5858L26.5862 18.4138L18.4133 26.5867Z"
                                    fill="#96C3FF"
                                />
                            </svg>
                        </div>

                        <div className={style.formTitle}>
                            <h2>{intl.formatMessage({ id: 'sendFileStory.formTitleH2' })}</h2>
                            <p>{intl.formatMessage({ id: 'sendFileStory.formDescriptionP' })}</p>
                        </div>
                    </div>

                    <div className={style.formFileStoryView}>
                        <div
                            className={` ${style.closeBackgroundAdditionallyMenu} ${closeBackgroundAdditionallyMenu == true ? style.closeBackgroundAdditionallyMenuShow : ''}`}
                            onClick={() => closeAllFileAdditionallyMenuFun()}
                        ></div>

                        <div className={style.formFileStoryHead}>
                            <h2>{intl.formatMessage({ id: 'sendFileStory.formFileStoryHeadH2' })}</h2>

                            <div className={style.formFileStoryButtons}>
                                <button
                                    type="button"
                                    onClick={() => showFiltersPopUpFun()}
                                    className={style.formFileStorySettings}
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
                                    onClick={() => showSettingsPopUpFun()}
                                    className={style.formFileStoryFilrets}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="30px"
                                        viewBox="0 -960 960 960"
                                        width="30px"
                                        fill="var(--color-text)"
                                    >
                                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {error != '' ? (
                            <div className={style.errorBlock}>
                                <span className={style.error}>{error}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <div className={style.inputSearchBlock}>
                            <input
                                className={style.inputFilters}
                                type="text"
                                placeholder={intl.formatMessage({ id: 'sendFileStory.inputSearch' })}
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        <div className={style.fileStoryViewBlock}>
                            {JSON.stringify(filteredFileStory) != JSON.stringify([]) ? (
                                filteredFileStory?.map((file, index) => (
                                    <div key={file.id} className={style.fileItem}>
                                        {file.filename != undefined ? (
                                            <div className={style.fileBlock}>
                                                <div className={style.fileMain}>
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

                                                    <div className={style.fileNameBlock}>
                                                        <span className={style.fileName}>{file.filename}</span>
                                                    </div>
                                                </div>

                                                <div className={style.fileAdditionally}>
                                                    <button
                                                        type="button"
                                                        onClick={() => openFileAdditionallyMenuFun(file.id)}
                                                        className={style.openFileAdditionallyMenu}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle cx="8" cy="20" r="3" fill="var(--color-text)" />
                                                            <circle cx="20" cy="20" r="3" fill="var(--color-text)" />
                                                            <circle cx="32" cy="20" r="3" fill="var(--color-text)" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : file.text != undefined ? (
                                            <div className={style.textBlock}>
                                                <div className={style.textMain}>
                                                    <span>{file.text}</span>
                                                </div>

                                                <div className={style.fileAdditionally}>
                                                    <button
                                                        type="button"
                                                        onClick={() => openFileAdditionallyMenuFun(file.id)}
                                                        className={style.openFileAdditionallyMenu}
                                                    >
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle cx="8" cy="20" r="3" fill="var(--color-text)" />
                                                            <circle cx="20" cy="20" r="3" fill="var(--color-text)" />
                                                            <circle cx="32" cy="20" r="3" fill="var(--color-text)" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}

                                        <div className={style.fileInfo}>
                                            <span className={style.fileInfoText}>
                                                {intl.formatMessage({ id: 'getfilePage.file.sentToUser' })}:{' '}
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
                                                {intl.formatMessage({ id: 'sendFileStory.file.sentFromDevice' })}:{' '}
                                                {file.sentFromDevice}
                                            </span>
                                            <span className={style.fileInfoText}>
                                                {intl.formatMessage({ id: 'sendFileStory.file.date' })}:{' '}
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

                                            {file.status == 'sent' ? (
                                                <span className={style.fileInfoText}>
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status' })}:{' '}
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status.sent' })}
                                                </span>
                                            ) : file.status == 'accepted' ? (
                                                <span className={style.fileInfoText}>
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status' })}:{' '}
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status.accepted' })}
                                                </span>
                                            ) : file.status == 'refusal' ? (
                                                <span className={style.fileInfoText}>
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status' })}:{' '}
                                                    {intl.formatMessage({ id: 'sendFileStory.file.status.refusal' })}
                                                </span>
                                            ) : (
                                                <span></span>
                                            )}
                                        </div>

                                        {/* <div className={style.fileButtons}>
                                            <button
                                                type="button"
                                                onClick={() => deleteFileStory(file.id)}
                                                className={` ${style.buttonFileDeleteStory} `}
                                            >
                                                {intl.formatMessage({ id: 'sendFileStory.file.delete' })}
                                            </button>

                                            {file.status == 'sent' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSentFile(file.id, file.userWillReceiveId)}
                                                    className={` ${style.buttonFileCancelSend} `}
                                                >
                                                    {intl.formatMessage({ id: 'sendFileStory.file.cancelSending' })}
                                                </button>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div> */}

                                        <div
                                            className={` ${style.fileAdditionallyMenuPopUp} ${fileAdditionallyMenuPopUpShow[file.id] ? style.fileAdditionallyMenuPopUpShow : ''}`}
                                            style={{ bottom: file.status == 'sent' ? 100 : 140 }}
                                        >
                                            {file.status == 'sent' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSentFile(file.id, file.userWillReceiveId)}
                                                    className={` ${style.buttonFileStoryAdditionallyMenuOption} `}
                                                >
                                                    {intl.formatMessage({ id: 'sendFileStory.file.cancelSending' })}
                                                </button>
                                            ) : (
                                                <></>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => showMessageDeleteFileStoryPopUp(file.id, file.filename)}
                                                className={` ${style.buttonFileDeleteStoryAdditionallyMenuOption} `}
                                            >
                                                {intl.formatMessage({ id: 'getFileStory.file.delete' })}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={style.notFilesStory}>
                                    <span className={style.notFilesStorySpan}>
                                        {intl.formatMessage({ id: 'sendFileStory.file.thereAreNoFilesInTheHistory' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

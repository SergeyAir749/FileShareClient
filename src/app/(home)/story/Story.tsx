'use client';
import style from '@/style/story.module.css';
import { useIntl } from 'react-intl';

import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function Story() {
    const router = useRouter();
    const intl = useIntl();

    const buttonBackPage = () => {
        router.push('/sendfile');
    };

    return (
        <div className={style.story}>
            <div className={style.blockStory}>
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

                        <div className={style.navigationPageTitle}>
                            <h2>
                                {intl.formatMessage({
                                    id: 'storyPage.formTitleH2',
                                })}
                            </h2>
                        </div>
                    </div>

                    <div className={style.formIcon}>
                        <svg width="80" height="80" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M53 15C54.1046 15 55 15.8954 55 17V53C55 54.1046 54.1046 55 53 55H17C15.8954 55 15 54.1046 15 53V30L30 15H53ZM42 31C35.9249 31 31 35.9249 31 42C31 48.0751 35.9249 53 42 53C48.0751 53 53 48.0751 53 42C53 35.9249 48.0751 31 42 31ZM42 33C46.9706 33 51 37.0294 51 42C51 46.9706 46.9706 51 42 51C37.0294 51 33 46.9706 33 42C33 37.0294 37.0294 33 42 33ZM42 34.1426C41.5661 34.1426 41.2139 34.4948 41.2139 34.9287V41.6436L37.8867 44.4355C37.5547 44.7144 37.5115 45.2097 37.79 45.542C38.069 45.8744 38.565 45.9176 38.8975 45.6387L42.5088 42.6084C42.7163 42.4341 42.8113 42.1755 42.7852 41.9248V34.9287C42.7852 34.4948 42.4339 34.1427 42 34.1426Z"
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
                        <h2>
                            {intl.formatMessage({
                                id: 'storyPage.formDescriptionP',
                            })}
                        </h2>
                    </div>
                </div>

                <div className={style.formStoryView}>
                    <div className={style.formStoryLinks}>
                        <Link
                            className={` ${style.storyLinkStyle} ${style.linkStyleBorderRadiusTop} `}
                            href={'/story/send'}
                        >
                            <div className={style.linkInfoStyle}>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 70 70"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M45.8344 38.6161L45.7814 38.5631C45.0003 37.782 43.734 37.782 42.9529 38.5631L42.9011 38.6149V64.5333C42.9011 65.3433 43.5578 65.9999 44.3678 65.9999C45.1778 65.9999 45.8344 65.3433 45.8344 64.5333V38.6161ZM42.9529 38.5631C43.734 37.782 45.0003 37.782 45.7814 38.5631L45.8344 38.6161L51.6267 44.4084C52.1995 44.9812 53.1281 44.9812 53.7008 44.4084C54.2736 43.8357 54.2736 42.907 53.7008 42.3343L46.4413 35.0747L45.7814 34.4148C45.0003 33.6337 43.734 33.6337 42.9529 34.4148L42.293 35.0747L35.0334 42.3343C34.4607 42.907 34.4607 43.8357 35.0334 44.4084C35.6062 44.9812 36.5348 44.9812 37.1076 44.4084L42.9011 38.6149L42.9529 38.5631ZM18.4133 21.5867L15.5858 24.4142L15 25H15.1796H19.8284H22.5H28C29.1046 25 30 24.1046 30 23V17.5V14.8284V10.1796V10L29.4142 10.5858L26.5862 13.4138L18.4133 21.5867ZM19.8284 25H15.1796H15V25.8284V30V48C15 49.1046 15.8954 50 17 50H53C54.1046 50 55 49.1046 55 48V12C55 10.8954 54.1046 10 53 10H35H30.8284H30V10.1796V14.8284V17.5V23C30 24.1046 29.1046 25 28 25H22.5H19.8284Z"
                                        fill="#008CFF"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.4133 21.5867L15.5858 24.4142L15 25H15.1796H19.8284H22.5H28C29.1046 25 30 24.1046 30 23V17.5V14.8284V10.1796V10L29.4142 10.5858L26.5862 13.4138L18.4133 21.5867Z"
                                        fill="#96C3FF"
                                    />
                                </svg>
                                {intl.formatMessage({
                                    id: 'storyPage.storyLinkStyleSend',
                                })}
                            </div>
                        </Link>

                        <Link
                            className={` ${style.storyLinkStyle} ${style.linkStyleBorderRadiusButton} `}
                            href={'/story/get'}
                        >
                            <div className={style.linkInfoStyle}>
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 70 70"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M42.9028 60.3838L42.9558 60.4369C43.7369 61.2179 45.0032 61.2179 45.7843 60.4369L45.8361 60.385V34.4667C45.8361 33.6566 45.1794 33 44.3694 33C43.5594 33 42.9028 33.6566 42.9028 34.4667V60.3838ZM45.7843 60.4369C45.0032 61.2179 43.7369 61.2179 42.9558 60.4369L42.9028 60.3838L37.1105 54.5915C36.5377 54.0188 35.6091 54.0188 35.0363 54.5915C34.4636 55.1643 34.4636 56.0929 35.0363 56.6657L42.2959 63.9252L42.9558 64.5852C43.7369 65.3662 45.0032 65.3662 45.7843 64.5852L46.4442 63.9252L53.7038 56.6657C54.2765 56.0929 54.2765 55.1643 53.7038 54.5915C53.131 54.0188 52.2024 54.0188 51.6296 54.5915L45.8361 60.385L45.7843 60.4369ZM18.4133 21.5867L15.5858 24.4142L15 25H15.1796H19.8284H22.5H28C29.1046 25 30 24.1046 30 23V17.5V14.8284V10.1796V10L29.4142 10.5858L26.5862 13.4138L18.4133 21.5867ZM19.8284 25H15.1796H15V25.8284V30V48C15 49.1046 15.8954 50 17 50H53C54.1046 50 55 49.1046 55 48V12C55 10.8954 54.1046 10 53 10H35H30.8284H30V10.1796V14.8284V17.5V23C30 24.1046 29.1046 25 28 25H22.5H19.8284Z"
                                        fill="#008CFF"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.4133 21.5867L15.5858 24.4142L15 25H15.1796H19.8284H22.5H28C29.1046 25 30 24.1046 30 23V17.5V14.8284V10.1796V10L29.4142 10.5858L26.5862 13.4138L18.4133 21.5867Z"
                                        fill="#96C3FF"
                                    />
                                </svg>
                                {intl.formatMessage({
                                    id: 'storyPage.storyLinkStyleGet',
                                })}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

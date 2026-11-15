'use client';

import style from '@/style/settings.nav.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

export default function settingsNav() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const intl = useIntl();

    const linkList = [
        {
            link: '/settings/main',
            text: intl.formatMessage({ id: 'settingsNav.link.main' }),
        },
        {
            link: '/settings/decor',
            text: intl.formatMessage({ id: 'settingsNav.link.decor' }),
        },
    ];

    const buttonBackPage = () => {
        router.push('/sendfile');
    };

    return (
        <div className={style.settingsNav}>
            <header className={style.settingsHeader}>
                <div className={style.settingsHeaderBlock}>
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

                    <div className={style.headerTitle}>
                        <h2>{intl.formatMessage({ id: 'settingsNav.headerTitleH2' })}</h2>
                    </div>
                </div>
            </header>

            <main>
                <div className={style.settingLinks}>
                    <div className={style.links}>
                        {linkList.map((item, index) =>
                            index != linkList.length - 1 ? (
                                <Link key={index} className={style.link} href={item.link}>
                                    {item.text}
                                </Link>
                            ) : (
                                <Link key={index} className={`${style.linkNoBorder} ${style.link}`} href={item.link}>
                                    {item.text}
                                </Link>
                            )
                        )}

                        {/* <Link className={style.link} href={'/settings/main'}>
                            {intl.formatMessage({ id: 'settingsNav.link.main' })}
                        </Link>
                        <Link className={style.link} href={'/settings/decor'}>
                            {intl.formatMessage({ id: 'settingsNav.link.decor' })}
                        </Link> */}
                    </div>
                </div>
            </main>
        </div>
    );
}

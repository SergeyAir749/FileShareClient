import { Metadata } from 'next';
import TwoFactorAuth from './twoFactorAuth';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale = cookieStore.get('language')?.value;
    let messages;

    if (locale == undefined) {
        messages = (await import(`@/translations/ru.json`)).default;
    } else {
        messages = (await import(`@/translations/${locale}.json`)).default;
    }

    return {
        title: messages['twoFactorAuth.page.title'],
    };
}

function TwoFactorAuthPage() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <TwoFactorAuth />
        </div>
    );
}

export default TwoFactorAuthPage;

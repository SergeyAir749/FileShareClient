import { Metadata } from 'next';
import TwoFactorAuthVerification from './twoFactorAuthVerification';
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
        title: messages['twoFactorAuthVerification.page.title'],
    };
}

function TwoFactorAuthVerificationPage() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <TwoFactorAuthVerification />
        </div>
    );
}

export default TwoFactorAuthVerificationPage;

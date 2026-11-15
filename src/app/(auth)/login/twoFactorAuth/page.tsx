import { Metadata } from 'next';
import TwoFactorAuthLogin from './TwoFactorAuthLogin';
import { cookies } from 'next/headers';

// export const metadata: Metadata = {
//   title: "Подтвердить почту",
//   description: "Подтвердить почту чтобы закончить регистрацию",
// };

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
        title: messages['twoFactorAuthLogin.page.title'],
        description: messages['twoFactorAuthLogin.page.description'],
    };
}

function TwoFactorAuthLoginPage() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <TwoFactorAuthLogin />
        </div>
    );
}

export default TwoFactorAuthLoginPage;

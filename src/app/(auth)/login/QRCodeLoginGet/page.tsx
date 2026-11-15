import { Metadata } from 'next';
import QRCodeLoginGet from './QRCodeLoginGet';
import { cookies } from 'next/headers';

// export const metadata: Metadata = {
//   title: "Вход",
//   description: "Вход в аккаунт или продолжить как гость",
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
        title: messages['QRCodeLoginGet.page.title'],
    };
}

function QRCodeLoginGetPage() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <QRCodeLoginGet />
        </div>
    );
}

export default QRCodeLoginGetPage;

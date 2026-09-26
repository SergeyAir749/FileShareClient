import { cookies } from 'next/headers';

interface cookiesResponseObjTypes {
    name: string;
    value: string;
    maxAge?: number;
    httpOnly?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
    secure?: boolean;
}

export const cookieSetFunServer = async (arrCookies: string[] | undefined) => {
    const cookiesStore = await cookies();

    try {
        if (!arrCookies) {
            throw new Error('cookieNotFound');
        }

        console.log(arrCookies);
        

        for (let i = 0; i < arrCookies.length; i++) {
            const rawCookiesTemp = arrCookies[i].split(';').map(part => part.trim());
            
            const [cookieName, cookieValue] = rawCookiesTemp[0].split('=');

            const cookiesResponseObj: cookiesResponseObjTypes = {
                name: cookieName,
                value: cookieValue,
                secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'production',
            };

            console.log(rawCookiesTemp.slice(1));
            

            rawCookiesTemp.slice(1).forEach(part => {
                const [key, val] = part.split('=');
                const lowerKey = key.toLowerCase();

                if (lowerKey === 'maxage') {
                    cookiesResponseObj.maxAge = Number(val);
                } else if (lowerKey === 'path') {
                    cookiesResponseObj.path = val;
                } else if (lowerKey === 'samesite') {
                    cookiesResponseObj.sameSite = val.toLowerCase() as 'lax' | 'strict' | 'none';
                } else if (lowerKey === 'httponly') {
                    cookiesResponseObj.httpOnly = true;
                }
            });


            console.log(cookiesResponseObj);
            
            // Передаем объект в cookiesStore.set
            cookiesStore.set(
                cookiesResponseObj.name, 
                cookiesResponseObj.value, 
                {
                    maxAge: cookiesResponseObj.maxAge,
                    path: cookiesResponseObj.path,
                    httpOnly: cookiesResponseObj.httpOnly,
                    secure: cookiesResponseObj.secure,
                    sameSite: cookiesResponseObj.sameSite,
                }
            );
        }

        return true;

    } catch (error) {
        console.error(error);
        throw new Error('cookieParseError');
    }
};
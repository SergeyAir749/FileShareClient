'use client';

// loader V4
// public/loaderAnimation4.svg

export const Loading = () => {
    return (
        <svg className=".svg" width="60" height="60" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_223_516)">
                <circle cx="25" cy="25" r="22.5" stroke="var(--color-blue-900)" strokeWidth="5" />
                <circle className="animation" cx="25" cy="25" r="22.5" stroke="var(--color-blue-300)" strokeWidth="5" />
            </g>
            <defs>
                <clipPath id="clip0_223_516">
                    <rect width="50" height="50" fill="white" />
                </clipPath>
            </defs>

            <style
                dangerouslySetInnerHTML={{
                    __html: `

        .svg {
            transform: rotate(360deg) scaleX(-1);
            animation: routeSvg 1.5s infinite;
        }

        .animation {
            animation: route 2s infinite;
            stroke-dasharray: 500; /* Длина окружности (2 * pi * r) */
            stroke-dashoffset: 500; /* Начальное состояние (пусто) */
            transition: stroke-dashoffset 2.5s ease;
            fill: none;
            stroke-linecap: round;
            animation-duration: 2.5s;
        }

        @keyframes route {
            0% {
                stroke-dashoffset: 500;
            }
            50% {
                stroke-dashoffset: 420;
            }
            100% {
                stroke-dashoffset: 500;
            }
        }

        @keyframes routeSvg {
            0% {
                transform: rotate(0deg) scaleX(-1);
            }
            100% {
                transform: rotate(360deg) scaleX(-1);
            }
        }`,
                }}
            />
        </svg>
    );
};

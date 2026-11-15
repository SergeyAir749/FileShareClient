'use client';

// loader V4
// public/loaderAnimation4.svg

export const LoaderUserData = () => {
    return (
        <svg
            className="userLoginloader svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="100" cy="100" r="94" stroke="#21487A" stroke-width="6" />
            <circle className="animation" cx="100" cy="100" r="94" stroke="#C7E6FF" stroke-width="6" />

            <style
                dangerouslySetInnerHTML={{
                    __html: `

        .svg {
            transform: rotate(360deg) scaleX(-1);
            animation: routeSvg 1.5s infinite;
        }

        .userLoginloader {
            position: absolute;
        }

        .animation {
            animation: route 2s infinite;
            stroke-dasharray: 600; /* Длина окружности (2 * pi * r) */
            stroke-dashoffset: 599; /* Начальное состояние (пусто) */
            transition: stroke-dashoffset 1s ease;
            fill: none;
            stroke-linecap: round;
            animation-duration: 2.5s;
        }

        @keyframes route {
            0% {
                stroke-dasharray: 600;
            }
            50% {
                stroke-dashoffset: 200;
            }
            100% {
                stroke-dasharray: 600;
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

import type { SVGProps } from "react";

export const EcoExchangeLogo = (props: SVGProps<SVGSVGElement> & { animationDuration?: number }) => {
    const { animationDuration, ...svgProps } = props;
    const isAnimated = animationDuration !== undefined;

    return (
        <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...svgProps}
            className={`inline-block ${props.className || ''}`}
        >
            <defs>
                <clipPath id="logoClip">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H8L12 20L16 16H13V13H11V16ZM16 8H13V11H11V8H8L12 4L16 8Z" />
                </clipPath>
            </defs>
            {isAnimated && (
                <g clipPath="url(#logoClip)">
                    <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        className="text-primary/20"
                        fill="currentColor"
                    />
                    <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        className="text-primary liquid-fill"
                        fill="currentColor"
                        style={{ animationDuration: `${animationDuration}s` }}
                    />
                </g>
            )}
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H8L12 20L16 16H13V13H11V16ZM16 8H13V11H11V8H8L12 4L16 8Z"
                fill={isAnimated ? 'transparent' : 'currentColor'}
                stroke="currentColor"
                strokeWidth={isAnimated ? 0.5 : 0}
            />
        </svg>
    );
};

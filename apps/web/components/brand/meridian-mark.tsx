import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

export function MeridianMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className)}
      fill="none"
      focusable="false"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="24" cy="24" fill="currentColor" r="22" />
      <path
        d="M24 8.5C18.7 13.6 16 18.8 16 24s2.7 10.4 8 15.5c5.3-5.1 8-10.3 8-15.5S29.3 13.6 24 8.5Z"
        stroke="white"
        strokeWidth="2.5"
      />
      <path d="M24 8.5v31" stroke="white" strokeLinecap="round" strokeWidth="2.5" />
      <path
        d="M9.5 24h29"
        stroke="white"
        strokeLinecap="round"
        strokeOpacity=".58"
        strokeWidth="2"
      />
      <path
        d="M12.5 16.5c3.3 1.8 7.1 2.7 11.5 2.7s8.2-.9 11.5-2.7M12.5 31.5c3.3-1.8 7.1-2.7 11.5-2.7s8.2.9 11.5 2.7"
        stroke="white"
        strokeLinecap="round"
        strokeOpacity=".58"
        strokeWidth="2"
      />
      <path
        d="m24 5.5 3 5.3h-6l3-5.3Z"
        fill="white"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

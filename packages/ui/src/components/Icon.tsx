import type { SVGProps, ReactElement } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  name: IconName;
}

export type IconName =
  | 'home'
  | 'search'
  | 'library'
  | 'album'
  | 'music'
  | 'pen'
  | 'play'
  | 'pause'
  | 'plus'
  | 'check'
  | 'x'
  | 'chevron'
  | 'arrow'
  | 'upload'
  | 'download'
  | 'bell'
  | 'user'
  | 'heart'
  | 'more'
  | 'filter'
  | 'shuffle'
  | 'comment'
  | 'share'
  | 'drag'
  | 'sparkle'
  | 'trash'
  | 'logout'
  | 'settings'
  | 'menu';

// 원본 디자인의 SVG 패스. 모두 currentColor를 사용하므로 부모 text 색을 그대로 따라간다.
const PATHS: Record<IconName, ReactElement> = {
  home: (
    <g>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
    </g>
  ),
  search: (
    <g>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </g>
  ),
  library: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  album: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  music: (
    <g>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </g>
  ),
  pen: <path d="M16 4l4 4-11 11H5v-4Z" />,
  play: <polygon points="7 5 19 12 7 19 7 5" fill="currentColor" stroke="none" />,
  pause: (
    <g>
      <rect x="7" y="5" width="3.2" height="14" fill="currentColor" stroke="none" />
      <rect x="13.8" y="5" width="3.2" height="14" fill="currentColor" stroke="none" />
    </g>
  ),
  plus: (
    <g>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </g>
  ),
  check: <path d="m5 12 5 5 9-11" />,
  x: (
    <g>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </g>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  arrow: (
    <g>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </g>
  ),
  upload: (
    <g>
      <path d="M12 4v12" />
      <path d="m6 10 6-6 6 6" />
      <path d="M4 20h16" />
    </g>
  ),
  download: (
    <g>
      <path d="M12 4v12" />
      <path d="m6 14 6 6 6-6" />
      <path d="M4 20h16" />
    </g>
  ),
  bell: (
    <g>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </g>
  ),
  user: (
    <g>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </g>
  ),
  heart: <path d="M12 20s-7-4.5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />,
  more: (
    <g>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  filter: (
    <g>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </g>
  ),
  shuffle: (
    <g>
      <path d="M16 4h5v5" />
      <path d="M21 4 4 21" />
      <path d="M16 20h5v-5" />
      <path d="m15 15 6 6" />
      <path d="m4 4 6 6" />
    </g>
  ),
  comment: <path d="M4 5h16v11H9l-5 4Z" />,
  share: (
    <g>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </g>
  ),
  drag: (
    <g>
      <circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  sparkle: (
    <g>
      <path d="M12 3v6" />
      <path d="M12 15v6" />
      <path d="M3 12h6" />
      <path d="M15 12h6" />
      <path d="m6 6 3 3" />
      <path d="m15 15 3 3" />
      <path d="m18 6-3 3" />
      <path d="m9 15-3 3" />
    </g>
  ),
  trash: (
    <g>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7v13h10V7" />
    </g>
  ),
  logout: (
    <g>
      <path d="M10 4H5v16h5" />
      <path d="M15 8l4 4-4 4" />
      <path d="M9 12h10" />
    </g>
  ),
  settings: (
    <g>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M4.5 4.5l2 2" />
      <path d="M17.5 17.5l2 2" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.5 19.5l2-2" />
      <path d="M17.5 6.5l2-2" />
    </g>
  ),
  menu: (
    <g>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </g>
  ),
};

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 토큰을 relative oklch syntax로 감싸 Tailwind 슬래시 알파 모디파이어(`bg-accent/20` 등)가
        // 동작하도록 한다. <alpha-value>는 Tailwind가 0~1 사이로 치환.
        // 브라우저 지원: Chrome 119+, Safari 16.4+, Firefox 128+
        bg: {
          0: 'oklch(from var(--bg-0) l c h / <alpha-value>)',
          1: 'oklch(from var(--bg-1) l c h / <alpha-value>)',
          2: 'oklch(from var(--bg-2) l c h / <alpha-value>)',
          3: 'oklch(from var(--bg-3) l c h / <alpha-value>)',
          4: 'oklch(from var(--bg-4) l c h / <alpha-value>)',
        },
        fg: {
          1: 'oklch(from var(--fg-1) l c h / <alpha-value>)',
          2: 'oklch(from var(--fg-2) l c h / <alpha-value>)',
          3: 'oklch(from var(--fg-3) l c h / <alpha-value>)',
          4: 'oklch(from var(--fg-4) l c h / <alpha-value>)',
        },
        bd: {
          1: 'oklch(from var(--bd-1) l c h / <alpha-value>)',
          2: 'oklch(from var(--bd-2) l c h / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(from var(--accent) l c h / <alpha-value>)',
          soft: 'var(--accent-soft)', // 이미 알파 포함, 모디파이어 안 씀
          fg: 'oklch(from var(--accent-fg) l c h / <alpha-value>)',
          2: 'oklch(from var(--accent-2) l c h / <alpha-value>)',
        },
        status: {
          waiting: 'oklch(from var(--st-waiting) l c h / <alpha-value>)',
          generating: 'oklch(from var(--st-progress) l c h / <alpha-value>)',
          complete: 'oklch(from var(--st-complete) l c h / <alpha-value>)',
          revision: 'oklch(from var(--st-revision) l c h / <alpha-value>)',
        },
        info: 'oklch(from var(--info) l c h / <alpha-value>)',
        success: 'oklch(from var(--success) l c h / <alpha-value>)',
        warn: 'oklch(from var(--warn) l c h / <alpha-value>)',
        danger: 'oklch(from var(--danger) l c h / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        pill: '999px',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        3: 'var(--sh-3)',
        glow: 'var(--sh-glow)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '360ms',
        page: '480ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';
// @ts-expect-error - CJS preset, no types
import preset from '@chohee/ui/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{svelte,ts,js}',
    '../../packages/ui/src/**/*.{svelte,ts,js}',
  ],
};

export default config;

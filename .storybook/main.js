import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/nextjs-vite',
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': resolve(__dirname, '../src'),
    };

    // Vite 8 uses rolldown (not esbuild) for dep pre-bundling scan.
    // Rolldown doesn't know .js files here contain JSX, so it fails to parse
    // all .stories.js files, skips pre-bundling, and breaks Storybook's runtime.
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      rolldownOptions: {
        ...(viteConfig.optimizeDeps?.rolldownOptions ?? {}),
        moduleTypes: {
          ...(viteConfig.optimizeDeps?.rolldownOptions?.moduleTypes ?? {}),
          '.js': 'jsx',
        },
      },
    };

    return viteConfig;
  },
};

export default config;

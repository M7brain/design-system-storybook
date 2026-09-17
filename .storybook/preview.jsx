import '../src/design-system/tokens/globals.css';

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: 'Quicklo Light',
      values: [
        { name: 'Quicklo Light', value: '#F3F3F3' },
        { name: 'Quicklo Dark',  value: '#141414' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;

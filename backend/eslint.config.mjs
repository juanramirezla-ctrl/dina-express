import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'coverage/', 'jest.config.js'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
);
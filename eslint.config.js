import path from 'path';
import { fileURLToPath } from 'url';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintRecommended from '@eslint/js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      "**/*.log",
      "**/.DS_Store",
      "*.",
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "public/",
      "scripts/",
      "vite.config.ts",
      ".netlify/",
      "/*.d.ts",
      "/*.d.ts"
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-spread": "off",
      "no-case-declarations": "off",
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
    },
  },
  // Configuración para JavaScript
  {
    files: ['**/*.js'],
    ignores: [
      '**/*.log',
      '**/.DS_Store',
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'public/',
      'scripts/',
      'vite.config.ts',
      '.netlify/',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {},
    rules: {
      ...eslintRecommended.configs.recommended.rules,
      // Añade reglas personalizadas para JavaScript si es necesario
    },
  },
]
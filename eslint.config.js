import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // ESLint recommended rules
  js.configs.recommended,

  // Vue 3 recommended rules
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/strongly-recommended'],
  ...vue.configs['flat/recommended'],

  // Prettier integration
  prettierConfig,

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // Prettier rules
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'none',
          printWidth: 100,
          endOfLine: 'lf'
        }
      ],

      // Vue specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-multiple-template-root': 'off', // Vue 3 allows multiple roots

      // General JavaScript rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  // TypeScript specific configuration
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disable conflicting rules
      'no-unused-vars': 'off', // Use TypeScript version instead

      // Prettier rules for TypeScript
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'none',
          printWidth: 100,
          endOfLine: 'lf'
        }
      ]
    }
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.min.js',
      'coverage/**',
      '.vite/**',
      'tools/screenshots/**'
    ]
  }
];

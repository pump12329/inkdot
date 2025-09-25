import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

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
        ...globals.es2022,
        // 测试环境全局变量
        vi: 'readonly',
        vitest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
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
      'vue/no-undef-components': 'off',
      'vue/no-undef-properties': 'off',

      // General JavaScript rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-case-declarations': 'error',
      'no-prototype-builtins': 'error',
      'no-misleading-character-class': 'error'
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
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true
        },
        project: false // 禁用项目级别的类型检查以避免模板错误
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        // 测试环境全局变量
        vi: 'readonly',
        vitest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-undef': 'off', // Vue模板中的变量检查由vue-tsc处理

      // Disable conflicting rules
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-undef': 'off', // 在Vue SFC中由TypeScript处理
      'no-case-declarations': 'error',
      'no-prototype-builtins': 'error',
      'no-misleading-character-class': 'error',

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

  // Vue 模板特殊配置 - 禁用未定义变量检查
  {
    files: ['**/*.vue'],
    rules: {
      'no-undef': 'off' // Vue 模板中的变量由 vue-tsc 处理
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

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // 基础规则
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',

    // 代码风格
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error',
    'eol-last': 'error'
  },
  overrides: [
    {
      // Node.js工具文件
      files: ['docs/tools/**/*.js', 'scripts/**/*.js'],
      env: {
        node: true,
        browser: false
      },
      rules: {
        'no-console': 'off' // 允许在工具文件中使用console
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'coverage/',
    '.git/'
  ]
}

# InkDot 项目概览

## 📁 项目结构

```
inkdot/
├── 📁 src/                          # 源代码目录
│   ├── 📁 components/               # Vue组件
│   ├── 📁 stores/                   # Pinia状态管理
│   ├── 📁 types/                    # TypeScript类型定义
│   ├── 📁 utils/                    # 工具函数
│   ├── 📄 App.vue                   # 主应用组件
│   ├── 📄 main.ts                   # 应用入口
│   └── 📄 style.css                 # 全局样式
├── 📁 docs/                         # 文档目录
│   ├── 📁 architecture/             # 架构文档
│   ├── 📁 development/              # 开发文档
│   ├── 📁 design/                   # 设计文档
│   ├── 📁 images/                   # 文档图片
│   ├── 📄 PROJECT_STRUCTURE.md      # 项目结构文档
│   └── 📄 README.md                 # 文档说明
├── 📁 tools/                        # 工具脚本目录
│   │   └── 📄 run-tests.js          # 测试运行器
│   ├── 📁 screenshots/              # 测试截图目录
│   ├── 📄 cleanup.js                # 项目清理脚本
│   └── 📁 build/                    # 构建工具
├── 📁 tests/                        # 测试文件目录
├── 📁 public/                       # 静态资源
├── 📄 package.json                  # 项目配置
├── 📄 vite.config.ts                # Vite配置
├── 📄 tsconfig.json                 # TypeScript配置
├── 📄 eslint.config.js              # ESLint配置
└── 📄 README.md                     # 项目说明
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行所有测试
npm run test:run
```

### 项目清理

```bash
# 清理临时文件
npm run cleanup
```

## 🛠️ 主要功能

### 1. 大纲模式编辑器

- 层级节点管理
- 拖拽排序
- 折叠/展开
- 实时编辑

### 2. 中文字体支持

- 系统字体检测
- 字体渲染优化
- Docker中文支持

### 3. 测试工具

- Playwright自动化测试
- 中文渲染测试
- 字体检测工具
- 调试工具

## 📋 开发命令

| 命令                            | 说明                   |
| ------------------------------- | ---------------------- |
| `npm run dev`                   | 启动开发服务器         |
| `npm run build`                 | 构建生产版本           |
| `npm run test`                  | 运行单元测试           |
| `npm run test:playwright:all`   | 运行所有Playwright测试 |
| `npm run test:playwright:fonts` | 测试字体支持           |
| `npm run cleanup`               | 清理项目文件           |
| `npm run lint`                  | 代码检查               |

## 🔧 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + Vite
- **测试**: Vitest + Playwright
- **工具**: ESLint + TypeScript
- **字体**: Noto Sans CJK + WenQuanYi

## 📝 文档

- [项目结构文档](docs/PROJECT_STRUCTURE.md)
- [开发指南](docs/development/)
- [Playwright工具说明](tools/playwright/README.md)

## 🎯 当前状态

- ✅ MVP基础功能完成
- ✅ 大纲模式编辑器实现
- ✅ 中文字体支持完成
- ✅ 测试工具完善
- ✅ 项目结构整理完成

## 📞 支持

如有问题，请查看相关文档或提交Issue。

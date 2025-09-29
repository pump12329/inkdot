# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InkDot is a creative mind mapping platform with AI integration, built with Vue 3 + TypeScript. It provides an intuitive interface for creating mind maps with AI-powered content generation for various creative writing scenarios like novels, tabletop RPGs, and text adventures.

## Common Development Commands

### Development and Building

```bash
npm run dev              # Start development server on port 3000
npm run build            # Build for production (includes type checking)
npm run preview          # Preview production build
npm run type-check       # Run TypeScript type checking only
```

### Testing

```bash
npm run test              # Run Vitest unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui           # Run tests with UI interface
npm run test:unit         # Run only unit tests
npm run test:integration # Run integration tests
npm run test:e2e          # Run Playwright end-to-end tests
npm run test:playwright   # Run custom Playwright test runner
```

### Code Quality

```bash
npm run lint              # Run ESLint
npm run lint:fix          # Run ESLint with auto-fix
npm run format            # Format code with Prettier
npm run format:check      # Check formatting without changes
```

### Documentation and Project Management

```bash
npm run docs:update       # Update documentation timestamps
npm run chang:update      # Update changelog
npm run change:auto       # Auto-detect changes for changelog
npm run status:update     # Update project status
```

## Architecture Overview

### Core Components Structure

- **App.vue**: Main application container with header, toolbar, canvas, and sidebar
- **MindMapCanvas.vue**: Central canvas component that renders nodes and connections
- **MindMapNode.vue**: Individual node component with inline editing
- **Toolbar.vue**: Application toolbar with save/load/node operations

### State Management

- **Pinia Store** (`src/stores/mindmap.ts`): Centralized state management for nodes, connections, and project data
- **Composables**: Reusable logic hooks for keyboard shortcuts, mind map interactions, and viewport management

### Type System

- **Central Types** (`src/types/index.ts`): Comprehensive type definitions for mind map nodes, connections, and project data
- **Strict TypeScript**: `"strict": true` with explicit typing throughout

### Configuration

- **Vite** (`vite.config.ts`): Development server on port 3000 with path aliases
- **Vitest** (`vitest.config.ts`): Testing configuration with 70% coverage thresholds
- **ESLint**: Modern flat config with Vue and TypeScript support

## Key Development Principles

### Code Style

- **Vue 3 Composition API**: Use `<script setup>` syntax
- **TypeScript**: Strict mode with explicit types, avoid `any`
- **Component Naming**: PascalCase for components
- **File Naming**: Descriptive names like `MindMapNode.vue`, `useKeyboardShortcuts.ts`

### Architecture Patterns

- **Single Responsibility**: Each component and function has one clear purpose
- **Composables over Mixins**: Use Vue 3 composables for reusable logic
- **Centralized State**: Pinia stores for shared application state
- **Type Safety**: Comprehensive TypeScript definitions

### UI/UX Guidelines

- **Minimalist Design**: Black, white, gray color scheme with ample whitespace
- **Three-Click Rule**: Any feature reachable within 3 clicks
- **Responsive Design**: Full feature set on desktop, simplified on mobile
- **Keyboard Navigation**: Full keyboard shortcut support

### Testing Requirements

- **Coverage**: 70% minimum coverage for branches, functions, lines, statements
- **Test Types**: Unit tests with Vitest, E2E tests with Playwright
- **Test Organization**: Separate unit, integration, and performance test suites

## Path Aliases

The project uses several path aliases for cleaner imports:

- `@/` → `src/`
- `@core/` → `src/core/`
- `@ai/` → `src/ai/`
- `@ui/` → `src/ui/`
- `@services/` → `src/services/`
- `@plugins/` → `src/plugins/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`

## Git Workflow

### Commit Convention

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建工具

示例: feat(mindmap): 添加节点拖拽功能
```

### Pre-commit Hooks

- ESLint and Prettier on all JavaScript/TypeScript/Vue files
- Prettier on JSON, Markdown, YAML files
- Timestamp validation on Markdown files

## Environment Requirements

- **Node.js**: ≥ 20.0.0
- **npm**: ≥ 8.0.0
- **Browser**: Modern browsers with ES2020+ support

## AI Integration

The project integrates with AI services for content generation:

- **DeepSeek API**: Primary AI model for Chinese content generation
- **OpenRouter API**: Multi-model access and fallback
- **Local Processing**: Privacy-focused local data storage

## Important Notes

- The project follows a "simple is beautiful" philosophy - avoid over-engineering
- Focus on core functionality first, then add advanced features
- Maintain clean, readable code with comprehensive TypeScript typing
- All user data is stored locally for privacy protection

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InkDot is a Vue 3 + TypeScript-based mind mapping application with AI integration capabilities. It's designed as a single-page application (SPA) for creative writing and mind mapping with AI-powered features.

## Technology Stack

### Core Technologies

- **Vue 3.5.21** with TypeScript 5.9.2 and Composition API
- **Vite 7.0.0** for build tooling and development server
- **Pinia 3.0.3** for state management
- **Lucide Vue Next 0.544.0** for iconography

### Development Tools

- **TypeScript**: Full type safety with vue-tsc 3.0.7
- **ESLint 9.36.0** + **Prettier 3.6.2** for code quality
- **Vitest 3.2.4** for unit/integration testing
- **Playwright 1.55.1** for end-to-end testing
- **Husky 9.1.7** + **lint-staged 16.1.6** for Git hooks

### AI Integration

- **DeepSeek API** as primary AI provider
- **OpenRouter API** for multi-model access
- Environment variable configuration for API keys

## Common Development Commands

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests with Playwright
npm run test:performance # Performance tests

# Playwright specific tests
npm run test:playwright        # Run Playwright tests
npm run test:playwright:debug  # Debug mode
npm run test:playwright:all    # All Playwright tests
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Documentation Tools

```bash
# Update timestamps
npm run docs:update

# Update changelog
npm run changelog:update

# Add change entry
npm run change:add

# Update project status
npm run status:update
```

## Project Architecture

### SPA Design Principles

- **Single-page application** with client-side routing
- **Component-based architecture** with Vue 3 Composition API
- **Centralized state management** using Pinia
- **Modular structure** with clear separation of concerns

### Directory Structure

```
src/
├── components/           # Reusable Vue components
│   ├── MindMapCanvas.vue # Main mind map canvas
│   ├── MindMapNode.vue   # Individual node component
│   └── Button.vue        # Reusable button component
├── stores/              # Pinia state management
│   └── mindmap.ts       # Mind map state store
├── types/               # TypeScript type definitions
│   └── index.ts         # Core type definitions
├── utils/               # Utility functions
│   └── index.ts         # General utilities
├── composables/         # Vue composables
│   ├── useKeyboardShortcuts.ts
│   ├── useMindMapInteraction.ts
│   └── useViewport.ts
├── assets/              # Static assets and styles
├── App.vue              # Root application component
└── main.ts              # Application entry point
```

### State Management (Pinia)

- **Modular stores** by feature area
- **Composition API style** with `defineStore`
- **Smart persistence** for user data
- **Read-only state exposure** with computed properties

Example store structure:

```typescript
export const useMindMapStore = defineStore('mindMap', () => {
  const nodes = ref<MindMapNode[]>([]);
  const selectedNodeId = ref<string | null>(null);

  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value));

  function addNode(node: MindMapNode) {
    nodes.value.push(node);
  }

  return { nodes: readonly(nodes), selectedNodeId, selectedNode, addNode };
});
```

### Component Architecture

- **Single-file components** with `<script setup>` syntax
- **Props and emits** for component communication
- **Slots** for flexible content composition
- **TypeScript support** for component props and events

## Key Features

### Mind Mapping Core

- Interactive canvas for node creation and manipulation
- Drag-and-drop functionality for nodes
- Zoom and pan controls
- Grid system for alignment
- Node connection management

### AI Integration

- DeepSeek API integration for content generation
- OpenRouter API for multi-model access
- Context-aware suggestions
- Content generation for mind map nodes

### CSS Style System

- Custom CSS-based design system
- Responsive design principles
- Theme support (light/dark modes)
- Utility classes for rapid development

## Development Workflow

### Git Workflow

- **main**: Stable production branch
- **feature/\***: Feature development branches
- **docs/\***: Documentation updates
- **timestamp/\***: Timestamp system updates

### Commit Convention

```
feat: new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: test updates
chore: build tool changes
timestamp: timestamp system updates
```

### Pre-commit Hooks

- ESLint checks on staged files
- Prettier formatting
- Timestamp validation for markdown files

## Configuration Files

### Build Configuration

- **vite.config.ts**: Vue plugin with path aliases
- **vitest.config.ts**: Test configuration with coverage
- **eslint.config.js**: Flat config with TypeScript and Vue support

### Path Aliases

- `@/` → `src/`
- `@core/` → `src/core/`
- `@ai/` → `src/ai/`
- `@ui/` → `src/ui/`
- `@services/` → `src/services/`
- `@plugins/` → `src/plugins/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`

## Testing Strategy

### Unit Testing

- **Vitest** with jsdom environment
- **Vue Test Utils** for component testing
- **Coverage thresholds**: 70% across all metrics
- **Global test setup** in `tests/setup.ts`

### Integration Testing

- Component interaction testing
- Store behavior testing
- API integration testing

### End-to-End Testing

- **Playwright** for browser automation
- Chinese font support testing
- UI component testing
- Performance testing

## Code Quality Standards

### TypeScript

- Strict mode enabled
- Proper type definitions
- Interface over type alias preference
- Generic types for reusable components

### Vue.js

- Composition API with `<script setup>`
- Proper prop validation
- Emit events for parent communication
- Composables for reusable logic

### ESLint Rules

- No unused variables (with `_` prefix exception)
- Prefer const over let
- No console.log in production
- Vue-specific best practices

### Prettier Configuration

- Single quotes, semicolons
- 2-space indentation
- 100 character line width
- LF line endings

## Cursor Rules Integration

The project includes comprehensive Cursor rules in `.cursor/rules/` that are automatically applied:

### Core Rules (Always Applied)

- **project-info.mdc**: Project基本信息
- **frontend-development.mdc**: Vue 3 + TypeScript开发规范
- **code-quality-standards.mdc**: ESLint代码质量标准
- **project-tools.mdc**: 项目工具使用规范

### Context-Aware Rules

AI assistants automatically select rules based on request context:

- Design requests: `ui-design-system` + `css-style-system`
- Development requests: `component-architecture` + `testing-standards`
- AI features: `ai-integration` + `testing-standards`
- Architecture: `architecture` + `component-architecture`

## Environment Setup

### Required Environment Variables

```bash
# DeepSeek API (primary)
DEEPSEEK_API_KEY="your-deepseek-api-key"

# OpenRouter API (optional)
OPENROUTER_API_KEY="your-openrouter-api-key"

# Development mode
NODE_ENV="development"
```

### Node.js Requirements

- **Node.js**: >= 20.0.0
- **npm**: >= 8.0.0

## Performance Considerations

### Development Performance

- Vite's fast hot module replacement
- Efficient TypeScript checking
- Optimized bundle analysis

### Production Performance

- Code splitting and lazy loading
- Efficient state management
- Optimized asset delivery
- Performance monitoring with coverage reports

## Documentation System

### Timestamp System

- Automated timestamp management with `docs/tools/timestamp-helper.js`
- Version tracking and status management
- Changelog generation
- Documentation update automation

### Documentation Structure

- Project documentation in `docs/`
- Cursor rules in `.cursor/rules/`
- API documentation generation
- Development guides and standards

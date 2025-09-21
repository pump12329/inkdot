# InkDot 测试工作流文档

**版本**: v1.0.0  
**创建时间戳**: T0.5  
**最后更新**: T0.5  
**状态**: 🟢 CURRENT  
**下次审查**: T7.5  

---

## 概述

本文档定义了InkDot项目的完整测试工作流，包括测试策略、执行流程、质量标准和自动化流程。

### 测试工作流目标

- **质量保证**: 确保代码质量和功能正确性
- **持续集成**: 自动化测试和部署流程
- **快速反馈**: 及时发现和修复问题
- **性能监控**: 持续监控应用性能
- **安全防护**: 识别和修复安全漏洞

---

## 测试工作流架构

### 测试金字塔

```
    ┌─────────────────┐
    │   E2E Tests     │ ← 少量，关键用户流程
    │   (5-10%)       │
    ├─────────────────┤
    │ Integration     │ ← 适量，模块间交互
    │ Tests (20-30%)  │
    ├─────────────────┤
    │ Unit Tests      │ ← 大量，核心业务逻辑
    │ (60-70%)        │
    └─────────────────┘
```

### 测试类型分布

- **单元测试**: 70% - 核心业务逻辑和工具函数
- **集成测试**: 25% - 模块间交互和API集成
- **端到端测试**: 5% - 关键用户流程和完整场景

---

## 测试执行流程

### 1. 本地开发测试

#### 开发前准备
```bash
# 安装依赖
npm install

# 运行代码质量检查
npm run lint
npm run format:check
npm run type-check
```

#### 开发中测试
```bash
# 监听模式运行测试
npm run test:watch

# 运行特定测试文件
npm test tests/unit/core/mindmap.test.ts

# 运行测试UI界面
npm run test:ui
```

#### 提交前检查
```bash
# 运行所有测试
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# 构建测试
npm run build
```

### 2. 持续集成测试

#### GitHub Actions工作流

**触发条件:**
- 推送到main或develop分支
- 创建Pull Request
- 手动触发

**测试阶段:**

1. **代码质量检查** (lint)
   - ESLint代码规范检查
   - Prettier代码格式检查
   - TypeScript类型检查

2. **单元测试** (unit-tests)
   - 运行所有单元测试
   - 生成覆盖率报告
   - 上传到Codecov

3. **集成测试** (integration-tests)
   - 模块间交互测试
   - AI功能集成测试
   - 数据持久化测试

4. **构建测试** (build-test)
   - 生产环境构建
   - 构建产物验证
   - 静态资源检查

5. **性能测试** (performance-test)
   - Lighthouse性能审计
   - 内存使用监控
   - 渲染性能测试

6. **安全扫描** (security-scan)
   - npm audit安全检查
   - CodeQL静态分析
   - 依赖漏洞扫描

### 3. 测试结果处理

#### 成功标准
- 所有测试通过 (100%)
- 代码覆盖率 ≥ 70%
- 性能指标达标
- 安全扫描无高危漏洞

#### 失败处理
- 自动通知开发者
- 阻止合并到主分支
- 生成详细错误报告
- 提供修复建议

---

## 测试质量标准

### 覆盖率要求

| 测试类型 | 覆盖率目标 | 最低要求 |
|---------|-----------|----------|
| 语句覆盖率 | ≥ 80% | ≥ 70% |
| 分支覆盖率 | ≥ 75% | ≥ 65% |
| 函数覆盖率 | ≥ 85% | ≥ 75% |
| 行覆盖率 | ≥ 80% | ≥ 70% |

### 性能基准

| 指标 | 目标值 | 警告阈值 |
|------|--------|----------|
| 首屏加载时间 | < 2s | > 3s |
| 交互响应时间 | < 100ms | > 200ms |
| 内存使用 | < 100MB | > 150MB |
| CPU使用率 | < 30% | > 50% |

### 安全标准

- 无高危安全漏洞
- 依赖包安全审计通过
- 代码静态分析无严重问题
- 敏感信息无泄露风险

---

## 测试环境配置

### 开发环境

```bash
# 环境变量配置
VITE_APP_ENV=development
VITE_DEEPSEEK_API_KEY=test-key
VITE_OPENROUTER_API_KEY=test-key
VITE_APP_DEBUG=true
```

### 测试环境

```bash
# 环境变量配置
VITE_APP_ENV=test
VITE_DEEPSEEK_API_KEY=test-api-key
VITE_OPENROUTER_API_KEY=test-api-key
VITE_APP_DEBUG=false
```

### 生产环境

```bash
# 环境变量配置
VITE_APP_ENV=production
VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
VITE_OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
VITE_APP_DEBUG=false
```

---

## 测试数据管理

### 测试数据生成

```typescript
// 使用TestDataGenerator生成测试数据
import { TestDataGenerator } from '@/tests/utils/test-data-generator'

// 生成节点数据
const nodes = TestDataGenerator.generateNodes(100)

// 生成连接数据
const connections = TestDataGenerator.generateConnections(nodes, 50)

// 生成性能测试数据
const perfData = TestDataGenerator.generatePerformanceTestData('large')
```

### 测试数据隔离

- 每个测试用例使用独立的测试数据
- 测试后自动清理数据
- 避免测试间的数据污染
- 使用Mock和Stub隔离外部依赖

---

## 测试报告和监控

### 测试报告生成

```bash
# 生成HTML覆盖率报告
npm run test:coverage

# 生成JUnit格式报告
npm run test:run -- --reporter=junit --outputFile=test-results.xml

# 生成性能报告
npm run test:performance
```

### 持续监控

- **Codecov**: 代码覆盖率监控
- **GitHub Actions**: 测试执行状态
- **Lighthouse CI**: 性能监控
- **Dependabot**: 依赖安全监控

---

## 测试最佳实践

### 1. 测试编写原则

- **AAA模式**: Arrange, Act, Assert
- **单一职责**: 每个测试只验证一个功能
- **独立性**: 测试之间相互独立
- **可重复**: 测试结果稳定可重复

### 2. 测试命名规范

```typescript
// 描述性命名
describe('MindMapEngine', () => {
  describe('节点管理', () => {
    it('应该能够创建新节点', () => {
      // 测试实现
    })
    
    it('应该在创建节点时生成唯一ID', () => {
      // 测试实现
    })
  })
})
```

### 3. 测试组织

```
tests/
├── unit/                    # 单元测试
│   ├── core/               # 核心功能
│   ├── ai/                 # AI功能
│   └── ui/                 # UI组件
├── integration/            # 集成测试
├── e2e/                    # 端到端测试
├── performance/            # 性能测试
├── utils/                  # 测试工具
└── examples/               # 示例测试
```

### 4. Mock和Stub使用

```typescript
// 使用Vitest Mock
import { vi } from 'vitest'

// Mock外部API
vi.mock('@/services/api', () => ({
  fetchAIResponse: vi.fn().mockResolvedValue({
    content: 'Mock response',
    timestamp: new Date()
  })
}))

// Mock DOM API
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})
```

---

## 故障排除指南

### 常见问题

#### 1. 测试超时

```typescript
// 增加测试超时时间
test('长时间运行的测试', async () => {
  // 测试代码
}, 10000) // 10秒超时
```

#### 2. 异步测试

```typescript
// 正确处理异步操作
test('异步操作测试', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```

#### 3. DOM操作测试

```typescript
// 等待DOM更新
test('DOM操作测试', async () => {
  renderComponent()
  await nextTick()
  expect(document.querySelector('.test-element')).toBeTruthy()
})
```

### 调试技巧

```typescript
// 使用console.log调试
test('调试测试', () => {
  const result = complexFunction()
  console.log('调试信息:', result)
  expect(result).toBeDefined()
})

// 使用debugger
test('断点调试', () => {
  debugger // 在浏览器中设置断点
  const result = functionToDebug()
  expect(result).toBeDefined()
})
```

---

## 测试工作流检查清单

### 开发前检查

- [ ] 阅读相关测试文档
- [ ] 理解测试需求和标准
- [ ] 准备测试环境和数据
- [ ] 确认测试工具配置

### 开发中检查

- [ ] 编写单元测试
- [ ] 运行本地测试
- [ ] 检查代码覆盖率
- [ ] 验证测试通过

### 提交前检查

- [ ] 运行完整测试套件
- [ ] 检查代码质量
- [ ] 验证性能指标
- [ ] 确认安全扫描通过

### 发布前检查

- [ ] 所有测试通过
- [ ] 覆盖率达标
- [ ] 性能基准满足
- [ ] 安全扫描通过
- [ ] 文档更新完成

---

## 总结

本测试工作流文档提供了InkDot项目的完整测试策略和执行流程。通过遵循这些标准和最佳实践，可以确保代码质量、提升开发效率和保证应用稳定性。

### 关键要点

- **测试优先**: 编写测试用例，确保代码质量
- **持续集成**: 自动化测试和部署流程
- **质量监控**: 持续监控代码质量和性能
- **快速反馈**: 及时发现和解决问题

### 相关文档

- [测试调试指南](testing-debugging-guide.md)
- [代码规范文档](coding-standards.md)
- [项目规则文档](project-rules.md)
- [部署指南](../deployment/README.md)

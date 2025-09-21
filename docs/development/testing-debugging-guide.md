# InkDot 测试调试指南

**版本**: v1.0.0  
**创建时间戳**: T0.5  
**最后更新**: T0.5  
**状态**: 🟢 CURRENT  
**下次审查**: T7.5  

---

## 目录

- [概述](#概述)
- [测试策略](#测试策略)
- [单元测试](#单元测试)
- [集成测试](#集成测试)
- [端到端测试](#端到端测试)
- [调试工具和方法](#调试工具和方法)
- [常见问题和解决方案](#常见问题和解决方案)
- [性能测试](#性能测试)
- [测试数据管理](#测试数据管理)
- [持续集成](#持续集成)

---

## 概述

本文档提供了InkDot项目的完整测试和调试指南，包括测试策略、调试工具、常见问题解决方案和最佳实践。

### 测试目标

- **功能正确性**: 确保所有功能按预期工作
- **性能优化**: 验证应用性能满足要求
- **用户体验**: 保证界面响应性和易用性
- **代码质量**: 维持高标准的代码质量
- **稳定性**: 确保应用长期稳定运行

---

## 测试策略

### 测试金字塔

```
    /\
   /E2E\     <- 端到端测试 (少量)
  /______\
 /        \
/INTEGRATION\ <- 集成测试 (适量)
/____________\
/              \
/   UNIT TESTS   \ <- 单元测试 (大量)
/________________\
```

### 测试覆盖率目标

- **单元测试**: ≥ 80%
- **集成测试**: ≥ 60%
- **端到端测试**: 关键用户流程 100%

---

## 单元测试

### 测试框架

- **主框架**: Vitest
- **Vue组件测试**: @vue/test-utils
- **DOM环境**: jsdom
- **断言库**: 内置断言

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test tests/basic.test.ts

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# 运行测试UI界面
npm run test:ui
```

### 测试文件结构

```
tests/
├── unit/                    # 单元测试
│   ├── core/               # 核心功能测试
│   │   ├── mindmap.test.ts
│   │   └── engine.test.ts
│   ├── ai/                 # AI功能测试
│   │   ├── services.test.ts
│   │   └── agents.test.ts
│   └── ui/                 # UI组件测试
│       ├── Button.test.ts
│       └── Input.test.ts
├── integration/            # 集成测试
│   ├── mindmap-ai.test.ts
│   └── workspace.test.ts
└── e2e/                    # 端到端测试
    ├── user-journey.test.ts
    └── performance.test.ts
```

### 单元测试示例

```typescript
// tests/unit/core/mindmap.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { MindMapEngineImpl } from '@/core/mindmap/engine'

describe('MindMapEngine', () => {
  let engine: MindMapEngineImpl

  beforeEach(() => {
    engine = new MindMapEngineImpl()
  })

  describe('节点管理', () => {
    it('应该能够创建新节点', () => {
      const node = engine.createNode('测试节点', { x: 100, y: 100 })
      
      expect(node).toBeDefined()
      expect(node.content).toBe('测试节点')
      expect(node.position).toEqual({ x: 100, y: 100 })
    })

    it('应该能够更新节点内容', () => {
      const node = engine.createNode('原始内容', { x: 100, y: 100 })
      const updated = engine.updateNode(node.id, { content: '更新内容' })
      
      expect(updated.content).toBe('更新内容')
    })

    it('应该能够删除节点', () => {
      const node = engine.createNode('待删除节点', { x: 100, y: 100 })
      const success = engine.deleteNode(node.id)
      
      expect(success).toBe(true)
      expect(engine.getNode(node.id)).toBeUndefined()
    })
  })

  describe('连接管理', () => {
    it('应该能够创建节点连接', () => {
      const node1 = engine.createNode('节点1', { x: 100, y: 100 })
      const node2 = engine.createNode('节点2', { x: 200, y: 200 })
      
      const connection = engine.addConnection(node1.id, node2.id, 'related')
      
      expect(connection).toBeDefined()
      expect(connection.from).toBe(node1.id)
      expect(connection.to).toBe(node2.id)
    })
  })
})
```

### Vue组件测试示例

```typescript
// tests/unit/ui/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/ui/components/Button.vue'

describe('Button组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '测试按钮'
      }
    })
    
    expect(wrapper.text()).toBe('测试按钮')
    expect(wrapper.classes()).toContain('inline-flex')
  })

  it('应该支持不同变体', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary' },
      slots: { default: '主要按钮' }
    })
    
    expect(wrapper.classes()).toContain('bg-blue-600')
  })

  it('应该处理点击事件', async () => {
    const wrapper = mount(Button, {
      slots: { default: '可点击按钮' }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('应该在禁用状态下不触发点击', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: '禁用按钮' }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

---

## 集成测试

### 测试场景

集成测试验证不同模块之间的交互：

- **MindMap + AI**: 思维导图与AI服务的集成
- **UI + Core**: 用户界面与核心引擎的交互
- **Storage + Engine**: 数据存储与引擎的集成
- **API + Services**: API调用与服务层的集成

### 集成测试示例

```typescript
// tests/integration/mindmap-ai.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { MindMapEngineImpl } from '@/core/mindmap/engine'
import { AIManager } from '@/ai/ai-manager'

describe('MindMap与AI集成', () => {
  let engine: MindMapEngineImpl
  let aiManager: AIManager

  beforeEach(() => {
    engine = new MindMapEngineImpl()
    aiManager = new AIManager()
  })

  it('应该能够使用AI生成节点内容', async () => {
    const node = engine.createNode('中心主题', { x: 400, y: 300 })
    const creativeAssistant = aiManager.getAgent('creative-assistant')
    
    const suggestions = await creativeAssistant.generateSuggestions(
      node.content,
      'expand'
    )
    
    expect(suggestions).toBeDefined()
    expect(suggestions.length).toBeGreaterThan(0)
  })

  it('应该能够保存和加载思维导图', () => {
    // 创建测试数据
    const node1 = engine.createNode('节点1', { x: 100, y: 100 })
    const node2 = engine.createNode('节点2', { x: 200, y: 200 })
    engine.addConnection(node1.id, node2.id, 'related')
    
    // 导出数据
    const exported = engine.exportData()
    expect(exported.nodes.length).toBe(2)
    expect(exported.connections.length).toBe(1)
    
    // 创建新引擎并导入数据
    const newEngine = new MindMapEngineImpl()
    newEngine.importData(exported)
    
    // 验证数据正确导入
    const nodes = newEngine.getAllNodes()
    expect(nodes.length).toBe(2)
  })
})
```

---

## 端到端测试

### 测试工具

- **主框架**: Playwright (推荐) 或 Cypress
- **浏览器**: Chrome, Firefox, Safari
- **测试环境**: 本地开发服务器

### E2E测试示例

```typescript
// tests/e2e/user-journey.test.ts
import { test, expect } from '@playwright/test'

test.describe('用户完整流程', () => {
  test('用户创建和管理思维导图', async ({ page }) => {
    // 访问应用
    await page.goto('http://localhost:3000')
    
    // 等待应用加载
    await expect(page.locator('h1')).toContainText('InkDot')
    
    // 创建新节点
    await page.click('button:has-text("添加节点")')
    await page.fill('input[placeholder*="节点内容"]', '我的第一个节点')
    await page.click('button:has-text("创建")')
    
    // 验证节点创建成功
    await expect(page.locator('.mindmap-canvas')).toBeVisible()
    
    // 测试节点选择
    await page.click('.mindmap-canvas')
    await expect(page.locator('.context-menu')).toBeVisible()
    
    // 测试AI功能
    await page.click('button:has-text("启用")')
    await expect(page.locator('text=已启用')).toBeVisible()
  })

  test('思维导图导出功能', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // 创建一些节点
    await page.click('button:has-text("添加节点")')
    await page.fill('input[placeholder*="节点内容"]', '导出测试节点')
    await page.click('button:has-text("创建")')
    
    // 测试导出功能
    await page.click('button:has-text("导出")')
    
    // 验证下载开始
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("JSON")')
    const download = await downloadPromise
    
    expect(download.suggestedFilename()).toMatch(/\.json$/)
  })
})
```

---

## 调试工具和方法

### 开发环境调试

#### 1. 浏览器开发者工具

```javascript
// 在浏览器控制台中的调试命令
console.log('当前思维导图状态:', window.mindMapEngine.getState())
console.log('AI管理器状态:', window.aiManager.getStatus())

// 性能分析
console.time('节点创建')
engine.createNode('性能测试节点', { x: 100, y: 100 })
console.timeEnd('节点创建')
```

#### 2. Vue DevTools

```javascript
// 在Vue DevTools中检查组件状态
// 1. 安装Vue DevTools浏览器扩展
// 2. 在组件面板中查看组件props、data、computed
// 3. 使用时间旅行调试功能
```

#### 3. 网络调试

```javascript
// API调用调试
fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '测试提示' })
})
.then(response => {
  console.log('API响应状态:', response.status)
  return response.json()
})
.then(data => {
  console.log('API响应数据:', data)
})
.catch(error => {
  console.error('API调用错误:', error)
})
```

### 代码调试

#### 1. 断点调试

```typescript
// 在VS Code中设置断点
export class MindMapEngineImpl implements IMindMapEngine {
  createNode(content: string, position: Position): MindMapNode {
    // 在这里设置断点
    debugger; // 或者使用VS Code断点
    
    const node: MindMapNode = {
      id: this.generateId(),
      content,
      position,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.nodes.set(node.id, node)
    this.emit('node-created', node)
    
    return node
  }
}
```

#### 2. 日志调试

```typescript
// 使用结构化日志
import { createLogger } from '@/utils/logger'

const logger = createLogger('MindMapEngine')

export class MindMapEngineImpl {
  createNode(content: string, position: Position): MindMapNode {
    logger.debug('创建节点', { content, position })
    
    try {
      const node = this.doCreateNode(content, position)
      logger.info('节点创建成功', { nodeId: node.id })
      return node
    } catch (error) {
      logger.error('节点创建失败', { error, content, position })
      throw error
    }
  }
}
```

#### 3. 性能调试

```typescript
// 性能监控
import { performance } from 'perf_hooks'

export class CanvasRenderer {
  render(nodes: MindMapNode[], connections: MindMapConnection[]): void {
    const startTime = performance.now()
    
    this.clearCanvas()
    this.drawNodes(nodes)
    this.drawConnections(connections)
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (duration > 16) { // 超过一帧的时间
      console.warn(`渲染耗时过长: ${duration.toFixed(2)}ms`)
    }
  }
}
```

---

## 常见问题和解决方案

### 1. 构建错误

#### 问题: TypeScript编译错误

```bash
# 错误信息
src/App.vue(8,42): error TS2339: Property 'app' does not exist on type 'AppConfig'
```

**解决方案:**
```typescript
// 检查配置文件类型定义
interface AppConfig {
  app: {
    title: string
    version: string
  }
  // ... 其他配置
}

// 或者使用类型断言
const title = (appConfig as any).app.title
```

#### 问题: 依赖冲突

```bash
# 错误信息
npm error ERESOLVE unable to resolve dependency tree
```

**解决方案:**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用legacy peer deps
npm install --legacy-peer-deps
```

### 2. 运行时错误

#### 问题: Canvas渲染错误

```javascript
// 错误: Canvas context获取失败
const ctx = canvas.getContext('2d')
// ctx is null
```

**解决方案:**
```typescript
export class CanvasRenderer {
  init(canvas: HTMLCanvasElement): void {
    if (!canvas) {
      throw new Error('Canvas元素未找到')
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法获取Canvas 2D上下文')
    }
    
    this.ctx = ctx
  }
}
```

#### 问题: AI API调用失败

```javascript
// 错误: API密钥无效
fetch('/api/ai/chat', {
  headers: { 'Authorization': 'Bearer invalid-key' }
})
```

**解决方案:**
```typescript
export class AIService {
  private validateApiKey(): void {
    if (!this.apiKey) {
      throw new Error('AI API密钥未配置')
    }
    
    if (this.apiKey.length < 10) {
      throw new Error('AI API密钥格式无效')
    }
  }
  
  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    this.validateApiKey()
    
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      })
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('AI API调用错误:', error)
      throw error
    }
  }
}
```

### 3. 性能问题

#### 问题: 大量节点时渲染卡顿

**解决方案:**
```typescript
export class CanvasRenderer {
  private renderQueue: RenderTask[] = []
  private isRendering = false
  
  render(nodes: MindMapNode[], connections: MindMapConnection[]): void {
    // 使用渲染队列避免频繁重绘
    this.renderQueue.push({ nodes, connections, timestamp: Date.now() })
    
    if (!this.isRendering) {
      this.processRenderQueue()
    }
  }
  
  private processRenderQueue(): void {
    if (this.renderQueue.length === 0) {
      this.isRendering = false
      return
    }
    
    this.isRendering = true
    const task = this.renderQueue.shift()!
    
    requestAnimationFrame(() => {
      this.doRender(task.nodes, task.connections)
      this.processRenderQueue()
    })
  }
}
```

---

## 性能测试

### 性能指标

- **首屏加载时间**: < 2秒
- **交互响应时间**: < 100ms
- **内存使用**: < 100MB
- **CPU使用率**: < 30%

### 性能测试工具

```bash
# 使用Lighthouse进行性能审计
npx lighthouse http://localhost:3000 --output html --output-path ./reports/lighthouse.html

# 使用WebPageTest
# 访问 https://www.webpagetest.org/ 进行在线测试
```

### 性能测试代码

```typescript
// tests/performance/rendering.test.ts
import { describe, it, expect } from 'vitest'
import { performance } from 'perf_hooks'
import { CanvasRenderer } from '@/core/mindmap/renderer'

describe('渲染性能测试', () => {
  it('应该能够快速渲染1000个节点', () => {
    const renderer = new CanvasRenderer()
    const nodes = generateTestNodes(1000)
    const connections = generateTestConnections(500)
    
    const startTime = performance.now()
    renderer.render(nodes, connections)
    const endTime = performance.now()
    
    const duration = endTime - startTime
    expect(duration).toBeLessThan(100) // 应该在100ms内完成
  })
  
  it('内存使用应该保持稳定', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
    
    // 执行大量操作
    for (let i = 0; i < 1000; i++) {
      const nodes = generateTestNodes(100)
      renderer.render(nodes, [])
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    // 内存增长应该小于50MB
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
  })
})
```

---

## 测试数据管理

### 测试数据生成

```typescript
// tests/utils/test-data-generator.ts
export class TestDataGenerator {
  static generateNodes(count: number): MindMapNode[] {
    const nodes: MindMapNode[] = []
    
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: `test-node-${i}`,
        content: `测试节点 ${i}`,
        position: {
          x: Math.random() * 1000,
          y: Math.random() * 1000
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    
    return nodes
  }
  
  static generateConnections(nodes: MindMapNode[], count: number): MindMapConnection[] {
    const connections: MindMapConnection[] = []
    
    for (let i = 0; i < count; i++) {
      const fromIndex = Math.floor(Math.random() * nodes.length)
      const toIndex = Math.floor(Math.random() * nodes.length)
      
      if (fromIndex !== toIndex) {
        connections.push({
          id: `test-connection-${i}`,
          from: nodes[fromIndex].id,
          to: nodes[toIndex].id,
          type: 'related',
          createdAt: new Date()
        })
      }
    }
    
    return connections
  }
}
```

### 测试环境配置

```typescript
// tests/setup.ts
import { config } from 'vitest/config'

// 全局测试配置
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts'
      ]
    }
  }
}

// 测试前准备
beforeEach(() => {
  // 清理DOM
  document.body.innerHTML = ''
  
  // 重置全局状态
  window.localStorage.clear()
  window.sessionStorage.clear()
})

afterEach(() => {
  // 清理副作用
  jest.clearAllMocks()
})
```

---

## 持续集成

### GitHub Actions配置

```yaml
# .github/workflows/test.yml
name: 测试和构建

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: 安装依赖
      run: npm ci
    
    - name: 运行类型检查
      run: npm run type-check
    
    - name: 运行linting
      run: npm run lint
    
    - name: 运行单元测试
      run: npm run test:coverage
    
    - name: 上传覆盖率报告
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: 运行构建测试
      run: npm run build
    
    - name: 部署到测试环境
      if: github.ref == 'refs/heads/main'
      run: |
        echo "部署到测试环境"
        # 这里添加部署脚本
```

### 测试报告

```bash
# 生成测试报告
npm run test:coverage

# 查看HTML报告
open coverage/index.html

# 生成JUnit报告（用于CI）
npm run test -- --reporter=junit --outputFile=test-results.xml
```

---

## 调试检查清单

### 开发前检查

- [ ] 代码格式化和linting通过
- [ ] TypeScript类型检查通过
- [ ] 单元测试覆盖率达标
- [ ] 性能基准测试通过

### 发布前检查

- [ ] 所有测试通过
- [ ] 端到端测试验证关键流程
- [ ] 性能测试满足要求
- [ ] 安全漏洞扫描通过
- [ ] 浏览器兼容性测试通过

### 问题排查步骤

1. **重现问题**: 确定问题复现步骤
2. **查看日志**: 检查控制台和网络日志
3. **检查环境**: 验证开发/生产环境配置
4. **分析数据**: 检查输入数据和状态
5. **隔离问题**: 缩小问题范围
6. **修复验证**: 确认修复有效且无副作用

---

## 总结

本测试调试指南提供了InkDot项目的完整测试策略和调试方法。通过遵循这些最佳实践，可以确保代码质量、提升开发效率和保证应用稳定性。

### 关键要点

- **测试优先**: 编写测试用例，确保代码质量
- **持续集成**: 自动化测试和部署流程
- **性能监控**: 定期进行性能测试和优化
- **问题追踪**: 建立完善的问题记录和解决机制

### 相关文档

- [开发环境配置指南](development-environment-setup.md)
- [代码规范文档](coding-standards.md)
- [API文档](../api/README.md)
- [部署指南](../deployment/README.md)

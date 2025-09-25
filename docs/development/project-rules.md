# InkDot 项目开发规则

> **文档版本**：v1.5.0  
> **创建时间戳**：T1  
> **最后更新**：T0.5  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.5

## 项目概述

InkDot是一个基于思维导图的创意创作平台，集成AI功能，支持小说创作、跑团、文字冒险等多种创作模式。

## 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + Vite
- **后端**: Node.js + Express + Fastify
- **AI集成**: DeepSeek API + OpenRouter API + LangChain
- **存储**: SQLite + JSON文件 + 本地存储
- **样式**: CSS + 自定义组件库（基于墨点Logo设计）

## 文档和时间戳管理

### 时间戳系统规范

- **基准时间**: 项目启动时间为 2025-09-21 00:00:00 UTC (T0)
- **时间戳格式**: `T{天数}` 或 `T{天数}.{小时}`
- **获取当前时间戳**: 使用 `npm run timestamp:current`
- **文档更新**: 重要修改后必须更新时间戳

### 时间戳工具使用

```bash
# 获取当前项目时间戳
npm run timestamp:current

# 转换时间戳为详细信息
node docs/tools/timestamp-helper.js convert T1.5

# 计算下次审查时间
node docs/tools/timestamp-helper.js next-review T0.1

# 更新文档时间戳
npm run docs:update docs/README.md

# 生成新文档头部信息
npm run docs:header v1.0.0 T0.1
```

### 文档头部规范

所有文档必须包含以下头部信息：

```markdown
> **文档版本**：v1.0.0  
> **创建时间戳**：T0  
> **最后更新**：T0.1  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.1
```

### 文档状态标识

- 🟢 **CURRENT** - 当前版本，推荐使用
- 🟡 **OUTDATED** - 过时版本，计划更新
- 🔴 **DEPRECATED** - 已废弃，不再维护
- 🚧 **DRAFT** - 草稿状态，开发中
- 📋 **PLANNED** - 计划创建

### 文档更新流程

1. 修改文档内容
2. 更新版本号（如有重大变更）
3. 使用工具更新时间戳：`npm run docs:update <文档路径>`
4. 检查文档状态标识
5. 提交变更并记录到CHANGELOG.md

## 极简主义开发规范

### 代码极简主义原则

- **简洁性优先**: 代码应该简洁明了，避免过度工程化
- **功能单一**: 每个函数和组件只做一件事
- **减少复杂性**: 优先选择简单的解决方案
- **自文档化**: 代码本身就是最好的文档

### 架构极简主义

- **渐进式开发**: 先实现核心功能，再添加高级特性
- **避免过度设计**: 不一次性设计所有可能的扩展
- **模块化**: 保持模块间低耦合，高内聚
- **统一标准**: 所有模块遵循相同的设计模式

### 文档极简主义

- **必要信息**: 只记录必要的信息，避免冗余
- **结构化**: 使用统一的文档结构
- **时效性**: 及时更新，避免过时信息
- **可发现性**: 信息容易找到和理解

## 代码规范

### TypeScript规范

- 使用严格模式 `"strict": true`
- 所有函数必须有明确的返回类型
- 使用接口定义数据结构，避免any类型
- 优先使用type而不是interface，除非需要继承
- 使用泛型提高代码复用性

```typescript
// 好的示例
interface MindMapNode {
  id: string;
  content: string;
  position: { x: number; y: number };
  connections: string[];
}

function createNode(data: Partial<MindMapNode>): MindMapNode {
  return {
    id: generateId(),
    content: data.content || '',
    position: data.position || { x: 0, y: 0 },
    connections: data.connections || []
  };
}
```

### Vue 3规范（极简主义）

- **使用Composition API**：避免Options API，保持代码简洁
- **使用`<script setup>`语法**：减少样板代码
- **组件名使用PascalCase**：保持命名一致性
- **Props使用defineProps，Emits使用defineEmits**：明确的接口定义
- **使用ref/reactive进行响应式数据管理**：避免过度复杂的状态管理
- **组件职责单一**：每个组件只负责一个功能
- **避免深层嵌套**：保持组件结构扁平化
- **优先使用组合式函数**：提高代码复用性

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MindMapNode } from '@/types';

interface Props {
  node: MindMapNode;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
});

const emit = defineEmits<{
  update: [node: MindMapNode];
  delete: [nodeId: string];
}>();

const isEditing = ref(false);
const nodeContent = ref(props.node.content);
</script>
```

### 文件命名规范（极简主义）

- **组件文件使用PascalCase**: `MindMapNode.vue`
- **工具函数文件使用camelCase**: `nodeUtils.ts`
- **类型定义文件使用camelCase**: `mindMapTypes.ts`
- **常量文件使用UPPER_CASE**: `API_CONSTANTS.ts`
- **避免过长的文件名**：保持简洁明了
- **使用描述性名称**：文件名应该清楚表达内容
- **避免缩写**：除非是广泛认知的缩写
- **保持一致性**：相同类型的文件使用相同的命名模式

### 目录结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # 基础UI组件
│   ├── mindmap/        # 思维导图相关组件
│   └── workspace/      # 工作区组件
├── views/              # 页面组件
├── stores/             # Pinia状态管理
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── services/           # API服务
├── hooks/              # 组合式函数
└── assets/             # 静态资源
```

## AI功能开发规范（极简主义）

### AI服务集成原则

- **模型可自主选择**：用户可在 DeepSeek API 与 OpenRouter 等模型间自由切换
- **统一接口设计**：所有 AI 服务需实现统一的接口规范
- **智能默认配置**：为用户预设合理参数，降低配置门槛
- **渐进式功能**：高级 AI 能力按需解锁，逐步引导用户体验
- **成本透明**：API 调用费用实时监控，用户可见
- **统一错误处理**：所有错误反馈需标准化，提示清晰友好

## 极简主义设计原则

### 设计哲学

InkDot遵循极简主义设计原则，追求"少即是多"的设计理念，通过简洁的界面和直观的交互，让用户专注于创意本身。采用单页面应用（SPA）架构，确保流畅的用户体验和简洁的界面设计。

### 单页面应用设计原则

#### SPA架构优势

- **流畅体验**: 无页面刷新，快速响应和即时反馈
- **统一风格**: 一致的视觉风格和交互模式
- **性能优化**: 减少服务器负载和网络请求
- **状态管理**: 全局状态集中管理，用户体验连续

#### 路由设计规范

- **Vue Router管理**: 使用Vue Router进行客户端路由管理
- **路由结构简洁**: 避免深层嵌套，保持路由结构清晰
- **懒加载优化**: 实现路由懒加载提升性能
- **浏览器兼容**: 支持浏览器前进后退功能

#### 状态管理规范

- **Pinia集中管理**: 全局状态通过Pinia集中管理
- **组件状态传递**: 组件间状态传递简洁高效
- **状态持久化**: 确保用户体验连续性
- **响应式绑定**: 实现实时数据更新

#### 组件化设计

- **模块化结构**: 高度模块化的组件结构
- **可复用组件**: 建立可复用的UI组件库
- **职责单一**: 组件职责单一，耦合度低
- **按需加载**: 支持组件懒加载和按需引入

### 视觉极简主义

- **留白原则**: 充分使用留白空间，避免界面拥挤
- **色彩克制**: 主要使用黑白灰配色，点缀少量品牌色
- **字体简洁**: 选择易读性强的无衬线字体
- **图标简约**: 使用线条简洁的图标，避免复杂装饰

```css
/* 极简色彩系统 */
:root {
  --color-primary: #000000; /* 主色：纯黑 */
  --color-secondary: #666666; /* 次要色：中性灰 */
  --color-accent: #0066ff; /* 强调色：品牌蓝 */
  --color-background: #ffffff; /* 背景色：纯白 */
  --color-surface: #f8f9fa; /* 表面色：浅灰 */
  --color-text: #212529; /* 文本色：深灰 */
  --color-muted: #6c757d; /* 静音色：中灰 */
}

/* 极简间距系统 */
.spacing-xs {
  margin: 0.25rem;
} /* 4px */
.spacing-sm {
  margin: 0.5rem;
} /* 8px */
.spacing-md {
  margin: 1rem;
} /* 16px */
.spacing-lg {
  margin: 1.5rem;
} /* 24px */
.spacing-xl {
  margin: 2rem;
} /* 32px */
```

### 交互极简主义

- **减少点击**: 每个功能最多3次点击到达
- **智能默认**: 提供合理的默认设置和智能建议
- **渐进披露**: 高级功能默认隐藏，按需显示
- **一键操作**: 常用功能支持一键完成

### 功能极简主义

- **核心功能优先**: 突出思维导图核心功能
- **功能分层**: 基础功能、高级功能、专家功能分层设计
- **减少选择**: 避免过多的配置选项和设置
- **智能辅助**: 通过AI减少用户手动操作

```typescript
// 极简API设计示例
interface MindMapConfig {
  // 只暴露核心配置
  theme: 'light' | 'dark';
  layout: 'radial' | 'tree';
  autoSave: boolean;

  // 高级配置通过扩展接口
  advanced?: AdvancedConfig;
}

// 智能默认值
const defaultConfig: MindMapConfig = {
  theme: 'light',
  layout: 'radial',
  autoSave: true
};
```

### 界面极简主义

- **扁平化设计**: 避免过多的阴影和立体效果
- **网格对齐**: 使用12列网格系统保持对齐
- **一致性**: 相同功能使用相同的交互模式
- **可预测性**: 用户操作结果可预期

#### SPA导航设计

- **客户端路由**: 使用Vue Router实现客户端路由导航
- **导航状态持久化**: 支持浏览器前进后退功能
- **路由切换动画**: 使用简洁流畅的过渡效果
- **面包屑导航**: 显示当前位置和导航路径
- **响应式导航**: 移动端使用汉堡菜单，桌面端使用水平导航

### 极简主义检查清单

- [ ] 界面元素是否必要？能否移除？
- [ ] 用户是否能快速理解功能？
- [ ] 是否有多余的装饰元素？
- [ ] 交互流程是否最简化？
- [ ] 是否遵循"3次点击"原则？
- [ ] 色彩使用是否克制？
- [ ] 字体和间距是否统一？

### 极简主义与AI集成

- **智能简化**: 使用AI自动简化复杂内容
- **智能推荐**: 基于用户行为推荐简化选项
- **自然交互**: AI交互使用自然语言，避免复杂表单
- **渐进式AI**: AI功能渐进式引入，不干扰核心流程

## 组件开发规范（极简主义）

### SPA组件设计原则

- **路由组件**: 使用`<router-view>`容器，保持视图切换一致性
- **懒加载组件**: 实现组件懒加载提升性能
- **状态管理**: 组件状态与全局状态协调管理
- **生命周期**: 合理使用Vue生命周期钩子
- **过渡动画**: 添加简洁的组件进入退出动画

### 思维导图组件设计原则

- **核心功能优先**：节点展示、编辑、连接是核心功能
- **层级结构清晰**：支持折叠/展开，但避免过深嵌套
- **交互简化**：拖拽、点击、键盘快捷键，避免复杂手势
- **视觉极简**：使用Canvas/SVG，避免复杂视觉效果
- **渐进式功能**：高级功能（如AI辅助）按需启用

### 工作区组件设计原则

- **仿照Cursor设计风格**：专业且简洁的界面
- **智能布局管理**：标签页和侧边栏可折叠，节省空间
- **功能渐进披露**：项目和AI面板按需显示
- **用户偏好记忆**：记住布局设置，减少重复配置
- **响应式适配**：桌面端功能完整，移动端功能精简

### 基础UI组件设计原则

- **基于墨点Logo设计风格**：统一的视觉语言
- **极简色彩系统**：黑白灰为主，品牌色点缀
- **统一字体系统**：系统字体优先，确保跨平台一致性
- **组件职责单一**：每个组件只负责一个功能
- **无障碍设计**：支持键盘导航和屏幕阅读器

## 状态管理规范（极简主义）

### SPA状态管理原则

- **路由状态管理**: 使用Vue Router管理路由状态
- **全局状态集中**: 通过Pinia管理全局应用状态
- **组件状态局部**: 组件内部状态使用ref/reactive
- **状态持久化**: 关键状态持久化到localStorage
- **状态同步**: 确保路由变化时状态正确同步

### Pinia Store设计原则

- **按功能模块划分Store**：避免单一庞大的Store
- **使用组合式API风格**：保持代码简洁和可读性
- **智能数据持久化**：只持久化必要的用户数据
- **状态同步简化**：避免复杂的状态同步逻辑
- **错误状态处理**：统一的错误处理和恢复机制

```typescript
// 示例Store
export const useMindMapStore = defineStore('mindMap', () => {
  const nodes = ref<MindMapNode[]>([]);
  const selectedNodeId = ref<string | null>(null);

  const selectedNode = computed(() => nodes.value.find(node => node.id === selectedNodeId.value));

  function addNode(node: MindMapNode) {
    nodes.value.push(node);
  }

  function updateNode(id: string, updates: Partial<MindMapNode>) {
    const index = nodes.value.findIndex(node => node.id === id);
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates };
    }
  }

  return {
    nodes: readonly(nodes),
    selectedNodeId,
    selectedNode,
    addNode,
    updateNode
  };
});
```

## 测试规范（极简主义）

### 测试工作流架构

#### 测试金字塔策略

```
    ┌─────────────────┐
    │   E2E Tests     │ ← 5% 关键用户流程
    │   (少量)        │
    ├─────────────────┤
    │ Integration     │ ← 25% 模块间交互
    │ Tests (适量)    │
    ├─────────────────┤
    │ Unit Tests      │ ← 70% 核心业务逻辑
    │ (大量)          │
    └─────────────────┘
```

#### 测试执行流程

1. **本地开发**: 编写代码 → 运行测试 → 修复问题
2. **提交前**: 完整测试套件 → 覆盖率检查 → 代码质量检查
3. **CI/CD**: 自动化测试 → 构建验证 → 部署检查
4. **发布前**: 端到端测试 → 性能测试 → 安全扫描

### 测试质量标准

#### 覆盖率要求

- **语句覆盖率**: ≥ 70%
- **分支覆盖率**: ≥ 65%
- **函数覆盖率**: ≥ 75%
- **行覆盖率**: ≥ 70%

#### 性能基准

- **首屏加载时间**: < 2秒
- **交互响应时间**: < 100ms
- **内存使用**: < 100MB
- **CPU使用率**: < 30%

### 测试命令规范

```bash
# 开发中测试
npm run test:watch          # 监听模式
npm run test:ui             # 可视化界面
npm test tests/unit/        # 单元测试
npm test tests/integration/ # 集成测试

# 提交前检查
npm run test:run            # 运行所有测试
npm run test:coverage       # 覆盖率报告
npm run lint                # 代码规范检查
npm run type-check          # 类型检查

# CI/CD测试
npm run test:performance    # 性能测试
npm run test:e2e           # 端到端测试
npm run build              # 构建测试
```

### 单元测试原则

- **使用Vitest进行单元测试**：轻量级测试框架
- **核心功能优先测试**：重要工具函数和核心逻辑必须有测试
- **测试覆盖率合理**：目标70%，但不追求100%
- **AI功能mock测试**：避免真实API调用，提高测试稳定性
- **测试代码简洁**：测试本身应该简洁易读

### 组件测试

- 使用Vue Test Utils
- 测试组件的props、events、slots
- 测试用户交互和状态变化
- 测试错误边界情况

```typescript
// 测试示例
import { mount } from '@vue/test-utils';
import MindMapNode from '@/components/mindmap/MindMapNode.vue';

describe('MindMapNode', () => {
  it('应该正确渲染节点内容', () => {
    const node = { id: '1', content: '测试节点', position: { x: 0, y: 0 } };
    const wrapper = mount(MindMapNode, { props: { node } });

    expect(wrapper.text()).toContain('测试节点');
  });

  it('应该在点击时触发编辑模式', async () => {
    const wrapper = mount(MindMapNode, { props: { node, editable: true } });

    await wrapper.trigger('click');
    expect(wrapper.emitted('startEdit')).toBeTruthy();
  });
});
```

### 测试数据管理

- **使用TestDataGenerator**: 统一生成测试数据
- **数据隔离**: 每个测试使用独立数据
- **Mock外部依赖**: 避免真实API调用
- **性能测试数据**: 支持不同规模的数据集

```typescript
// 测试数据生成示例
import { TestDataGenerator } from '@/tests/utils/test-data-generator';

const nodes = TestDataGenerator.generateNodes(100);
const connections = TestDataGenerator.generateConnections(nodes, 50);
const perfData = TestDataGenerator.generatePerformanceTestData('large');
```

### 持续集成测试

#### GitHub Actions工作流

- **代码质量检查**: ESLint + TypeScript
- **单元测试**: Vitest + 覆盖率报告
- **集成测试**: 模块间交互验证
- **构建测试**: 生产环境构建验证
- **性能测试**: Lighthouse + 性能基准
- **安全扫描**: npm audit + CodeQL

#### 测试失败处理

- 自动阻止合并到主分支
- 生成详细错误报告
- 通知相关开发者
- 提供修复建议

### 测试最佳实践

#### 测试编写原则

- **AAA模式**: Arrange, Act, Assert
- **单一职责**: 每个测试只验证一个功能
- **独立性**: 测试之间相互独立
- **可重复**: 测试结果稳定可重复

#### 测试命名规范

```typescript
describe('功能模块名', () => {
  describe('子功能描述', () => {
    it('应该能够执行具体操作', () => {
      // 测试实现
    });
  });
});
```

#### 测试组织结构

```
tests/
├── unit/                    # 单元测试 (70%)
├── integration/            # 集成测试 (25%)
├── e2e/                    # 端到端测试 (5%)
├── performance/            # 性能测试
├── utils/                  # 测试工具
└── examples/               # 示例测试
```

## 性能优化规范（极简主义）

### SPA性能优化原则

- **路由懒加载**: 使用动态import实现路由组件懒加载
- **代码分割**: 按功能模块分割代码，减少初始加载时间
- **预加载策略**: 预加载关键路由和组件
- **缓存策略**: 合理使用浏览器缓存和内存缓存
- **状态优化**: 避免不必要的状态更新和重新渲染

### 渲染优化原则

- **虚拟滚动处理大量节点**：保持界面流畅
- **智能懒加载**：按需加载节点和组件
- **动画性能优化**：使用requestAnimationFrame，避免过度动画
- **避免不必要的重新渲染**：使用合适的响应式策略
- **渐进式加载**：重要内容优先显示

### 内存管理原则

- **及时清理资源**：事件监听器、定时器等
- **智能数据缓存**：只缓存必要的数据
- **避免内存泄漏**：特别是AI调用和长时间运行的功能
- **数据生命周期管理**：明确数据的创建和销毁时机

## 错误处理规范（极简主义）

### 错误处理原则

- **全局错误捕获**：统一的错误处理机制
- **用户友好提示**：错误信息简洁明了，避免技术术语
- **智能错误分类**：区分用户错误和系统错误
- **最小化干扰**：错误处理不干扰用户的正常操作
- **错误日志简化**：只记录必要的调试信息

```typescript
// 错误处理示例
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function handleError(error: Error) {
  if (error instanceof AppError) {
    showUserMessage(error.userMessage);
  } else {
    console.error('系统错误:', error);
    showUserMessage('系统出现错误，请稍后重试');
  }
}
```

## API设计规范（极简主义）

### RESTful API原则

- **使用标准HTTP方法和状态码**：遵循REST约定
- **统一的响应格式**：简化客户端处理逻辑
- **智能请求验证**：只验证必要的参数
- **简洁的错误响应**：错误信息清晰简洁
- **按需分页和过滤**：避免返回过多数据

```typescript
// API响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
```

## 安全规范（极简主义）

### 数据安全原则

- **敏感数据加密存储**：保护用户隐私
- **API密钥安全管理**：避免硬编码和泄露
- **输入验证简化**：只验证必要的用户输入
- **防止常见攻击**：XSS、注入攻击等
- **安全配置简化**：默认安全配置，减少配置负担

### AI安全原则

- **智能调用频率限制**：避免过度使用
- **内容过滤简化**：只过滤明显的敏感内容
- **成本监控透明**：用户可见的API使用成本
- **安全默认设置**：默认启用安全功能

## 部署规范（极简主义）

### 环境配置原则

- **环境变量管理配置**：简化配置管理
- **环境区分简化**：开发、测试、生产环境配置清晰
- **配置验证简化**：只验证关键配置项
- **热更新支持**：减少重启需求
- **默认配置合理**：开箱即用的配置

### 构建优化原则

- **代码分割智能**：按需分割，避免过度分割
- **资源压缩优化**：平衡压缩率和加载速度
- **开发代码清理**：移除调试代码和注释
- **包大小控制**：避免引入不必要的依赖

## 文档规范（极简主义）

### 代码注释原则

- **必要注释**：只对复杂逻辑和关键算法添加注释
- **使用JSDoc格式**：标准化的注释格式
- **说明原因而非行为**：注释要说明为什么，不是做什么
- **保持同步**：注释与代码同步更新
- **避免冗余**：不注释显而易见的代码

### API文档原则

- **使用OpenAPI规范**：标准化的API文档格式
- **简洁的请求示例**：提供最小化的示例
- **错误码说明简化**：只说明常见的错误情况
- **文档及时更新**：保持文档与代码同步

### 项目文档管理

- 所有文档必须使用时间戳系统
- 重要变更后立即更新时间戳
- 定期审查文档状态（T30间隔）
- 废弃文档保留T180后删除
- 使用统一的文档模板和格式

### 文档工具使用规范

- 新建文档时使用：`npm run docs:header v1.0.0 T{当前时间戳}`
- 更新文档时使用：`npm run docs:update <文档路径>`
- 检查时间戳时使用：`npm run timestamp:current`
- 所有文档变更记录到 `docs/CHANGELOG.md`

## Git规范

### 提交信息

```
type(scope): description

feat: 新功能
fix: 修复bug
docs: 文档更新 (包含时间戳更新)
style: 代码格式
refactor: 重构
test: 测试
chore: 构建工具
timestamp: 时间戳系统更新

示例:
feat(mindmap): 添加节点拖拽功能
fix(ai): 修复DeepSeek API调用错误
docs(readme): 更新安装说明 T275.1
timestamp(docs): 更新文档时间戳系统 T275.1
```

### 分支管理

- main: 主分支，稳定版本
- develop: 开发分支
- feature/\*: 功能分支
- docs/\*: 文档更新分支
- timestamp/\*: 时间戳系统相关分支

### 文档提交规范

- 文档更新必须包含时间戳更新
- 提交信息中包含时间戳信息
- 重大文档变更需要更新版本号
- 同时更新CHANGELOG.md记录

## 开发工具配置

### VSCode/Cursor设置

- 启用TypeScript严格检查
- 安装推荐扩展：Vue Language Features, TypeScript Importer
- 配置时间戳工具快捷命令

### 时间戳工具集成

- 配置npm脚本快捷键
- 设置文档模板包含时间戳头部
- 启用自动时间戳更新提醒
- 配置ESLint
- 使用Vue官方插件
- 配置调试环境

### 推荐插件

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Auto Rename Tag
- GitLens

## 极简主义开发注意事项

1. **渐进式开发**: 先实现核心功能，再添加高级特性
2. **用户体验优先**: 界面简洁直观，操作流程简化
3. **性能与简洁平衡**: 在性能和代码简洁性之间找到平衡
4. **AI成本透明**: 监控AI API使用成本，用户可见
5. **数据管理简化**: 重要数据备份，避免过度复杂的数据结构
6. **兼容性简化**: 支持主流浏览器，避免过度兼容
7. **可访问性内置**: 默认支持键盘导航和屏幕阅读器
8. **功能按需启用**: 高级功能默认隐藏，按需显示
9. **配置最小化**: 减少用户配置负担，智能默认设置
10. **文档简洁**: 只记录必要信息，避免冗余文档

## 极简主义开发流程

1. **需求分析简化**: 明确核心功能需求，避免过度设计
2. **设计评审**: 确认UI/UX设计遵循极简主义原则
3. **渐进式编码**: 先实现核心功能，再添加高级特性
4. **简洁测试**: 重点测试核心功能，避免过度测试
5. **集成验证**: 确保功能正常集成，保持系统简洁
6. **部署发布**: 按照简化的部署流程发布版本

**极简主义开发原则**：

- 代码简洁性比功能完整性更重要
- 用户体验比技术实现更重要
- 核心功能比边缘功能更重要
- 可维护性比开发速度更重要

记住：**简单就是美，简洁就是力量**。始终保持代码的简洁性和可读性。

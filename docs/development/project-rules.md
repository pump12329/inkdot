# InkDot 项目开发规则

> **文档版本**：v1.2.0  
> **创建时间戳**：T1  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

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

### Vue 3规范
- 使用Composition API，避免Options API
- 使用`<script setup>`语法
- 组件名使用PascalCase
- Props使用defineProps，Emits使用defineEmits
- 使用ref/reactive进行响应式数据管理

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MindMapNode } from '@/types'

interface Props {
  node: MindMapNode
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [node: MindMapNode]
  delete: [nodeId: string]
}>()

const isEditing = ref(false)
const nodeContent = ref(props.node.content)
</script>
```

### 文件命名规范
- 组件文件使用PascalCase: `MindMapNode.vue`
- 工具函数文件使用camelCase: `nodeUtils.ts`
- 类型定义文件使用camelCase: `mindMapTypes.ts`
- 常量文件使用UPPER_CASE: `API_CONSTANTS.ts`

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

## AI功能开发规范

### AI服务集成
- 优先使用DeepSeek API，OpenRouter作为备选
- 所有AI调用必须有错误处理和重试机制
- 实现API调用成本监控
- 支持模型切换和配置

```typescript
// AI服务抽象
interface AIService {
  name: 'deepseek' | 'openrouter';
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  analyzeContent(content: string): Promise<ContentAnalysis>;
}

// 错误处理示例
async function callAI(service: AIService, prompt: string): Promise<string> {
  try {
    return await service.generateText(prompt);
  } catch (error) {
    console.error('AI调用失败:', error);
    // 重试逻辑
    return await retryAICall(service, prompt);
  }
}
```

### 节点级AI功能
- 每个节点都支持AI操作
- AI功能通过指令系统调用: `@ai`, `@expand`, `@analyze`
- 支持上下文感知的AI建议
- 实现AI操作历史记录

## 极简主义设计原则

### 设计哲学
InkDot遵循极简主义设计原则，追求"少即是多"的设计理念，通过简洁的界面和直观的交互，让用户专注于创意本身。

### 视觉极简主义
- **留白原则**: 充分使用留白空间，避免界面拥挤
- **色彩克制**: 主要使用黑白灰配色，点缀少量品牌色
- **字体简洁**: 选择易读性强的无衬线字体
- **图标简约**: 使用线条简洁的图标，避免复杂装饰

```css
/* 极简色彩系统 */
:root {
  --color-primary: #000000;      /* 主色：纯黑 */
  --color-secondary: #666666;    /* 次要色：中性灰 */
  --color-accent: #0066FF;       /* 强调色：品牌蓝 */
  --color-background: #ffffff;   /* 背景色：纯白 */
  --color-surface: #f8f9fa;      /* 表面色：浅灰 */
  --color-text: #212529;         /* 文本色：深灰 */
  --color-muted: #6c757d;        /* 静音色：中灰 */
}

/* 极简间距系统 */
.spacing-xs { margin: 0.25rem; }   /* 4px */
.spacing-sm { margin: 0.5rem; }    /* 8px */
.spacing-md { margin: 1rem; }      /* 16px */
.spacing-lg { margin: 1.5rem; }    /* 24px */
.spacing-xl { margin: 2rem; }      /* 32px */
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

## 组件开发规范

### 思维导图组件
- 使用Canvas/SVG进行渲染
- 支持节点拖拽、连接、编辑
- 实现悬浮工具栏和右键菜单
- 支持键盘快捷键操作
- 遵循极简主义设计原则

### 工作区组件
- 仿照Cursor设计风格
- 支持多标签页和侧边栏
- 实现项目管理和AI面板
- 支持布局自定义和保存
- 界面保持极简，功能渐进披露

### 基础UI组件
- 基于墨点Logo设计风格
- 使用一致的颜色和字体
- 支持明暗主题切换
- 响应式设计，支持移动端
- 严格遵循极简主义视觉规范

## 状态管理规范

### Pinia Store设计
- 按功能模块划分Store
- 使用组合式API风格
- 实现数据持久化
- 支持状态同步和恢复

```typescript
// 示例Store
export const useMindMapStore = defineStore('mindMap', () => {
  const nodes = ref<MindMapNode[]>([])
  const selectedNodeId = ref<string | null>(null)
  
  const selectedNode = computed(() => 
    nodes.value.find(node => node.id === selectedNodeId.value)
  )
  
  function addNode(node: MindMapNode) {
    nodes.value.push(node)
  }
  
  function updateNode(id: string, updates: Partial<MindMapNode>) {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }
  
  return {
    nodes: readonly(nodes),
    selectedNodeId,
    selectedNode,
    addNode,
    updateNode
  }
})
```

## 测试规范

### 单元测试
- 使用Vitest进行单元测试
- 测试覆盖率要求 > 80%
- 重要工具函数必须有测试
- AI功能需要mock测试

### 组件测试
- 使用Vue Test Utils
- 测试组件的props、events、slots
- 测试用户交互和状态变化
- 测试错误边界情况

```typescript
// 测试示例
import { mount } from '@vue/test-utils'
import MindMapNode from '@/components/mindmap/MindMapNode.vue'

describe('MindMapNode', () => {
  it('应该正确渲染节点内容', () => {
    const node = { id: '1', content: '测试节点', position: { x: 0, y: 0 } }
    const wrapper = mount(MindMapNode, { props: { node } })
    
    expect(wrapper.text()).toContain('测试节点')
  })
  
  it('应该在点击时触发编辑模式', async () => {
    const wrapper = mount(MindMapNode, { props: { node, editable: true } })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('startEdit')).toBeTruthy()
  })
})
```

## 性能优化规范

### 渲染优化
- 使用虚拟滚动处理大量节点
- 实现节点懒加载和卸载
- 使用requestAnimationFrame优化动画
- 避免不必要的重新渲染

### 内存管理
- 及时清理事件监听器
- 使用WeakMap存储临时数据
- 避免内存泄漏，特别是AI调用
- 实现数据缓存和清理机制

## 错误处理规范

### 全局错误处理
- 实现全局错误捕获
- 区分用户错误和系统错误
- 提供友好的错误提示
- 记录错误日志用于调试

```typescript
// 错误处理示例
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

function handleError(error: Error) {
  if (error instanceof AppError) {
    showUserMessage(error.userMessage)
  } else {
    console.error('系统错误:', error)
    showUserMessage('系统出现错误，请稍后重试')
  }
}
```

## API设计规范

### RESTful API
- 使用标准HTTP方法和状态码
- 统一的响应格式
- 实现请求验证和错误处理
- 支持分页和过滤

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

## 安全规范

### 数据安全
- 敏感数据加密存储
- API密钥安全管理
- 用户输入验证和清理
- 防止XSS和注入攻击

### AI安全
- 限制AI调用频率
- 过滤敏感内容
- 监控API使用量
- 实现成本控制

## 部署规范

### 环境配置
- 使用环境变量管理配置
- 区分开发、测试、生产环境
- 实现配置验证
- 支持热更新配置

### 构建优化
- 代码分割和懒加载
- 资源压缩和缓存
- 移除开发代码
- 优化包大小

## 文档规范

### 代码注释
- 复杂逻辑必须有注释
- 使用JSDoc格式
- 注释要说明为什么，不是做什么
- 保持注释与代码同步

### API文档
- 使用OpenAPI规范
- 提供请求示例
- 说明错误码含义
- 保持文档更新

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
- feature/*: 功能分支
- docs/*: 文档更新分支
- timestamp/*: 时间戳系统相关分支

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
- 配置ESLint和Prettier
- 使用Vue官方插件
- 配置调试环境

### 推荐插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Auto Rename Tag
- GitLens

## 注意事项

1. **渐进式开发**: 先实现核心功能，再添加高级特性
2. **用户体验**: 优先考虑用户体验，保持界面简洁直观
3. **性能监控**: 持续监控性能指标，及时优化
4. **AI成本控制**: 监控AI API使用成本，避免超支
5. **数据备份**: 重要数据要有备份机制
6. **兼容性**: 考虑不同浏览器和设备的兼容性
7. **可访问性**: 支持键盘导航和屏幕阅读器
8. **国际化**: 预留多语言支持的空间

## 开发流程

1. **需求分析**: 明确功能需求和技术方案
2. **设计评审**: 确认UI/UX设计和技术架构
3. **编码实现**: 按照规范进行开发
4. **自测验证**: 完成功能测试和代码review
5. **集成测试**: 确保功能正常集成
6. **部署发布**: 按照部署流程发布版本

记住：代码质量比速度更重要，始终保持代码的可读性和可维护性。

# 规则使用条件建议

## 📋 规则分类优化建议

### 🔴 保持 `always_applied` 的核心规则 (最小必需集)

- **`project-info.mdc`** - 项目基本信息和技术栈
- **`frontend-development.mdc`** - Vue 3 + TypeScript 开发规范
- **`code-quality-standards.mdc`** - ESLint 和代码质量标准

### 🟡 移动到 `agent_requestable` 的规则及使用条件

#### 设计与UI类规则 (UI/设计相关请求时使用)

```yaml
design-system:
  - ui-design-system.mdc # UI设计、布局、色彩系统
  - css-style-system.mdc # CSS架构、样式系统
  - interaction-patterns.mdc # 交互设计、用户体验

design-implementation:
  - design-implementation-guide.mdc # 设计实施指南
```

**使用条件**: 用户询问UI设计、样式系统、交互模式、用户体验等相关问题

#### 架构与组件类规则 (架构设计时使用)

```yaml
architecture:
  - architecture.mdc # 系统架构设计
  - component-architecture.mdc # 组件架构规范
```

**使用条件**: 用户询问系统架构、组件设计、技术选型等相关问题

#### AI功能类规则 (AI功能开发时使用)

```yaml
ai-features:
  - ai-integration.mdc # AI集成规范
```

**使用条件**: 用户询问AI功能、API集成、智能助手等相关问题

#### 开发流程类规则 (流程和工具操作时使用)

```yaml
development-process:
  - development-workflow.mdc # Git工作流、提交规范
  - testing-standards.mdc # 测试规范和策略
  - project-tools.mdc # 项目工具使用

mvp-strategy:
  - mvp-development.mdc # MVP开发策略
```

**使用条件**:

- 用户询问开发流程、Git操作、测试策略时
- 用户询问项目工具使用时
- 用户询问MVP开发策略时

#### 文档管理类规则 (文档操作时使用)

```yaml
documentation:
  - timestamp-system.mdc # 时间戳管理
  - documentation-structure.mdc # 文档结构
```

**使用条件**: 用户进行文档更新、时间戳管理等操作时

#### 项目阶段类规则 (特定阶段使用)

```yaml
project-phases:
  - initial-development.mdc # 项目初始开发
```

**使用条件**: 项目初始化阶段或设置新开发环境时

## 🎯 智能规则推荐系统

### 根据用户请求关键词自动推荐规则

#### 关键词映射表

| 用户请求关键词             | 推荐规则                             | 优先级 |
| -------------------------- | ------------------------------------ | ------ |
| UI, 设计, 样式, 界面, 布局 | ui-design-system, css-style-system   | 高     |
| 组件, 架构, 结构           | component-architecture, architecture | 高     |
| 交互, 用户体验, 操作       | interaction-patterns                 | 中     |
| AI, 智能, API              | ai-integration                       | 高     |
| 测试, test                 | testing-standards                    | 中     |
| Git, 提交, 工作流          | development-workflow                 | 中     |
| 工具, 命令, npm            | project-tools                        | 中     |
| 文档, 时间戳, 更新         | documentation, timestamp-system      | 低     |
| MVP, 策略, 规划            | mvp-development                      | 低     |
| 初始化, 设置, 环境         | initial-development                  | 低     |

### 智能组合规则

#### 常见场景的规则组合

1. **新功能开发**

   ```yaml
   rules: [component-architecture, ui-design-system, testing-standards]
   ```

2. **UI界面优化**

   ```yaml
   rules: [ui-design-system, css-style-system, interaction-patterns]
   ```

3. **系统架构重构**

   ```yaml
   rules: [architecture, component-architecture]
   ```

4. **AI功能集成**

   ```yaml
   rules: [ai-integration, testing-standards]
   ```

5. **项目初始化**
   ```yaml
   rules: [initial-development, project-tools]
   ```

## 🔧 实施建议

### 1. 修改 `.cursor/rules` 配置

将大部分规则从 `always_applied_workspace_rules` 移动到 `agent_requestable_workspace_rules`，保留最核心的3个规则。

### 2. 在AI对话中智能推荐

当用户询问特定问题时，AI助手应该：

1. 分析用户请求的关键词
2. 推荐相关的规则
3. 使用 `fetch_rules` 工具获取必要的规则
4. 基于规则内容提供准确回答

### 3. 优化context使用

- **减少90%的context占用** - 从13个always_applied规则减少到3个
- **按需加载** - 只在需要时获取特定规则
- **智能缓存** - 在单次对话中缓存已获取的规则

## 📊 预期效果

### Context占用对比

- **优化前**: ~50,000 tokens (13个大型规则文件)
- **优化后**: ~8,000 tokens (3个核心规则文件)
- **节省率**: 约84%的context空间

### 响应性能提升

- **更快的响应速度** - 减少初始context处理时间
- **更精准的回答** - 基于相关规则提供针对性建议
- **更好的用户体验** - 避免信息过载

---

**创建时间**: T275.4
**状态**: 🟡 PROPOSAL
**维护者**: InkDot开发团队

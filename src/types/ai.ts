// AI相关类型定义

/**
 * AI Agent统一接口
 */
export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  execute(input: AgentInput): Promise<AgentOutput>
}

/**
 * 统一输入格式
 */
export interface AgentInput {
  type: 'text' | 'mindmap' | 'file'
  content: any
  context?: Record<string, any>
  mode: 'novel' | 'rpg' | 'adventure' | 'general'
}

/**
 * 统一输出格式
 */
export interface AgentOutput {
  success: boolean
  result: any
  suggestions?: string[]
  metadata?: Record<string, any>
}

/**
 * AI生成选项
 */
export interface AIGenerateOptions {
  model: string
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
}

/**
 * AI分析结果
 */
export interface AIAnalysis {
  sentiment?: 'positive' | 'negative' | 'neutral'
  complexity: 'simple' | 'medium' | 'complex'
  keywords: string[]
  suggestions: string[]
  relatedTopics: string[]
  quality: number // 0-100
  confidence: number // 0-1
}

/**
 * AI模型信息
 */
export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  maxTokens: number
  costPerToken: number
  isAvailable: boolean
}

/**
 * AI服务配置
 */
export interface AIServiceConfig {
  provider: 'deepseek' | 'openrouter' | 'openai' | 'custom'
  apiKey: string
  baseURL?: string
  defaultModel: string
  timeout: number
  retries: number
}

/**
 * 小说创作Agent输入
 */
export interface NovelAgentInput extends AgentInput {
  type: 'text' | 'mindmap'
  content: {
    prompt: string
    context?: {
      genre?: string
      characters?: string[]
      setting?: string
      tone?: string
    }
  }
  mode: 'novel'
}

/**
 * 小说创作Agent输出
 */
export interface NovelAgentOutput extends AgentOutput {
  result: {
    content: string
    suggestions: string[]
    characters?: string[]
    plotPoints?: string[]
    themes?: string[]
  }
}

/**
 * 跑团Agent输入
 */
export interface RPGAgentInput extends AgentInput {
  type: 'text' | 'mindmap'
  content: {
    prompt: string
    context?: {
      system?: string
      level?: number
      party?: string[]
      setting?: string
    }
  }
  mode: 'rpg'
}

/**
 * 跑团Agent输出
 */
export interface RPGAgentOutput extends AgentOutput {
  result: {
    content: string
    encounters?: string[]
    npcs?: string[]
    items?: string[]
    rules?: string[]
  }
}

/**
 * 文字冒险Agent输入
 */
export interface AdventureAgentInput extends AgentInput {
  type: 'text' | 'mindmap'
  content: {
    prompt: string
    context?: {
      currentScene?: string
      inventory?: string[]
      choices?: string[]
    }
  }
  mode: 'adventure'
}

/**
 * 文字冒险Agent输出
 */
export interface AdventureAgentOutput extends AgentOutput {
  result: {
    content: string
    scenes?: string[]
    choices?: string[]
    consequences?: string[]
  }
}

/**
 * AI任务
 */
export interface AITask {
  id: string
  agentId: string
  input: AgentInput
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: AgentOutput
  error?: string
  createdAt: Date
  completedAt?: Date
}

/**
 * AI会话
 */
export interface AISession {
  id: string
  agentId: string
  messages: AIMessage[]
  context: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * AI消息
 */
export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

/**
 * AI提示词模板
 */
export interface AIPromptTemplate {
  id: string
  name: string
  description: string
  template: string
  variables: string[]
  category: string
  tags: string[]
}

/**
 * AI配置
 */
export interface AIConfig {
  services: AIServiceConfig[]
  defaultService: string
  agents: AgentConfig[]
  prompts: AIPromptTemplate[]
  settings: {
    autoSave: boolean
    maxHistory: number
    enableLogging: boolean
  }
}

/**
 * Agent配置
 */
export interface AgentConfig {
  id: string
  name: string
  description: string
  service: string
  model: string
  capabilities: string[]
  prompts: string[]
  settings: Record<string, any>
  enabled: boolean
}

/**
 * AI成本统计
 */
export interface AICostStats {
  totalTokens: number
  totalCost: number
  byService: Record<string, {
    tokens: number
    cost: number
  }>
  byAgent: Record<string, {
    tokens: number
    cost: number
  }>
  lastUpdated: Date
}

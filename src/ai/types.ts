import type { MindMapNode, AnalysisResult, Suggestion, AgentConfig } from '@/types'

// AI服务提供商类型
export type AIProvider = 'deepseek' | 'openrouter' | 'openai' | 'anthropic'

// AI模型类型
export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  maxTokens: number
  costPerToken: number
  capabilities: string[]
}

// AI请求类型
export interface AIRequest {
  prompt: string
  context?: any
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  stream?: boolean
}

// AI响应类型
export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model?: string
  finishReason?: string
}

// AI流式响应
export interface AIStreamResponse {
  chunk: string
  isComplete: boolean
  usage?: AIResponse['usage']
}

// AI服务接口
export interface AIService {
  generateContent(request: AIRequest): Promise<AIResponse>
  generateStream?(request: AIRequest): AsyncIterable<AIStreamResponse>
  analyzeStructure(data: any): Promise<AnalysisResult>
  suggestImprovements(content: string): Promise<Suggestion[]>
  getModels(): Promise<AIModel[]>
  validateConfig(): boolean
}

// AI Agent接口
export interface AIAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  config: AgentConfig
  service: AIService
  
  // 核心方法
  process(input: string, context?: any): Promise<string>
  analyze(nodes: MindMapNode[]): Promise<AnalysisResult>
  suggest(nodes: MindMapNode[]): Promise<Suggestion[]>
  
  // 配置管理
  updateConfig(config: Partial<AgentConfig>): void
  getConfig(): AgentConfig
  
  // 状态管理
  isReady(): boolean
  getStatus(): AgentStatus
}

// Agent状态
export interface AgentStatus {
  isReady: boolean
  isProcessing: boolean
  lastActivity?: Date
  errorCount: number
  successCount: number
  averageResponseTime: number
}

// 创作助手类型
export interface CreativeAssistant extends AIAgent {
  // 创意生成
  generateIdeas(topic: string, count?: number): Promise<string[]>
  expandIdea(idea: string, direction?: string): Promise<string>
  
  // 内容优化
  improveContent(content: string, focus?: string): Promise<string>
  checkGrammar(content: string): Promise<{ errors: GrammarError[]; suggestions: string[] }>
  
  // 结构建议
  suggestStructure(content: string): Promise<StructureSuggestion>
  reorganizeContent(content: string): Promise<string>
  
  // 风格转换
  changeStyle(content: string, targetStyle: string): Promise<string>
  analyzeStyle(content: string): Promise<StyleAnalysis>
}

// 语法错误
export interface GrammarError {
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  position: { start: number; end: number }
  suggestion: string
}

// 结构建议
export interface StructureSuggestion {
  currentStructure: string
  suggestedStructure: string
  improvements: string[]
  confidence: number
}

// 风格分析
export interface StyleAnalysis {
  tone: 'formal' | 'casual' | 'academic' | 'creative' | 'technical'
  complexity: 'simple' | 'moderate' | 'complex'
  characteristics: string[]
  suggestions: string[]
}

// AI插件接口
export interface AIPlugin {
  id: string
  name: string
  version: string
  description: string
  
  // 插件方法
  initialize(config: any): Promise<void>
  execute(input: any): Promise<any>
  cleanup(): Promise<void>
  
  // 插件配置
  getConfigSchema(): any
  validateConfig(config: any): boolean
}

// AI工作流
export interface AIWorkflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  triggers: WorkflowTrigger[]
  enabled: boolean
}

export interface WorkflowStep {
  id: string
  type: 'ai' | 'transform' | 'condition' | 'action'
  config: any
  nextSteps?: string[]
}

export interface WorkflowTrigger {
  type: 'manual' | 'automatic' | 'scheduled'
  condition?: string
  schedule?: string
}

// AI错误类型
export interface AIError {
  code: string
  message: string
  details?: any
  timestamp: Date
  provider?: AIProvider
}

// AI配置验证
export interface AIConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// AI使用统计
export interface AIUsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalTokens: number
  totalCost: number
  averageResponseTime: number
  lastRequest?: Date
}

// AI缓存
export interface AICache {
  get(key: string): Promise<any>
  set(key: string, value: any, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
}

// 基础类型定义
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// 思维导图相关类型
export interface MindMapNode extends BaseEntity {
  content: string
  position: Position
  children: string[]
  parent?: string
  metadata: NodeMetadata
  style?: NodeStyle
}

export interface Position {
  x: number
  y: number
}

export interface NodeMetadata {
  tags?: string[]
  priority?: number
  notes?: string
  [key: string]: any
}

export interface NodeStyle {
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontWeight?: string
  shape?: 'rectangle' | 'circle' | 'diamond' | 'ellipse'
}

export interface MindMapConnection {
  id: string
  from: string
  to: string
  type: 'parent-child' | 'related' | 'dependency'
  style?: ConnectionStyle
}

export interface ConnectionStyle {
  color?: string
  width?: number
  dashArray?: string
  arrowType?: 'none' | 'arrow' | 'diamond'
}

export interface MindMap {
  id: string
  title: string
  description?: string
  nodes: Record<string, MindMapNode>
  connections: MindMapConnection[]
  settings: MindMapSettings
  createdAt: Date
  updatedAt: Date
}

export interface MindMapSettings {
  theme: 'light' | 'dark' | 'auto'
  layout: 'free' | 'hierarchical' | 'radial'
  zoom: number
  center: Position
  showGrid: boolean
  snapToGrid: boolean
}

// AI相关类型
export interface AIService {
  generateContent(prompt: string, context: any): Promise<string>
  analyzeStructure(data: any): Promise<AnalysisResult>
  suggestImprovements(content: string): Promise<Suggestion[]>
}

export interface AnalysisResult {
  score: number
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface Suggestion {
  type: 'content' | 'structure' | 'style'
  message: string
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
}

export interface AIAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  config: AgentConfig
}

export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  parameters: Record<string, any>
}

// 用户和权限类型
export interface User extends BaseEntity {
  username: string
  email: string
  preferences: UserPreferences
  permissions: Permission[]
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  autoSave: boolean
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sound: boolean
}

export interface Permission {
  resource: string
  actions: string[]
}

// 项目相关类型
export interface Project extends BaseEntity {
  name: string
  description?: string
  mindMaps: string[]
  settings: ProjectSettings
  collaborators: string[]
}

export interface ProjectSettings {
  autoSave: boolean
  versionControl: boolean
  sharing: SharingSettings
}

export interface SharingSettings {
  public: boolean
  allowEdit: boolean
  allowComment: boolean
  expiresAt?: Date
}

// 插件系统类型
export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  enabled: boolean
  config: PluginConfig
  hooks: PluginHooks
}

export interface PluginConfig {
  settings: Record<string, any>
  permissions: string[]
}

export interface PluginHooks {
  onNodeCreate?: (node: MindMapNode) => void
  onNodeUpdate?: (node: MindMapNode) => void
  onNodeDelete?: (nodeId: string) => void
  onMapSave?: (map: MindMap) => void
}

// 事件系统类型
export interface Event {
  type: string
  payload: any
  timestamp: Date
  source: string
}

export interface EventHandler {
  (event: Event): void | Promise<void>
}

// 工具类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// 配置类型
export interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  storage: {
    type: 'local' | 'indexeddb' | 'websql'
    maxSize: number
  }
  features: {
    ai: boolean
    collaboration: boolean
    plugins: boolean
    export: boolean
  }
}
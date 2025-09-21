// 思维导图相关类型定义

/**
 * 思维导图节点
 */
export interface MindMapNode {
  id: string
  content: string
  position: { x: number; y: number }
  connections: string[]
  metadata: Record<string, any>

  // 节点基础类型（通用）
  type: 'text' | 'image' | 'link' | 'note' | 'custom'

  // 节点标签（用于分类和搜索）
  tags: string[]

  // 节点样式
  style?: {
    color?: string
    shape?: 'circle' | 'rectangle' | 'diamond' | 'custom'
    size?: 'small' | 'medium' | 'large'
  }

  // 节点编辑状态
  editing?: {
    isEditing: boolean // 是否正在编辑
    editMode: 'text' | 'command' | 'ai' // 编辑模式
    commandHistory: string[] // 指令历史
    lastCommand?: string // 最后执行的指令
  }

  // 节点级AI功能
  ai?: {
    suggestions: string[] // AI建议
    generatedContent: string[] // AI生成的内容
    analysis: NodeAnalysis // 节点分析结果
    lastAIAction: string // 最后一次AI操作
    aiEnabled: boolean // 是否启用AI功能
    aiModel: string // 当前使用的AI模型
    prompt: string // 当前AI提示词
  }

  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * 节点分析结果
 */
export interface NodeAnalysis {
  sentiment?: 'positive' | 'negative' | 'neutral'
  complexity: 'simple' | 'medium' | 'complex'
  keywords: string[]
  suggestions: string[]
  relatedTopics: string[]
  quality: number // 0-100
}

/**
 * 思维导图连接
 */
export interface Connection {
  id: string
  fromNodeId: string
  toNodeId: string
  type?: 'solid' | 'dashed' | 'dotted'
  color?: string
  weight?: number
  metadata?: Record<string, any>
  createdAt: Date
}

/**
 * 思维导图项目
 */
export interface MindMapProject {
  id: string
  name: string
  description: string

  // 创作模式类型
  mode: 'novel' | 'rpg' | 'adventure' | 'general'

  // 项目配置
  config: {
    nodeTypes: string[] // 可用的节点类型
    aiEnabled: boolean
    plugins: string[]
  }

  // 思维导图数据
  nodes: MindMapNode[]
  connections: Connection[]

  // 创作模式特定配置
  modeConfig?: {
    novel?: NovelConfig
    rpg?: RPGConfig
    adventure?: AdventureConfig
  }

  // 项目元数据
  metadata: {
    author: string
    version: string
    tags: string[]
    thumbnail?: string
  }

  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * 小说创作配置
 */
export interface NovelConfig {
  genre: string[]
  characters: Character[]
  settings: Setting[]
  plotPoints: PlotPoint[]
  themes: string[]
}

/**
 * 角色信息
 */
export interface Character {
  id: string
  name: string
  description: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  traits: string[]
  relationships: CharacterRelationship[]
}

/**
 * 角色关系
 */
export interface CharacterRelationship {
  characterId: string
  relationship: string
  description: string
}

/**
 * 设定信息
 */
export interface Setting {
  id: string
  name: string
  type: 'location' | 'time' | 'culture' | 'technology'
  description: string
  details: Record<string, any>
}

/**
 * 情节点
 */
export interface PlotPoint {
  id: string
  title: string
  description: string
  type: 'exposition' | 'rising_action' | 'climax' | 'falling_action' | 'resolution'
  order: number
  characters: string[]
  settings: string[]
}

/**
 * 跑团配置
 */
export interface RPGConfig {
  system: string
  campaign: Campaign
  characters: RPGCharacter[]
  encounters: Encounter[]
  items: Item[]
}

/**
 * 战役信息
 */
export interface Campaign {
  id: string
  name: string
  description: string
  setting: string
  level: number
  sessions: Session[]
}

/**
 * 跑团角色
 */
export interface RPGCharacter {
  id: string
  name: string
  class: string
  level: number
  stats: Record<string, number>
  equipment: string[]
  spells: string[]
  background: string
}

/**
 * 遭遇战
 */
export interface Encounter {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  enemies: Enemy[]
  rewards: Reward[]
}

/**
 * 敌人
 */
export interface Enemy {
  id: string
  name: string
  stats: Record<string, number>
  abilities: string[]
  loot: string[]
}

/**
 * 奖励
 */
export interface Reward {
  type: 'experience' | 'gold' | 'item' | 'lore'
  value: string | number
  description: string
}

/**
 * 物品
 */
export interface Item {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  description: string
  stats?: Record<string, number>
}

/**
 * 会话
 */
export interface Session {
  id: string
  date: Date
  title: string
  summary: string
  participants: string[]
  events: string[]
}

/**
 * 文字冒险配置
 */
export interface AdventureConfig {
  title: string
  description: string
  scenes: Scene[]
  choices: Choice[]
  endings: Ending[]
  inventory: string[]
}

/**
 * 场景
 */
export interface Scene {
  id: string
  title: string
  description: string
  image?: string
  choices: string[]
  conditions?: Record<string, any>
}

/**
 * 选择
 */
export interface Choice {
  id: string
  text: string
  nextScene: string
  requirements?: Record<string, any>
  consequences?: Record<string, any>
}

/**
 * 结局
 */
export interface Ending {
  id: string
  title: string
  description: string
  type: 'good' | 'bad' | 'neutral'
  conditions: Record<string, any>
}

/**
 * 项目模式
 */
export type ProjectMode = 'novel' | 'rpg' | 'adventure' | 'general'

/**
 * 模式特定配置
 */
export type ModeSpecificConfig = NovelConfig | RPGConfig | AdventureConfig | Record<string, any>

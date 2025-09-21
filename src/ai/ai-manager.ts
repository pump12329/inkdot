import type { AgentConfig } from '@/types'
import { generateId } from '@/utils'
import { CreativeAssistantImpl } from './agents/creative-assistant'
import { DeepSeekService } from './services/deepseek-service'
import { OpenRouterService } from './services/openrouter-service'
import type { AIAgent, AIProvider, AIService, CreativeAssistant } from './types'

/**
 * AI管理器
 */
export class AIManager {
    private services: Map<AIProvider, AIService> = new Map()
    private agents: Map<string, AIAgent> = new Map()
    private defaultProvider: AIProvider = 'deepseek'

    constructor() {
        this.initializeServices()
        this.initializeAgents()
    }

    /**
     * 初始化AI服务
     */
    private initializeServices(): void {
        // 初始化DeepSeek服务
        try {
            const deepseekService = new DeepSeekService()
            if (deepseekService.validateConfig()) {
                this.services.set('deepseek', deepseekService)
            }
        } catch (error) {
            console.warn('Failed to initialize DeepSeek service:', error)
        }

        // 初始化OpenRouter服务
        try {
            const openrouterService = new OpenRouterService()
            if (openrouterService.validateConfig()) {
                this.services.set('openrouter', openrouterService)
            }
        } catch (error) {
            console.warn('Failed to initialize OpenRouter service:', error)
        }
    }

    /**
     * 初始化AI代理
     */
    private initializeAgents(): void {
        const defaultService = this.getService(this.defaultProvider)
        if (!defaultService) {
            console.warn('No default AI service available')
            return
        }

        // 创建创意助手
        const creativeAssistantConfig: AgentConfig = {
            model: 'deepseek-chat',
            temperature: 0.7,
            maxTokens: 2048,
            systemPrompt: '你是一个专业的创意写作助手，擅长帮助用户生成、优化和组织创意内容。你的回答应该富有创意、结构清晰、语言流畅。',
            parameters: {}
        }

        const creativeAssistant = new CreativeAssistantImpl(creativeAssistantConfig, defaultService)
        this.agents.set('creative-assistant', creativeAssistant)
    }

    /**
     * 获取AI服务
     */
    getService(provider: AIProvider): AIService | null {
        return this.services.get(provider) || null
    }

    /**
     * 获取所有可用的服务提供商
     */
    getAvailableProviders(): AIProvider[] {
        return Array.from(this.services.keys())
    }

    /**
     * 获取AI代理
     */
    getAgent(agentId: string): AIAgent | null {
        return this.agents.get(agentId) || null
    }

    /**
     * 获取创意助手
     */
    getCreativeAssistant(): CreativeAssistant | null {
        const agent = this.agents.get('creative-assistant')
        return agent as CreativeAssistant || null
    }

    /**
     * 获取所有可用的代理
     */
    getAvailableAgents(): AIAgent[] {
        return Array.from(this.agents.values())
    }

    /**
     * 创建自定义代理
     */
    async createAgent(
        name: string,
        description: string,
        capabilities: string[],
        config: AgentConfig,
        provider: AIProvider = this.defaultProvider
    ): Promise<AIAgent | null> {
        const service = this.getService(provider)
        if (!service) {
            throw new Error(`No service available for provider: ${provider}`)
        }

        const agentId = generateId()
        const agent = new CreativeAssistantImpl(config, service)

        // 更新代理属性
        Object.assign(agent, { id: agentId, name, description, capabilities })

        this.agents.set(agentId, agent)
        return agent
    }

    /**
     * 移除代理
     */
    removeAgent(agentId: string): boolean {
        return this.agents.delete(agentId)
    }

    /**
     * 设置默认提供商
     */
    setDefaultProvider(provider: AIProvider): void {
        if (this.services.has(provider)) {
            this.defaultProvider = provider
        } else {
            throw new Error(`Provider ${provider} is not available`)
        }
    }

    /**
     * 获取默认提供商
     */
    getDefaultProvider(): AIProvider {
        return this.defaultProvider
    }

    /**
     * 检查服务健康状态
     */
    async checkServiceHealth(provider: AIProvider): Promise<boolean> {
        const service = this.getService(provider)
        if (!service) return false

        try {
            await service.generateContent({
                prompt: 'Hello',
                maxTokens: 10
            })
            return true
        } catch {
            return false
        }
    }

    /**
     * 获取所有服务健康状态
     */
    async getAllServicesHealth(): Promise<Record<AIProvider, boolean>> {
        const health: Record<string, boolean> = {}

        for (const provider of this.getAvailableProviders()) {
            health[provider] = await this.checkServiceHealth(provider)
        }

        return health as Record<AIProvider, boolean>
    }

    /**
     * 更新服务配置
     */
    updateServiceConfig(provider: AIProvider, apiKey: string): boolean {
        try {
            let service: AIService

            switch (provider) {
                case 'deepseek':
                    service = new DeepSeekService(apiKey)
                    break
                case 'openrouter':
                    service = new OpenRouterService(apiKey)
                    break
                default:
                    throw new Error(`Unsupported provider: ${provider}`)
            }

            if (service.validateConfig()) {
                this.services.set(provider, service)
                return true
            }
            return false
        } catch (error) {
            console.error(`Failed to update service config for ${provider}:`, error)
            return false
        }
    }

    /**
     * 获取使用统计
     */
    getUsageStats(): Record<string, any> {
        const stats: Record<string, any> = {}

        for (const [agentId, agent] of this.agents) {
            const status = agent.getStatus()
            stats[agentId] = {
                name: agent.name,
                successCount: status.successCount,
                errorCount: status.errorCount,
                averageResponseTime: status.averageResponseTime,
                lastActivity: status.lastActivity
            }
        }

        return stats
    }

    /**
     * 重置使用统计
     */
    resetUsageStats(): void {
        for (const agent of this.agents.values()) {
            // 这里需要实现重置统计的方法
            // 由于Agent接口没有定义重置方法，暂时跳过
        }
    }

    /**
     * 销毁管理器
     */
    destroy(): void {
        this.services.clear()
        this.agents.clear()
    }
}

// 单例实例
let aiManagerInstance: AIManager | null = null

/**
 * 获取AI管理器单例
 */
export function getAIManager(): AIManager {
    if (!aiManagerInstance) {
        aiManagerInstance = new AIManager()
    }
    return aiManagerInstance
}

/**
 * 销毁AI管理器单例
 */
export function destroyAIManager(): void {
    if (aiManagerInstance) {
        aiManagerInstance.destroy()
        aiManagerInstance = null
    }
}

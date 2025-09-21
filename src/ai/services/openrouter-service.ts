import { aiConfig } from '@/config/app.config'
import type { AIModel, AIResponse } from '../types'
import { BaseAIService } from './base-ai-service'

/**
 * OpenRouter AI服务实现
 */
export class OpenRouterService extends BaseAIService {
    constructor(apiKey?: string) {
        super({
            apiKey: apiKey || aiConfig.openrouter.apiKey,
            baseUrl: aiConfig.openrouter.baseUrl,
            defaultModel: aiConfig.openrouter.defaultModel,
            defaultTemperature: aiConfig.openrouter.defaultTemperature,
            defaultMaxTokens: aiConfig.openrouter.defaultMaxTokens
        })
    }

    /**
     * 获取可用模型
     */
    async getModels(): Promise<AIModel[]> {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`)
            }

            const data = await response.json()

            return data.data.map((model: any) => ({
                id: model.id,
                name: model.name,
                provider: 'openrouter',
                maxTokens: model.context_length || 4096,
                costPerToken: model.pricing?.prompt || 0.0001,
                capabilities: this.parseCapabilities(model)
            }))
        } catch (error) {
            // 返回默认模型列表
            return this.getDefaultModels()
        }
    }

    /**
     * 解析OpenRouter响应
     */
    protected parseResponse(response: any): AIResponse {
        if (!response.choices || !response.choices[0]) {
            throw new Error('Invalid response format from OpenRouter API')
        }

        const choice = response.choices[0]
        const content = choice.message?.content || choice.text || ''

        return {
            content,
            usage: response.usage ? {
                promptTokens: response.usage.prompt_tokens || 0,
                completionTokens: response.usage.completion_tokens || 0,
                totalTokens: response.usage.total_tokens || 0
            } : undefined,
            model: response.model,
            finishReason: choice.finish_reason
        }
    }

    /**
     * 获取额外的请求头
     */
    protected getAdditionalHeaders(): Record<string, string> {
        return {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'InkDot - Creative Mind Mapping Platform',
            'User-Agent': 'InkDot/1.0.0'
        }
    }

    /**
     * 解析模型能力
     */
    private parseCapabilities(model: any): string[] {
        const capabilities = ['chat', 'completion']

        if (model.name.toLowerCase().includes('code')) {
            capabilities.push('code')
        }

        if (model.name.toLowerCase().includes('vision') || model.name.toLowerCase().includes('gpt-4-vision')) {
            capabilities.push('vision')
        }

        return capabilities
    }

    /**
     * 获取默认模型列表
     */
    private getDefaultModels(): AIModel[] {
        return [
            {
                id: 'anthropic/claude-3-haiku',
                name: 'Claude 3 Haiku',
                provider: 'openrouter',
                maxTokens: 200000,
                costPerToken: 0.00025,
                capabilities: ['chat', 'completion', 'analysis']
            },
            {
                id: 'anthropic/claude-3-sonnet',
                name: 'Claude 3 Sonnet',
                provider: 'openrouter',
                maxTokens: 200000,
                costPerToken: 0.003,
                capabilities: ['chat', 'completion', 'analysis']
            },
            {
                id: 'openai/gpt-4o-mini',
                name: 'GPT-4o Mini',
                provider: 'openrouter',
                maxTokens: 128000,
                costPerToken: 0.00015,
                capabilities: ['chat', 'completion', 'vision']
            },
            {
                id: 'openai/gpt-4o',
                name: 'GPT-4o',
                provider: 'openrouter',
                maxTokens: 128000,
                costPerToken: 0.005,
                capabilities: ['chat', 'completion', 'vision']
            },
            {
                id: 'meta-llama/llama-3.1-8b-instruct',
                name: 'Llama 3.1 8B Instruct',
                provider: 'openrouter',
                maxTokens: 131072,
                costPerToken: 0.0002,
                capabilities: ['chat', 'completion']
            }
        ]
    }

    /**
     * 验证配置
     */
    validateConfig(): boolean {
        return super.validateConfig() && this.apiKey.startsWith('sk-or-')
    }
}

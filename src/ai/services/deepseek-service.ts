import { BaseAIService } from './base-ai-service'
import type { AIResponse, AIModel } from '../types'
import { aiConfig } from '@/config/app.config'

/**
 * DeepSeek AI服务实现
 */
export class DeepSeekService extends BaseAIService {
  constructor(apiKey?: string) {
    super({
      apiKey: apiKey || aiConfig.deepseek.apiKey,
      baseUrl: aiConfig.deepseek.baseUrl,
      defaultModel: aiConfig.deepseek.model,
      defaultTemperature: aiConfig.deepseek.defaultTemperature,
      defaultMaxTokens: aiConfig.deepseek.defaultMaxTokens
    })
  }

  /**
   * 获取可用模型
   */
  async getModels(): Promise<AIModel[]> {
    return [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        maxTokens: 8192,
        costPerToken: 0.0001,
        capabilities: ['chat', 'completion', 'analysis']
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: 'deepseek',
        maxTokens: 8192,
        costPerToken: 0.0001,
        capabilities: ['chat', 'completion', 'code', 'analysis']
      }
    ]
  }

  /**
   * 解析DeepSeek响应
   */
  protected parseResponse(response: any): AIResponse {
    if (!response.choices || !response.choices[0]) {
      throw new Error('Invalid response format from DeepSeek API')
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
      'User-Agent': 'InkDot/1.0.0'
    }
  }

  /**
   * 验证配置
   */
  validateConfig(): boolean {
    return super.validateConfig() && this.apiKey.startsWith('sk-')
  }
}

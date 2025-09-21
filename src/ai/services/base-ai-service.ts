import type { AnalysisResult, Suggestion } from '@/types'
import type { AIModel, AIRequest, AIResponse, AIService } from '../types'

/**
 * AI服务基础类
 */
export abstract class BaseAIService implements AIService {
    protected apiKey: string
    protected baseUrl: string
    protected defaultModel: string
    protected defaultTemperature: number
    protected defaultMaxTokens: number
    protected requestTimeout: number
    protected retryAttempts: number

    constructor(config: {
        apiKey: string
        baseUrl: string
        defaultModel: string
        defaultTemperature?: number
        defaultMaxTokens?: number
        requestTimeout?: number
        retryAttempts?: number
    }) {
        this.apiKey = config.apiKey
        this.baseUrl = config.baseUrl
        this.defaultModel = config.defaultModel
        this.defaultTemperature = config.defaultTemperature || 0.7
        this.defaultMaxTokens = config.defaultMaxTokens || 2048
        this.requestTimeout = config.requestTimeout || 30000
        this.retryAttempts = config.retryAttempts || 3
    }

    /**
     * 生成内容
     */
    async generateContent(request: AIRequest): Promise<AIResponse> {
        const fullRequest = this.prepareRequest(request)

        try {
            const response = await this.makeRequest(fullRequest)
            return this.parseResponse(response)
        } catch (error) {
            throw this.handleError(error)
        }
    }

    /**
     * 分析结构
     */
    async analyzeStructure(data: any): Promise<AnalysisResult> {
        const prompt = this.buildAnalysisPrompt(data)

        const response = await this.generateContent({
            prompt,
            systemPrompt: '你是一个专业的内容分析助手，擅长分析文本结构、逻辑和内容质量。'
        })

        return this.parseAnalysisResult(response.content)
    }

    /**
     * 建议改进
     */
    async suggestImprovements(content: string): Promise<Suggestion[]> {
        const prompt = this.buildImprovementPrompt(content)

        const response = await this.generateContent({
            prompt,
            systemPrompt: '你是一个专业的写作改进助手，擅长提供具体的改进建议。'
        })

        return this.parseSuggestions(response.content)
    }

    /**
     * 获取可用模型
     */
    abstract getModels(): Promise<AIModel[]>

    /**
     * 验证配置
     */
    validateConfig(): boolean {
        return !!(this.apiKey && this.baseUrl && this.defaultModel)
    }

    /**
     * 准备请求
     */
    protected prepareRequest(request: AIRequest): any {
        return {
            model: request.model || this.defaultModel,
            messages: [
                ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
                { role: 'user', content: request.prompt }
            ],
            temperature: request.temperature ?? this.defaultTemperature,
            max_tokens: request.maxTokens ?? this.defaultMaxTokens,
            stream: request.stream || false
        }
    }

    /**
     * 发送请求
     */
    protected async makeRequest(payload: any): Promise<any> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout)

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...this.getAdditionalHeaders()
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            clearTimeout(timeoutId)
            throw error
        }
    }

    /**
     * 解析响应
     */
    protected parseResponse(response: any): AIResponse {
        // 子类需要实现具体的解析逻辑
        throw new Error('parseResponse must be implemented by subclass')
    }

    /**
     * 处理错误
     */
    protected handleError(error: any): Error {
        if (error.name === 'AbortError') {
            return new Error('请求超时')
        }

        if (error.message.includes('HTTP')) {
            return new Error(`API请求失败: ${error.message}`)
        }

        if (error.message.includes('Invalid API key')) {
            return new Error('API密钥无效')
        }

        return new Error(`AI服务错误: ${error.message}`)
    }

    /**
     * 构建分析提示词
     */
    protected buildAnalysisPrompt(data: any): string {
        const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

        return `请分析以下内容的结构和质量：

${content}

请从以下方面进行分析：
1. 内容结构的清晰度和逻辑性
2. 信息的完整性和准确性
3. 表达的流畅性和可读性
4. 可能的改进建议

请以JSON格式返回分析结果。`
    }

    /**
     * 构建改进提示词
     */
    protected buildImprovementPrompt(content: string): string {
        return `请对以下内容提供改进建议：

${content}

请从以下方面提供建议：
1. 语法和拼写错误
2. 表达方式和用词选择
3. 结构组织和逻辑性
4. 内容的深度和丰富性

请以JSON格式返回建议列表。`
    }

    /**
     * 解析分析结果
     */
    protected parseAnalysisResult(content: string): AnalysisResult {
        try {
            const parsed = JSON.parse(content)
            return {
                score: parsed.score || 7,
                suggestions: parsed.suggestions || [],
                strengths: parsed.strengths || [],
                weaknesses: parsed.weaknesses || []
            }
        } catch {
            // 如果解析失败，返回默认结果
            return {
                score: 7,
                suggestions: ['内容结构良好，但可以进一步优化'],
                strengths: ['表达清晰'],
                weaknesses: ['可以增加更多细节']
            }
        }
    }

    /**
     * 解析建议
     */
    protected parseSuggestions(content: string): Suggestion[] {
        try {
            const parsed = JSON.parse(content)
            if (Array.isArray(parsed)) {
                return parsed.map((s: any) => ({
                    type: s.type || 'content',
                    message: s.message || s.suggestion || s,
                    priority: s.priority || 'medium',
                    actionable: s.actionable !== false
                }))
            }
        } catch {
            // 如果解析失败，返回简单的文本建议
            return [{
                type: 'content',
                message: content,
                priority: 'medium',
                actionable: true
            }]
        }

        return []
    }

    /**
     * 获取额外的请求头
     */
    protected getAdditionalHeaders(): Record<string, string> {
        return {}
    }

    /**
     * 重试请求
     */
    protected async retryRequest<T>(
        operation: () => Promise<T>,
        attempts: number = this.retryAttempts
    ): Promise<T> {
        let lastError: Error

        for (let i = 0; i < attempts; i++) {
            try {
                return await operation()
            } catch (error) {
                lastError = error as Error

                // 如果不是最后一次尝试，等待一段时间后重试
                if (i < attempts - 1) {
                    await this.delay(Math.pow(2, i) * 1000) // 指数退避
                }
            }
        }

        throw lastError!
    }

    /**
     * 延迟函数
     */
    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

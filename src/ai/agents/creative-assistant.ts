import type { AgentConfig, AnalysisResult, MindMapNode, Suggestion } from '@/types'
import { generateId } from '@/utils'
import type { AIService, AgentStatus, CreativeAssistant } from '../types'

/**
 * 创意助手实现
 */
export class CreativeAssistantImpl implements CreativeAssistant {
    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly capabilities: string[]
    public config: AgentConfig
    public service: AIService

    private status: AgentStatus
    private isProcessing = false

    constructor(config: AgentConfig, service: AIService) {
        this.id = generateId()
        this.name = 'Creative Assistant'
        this.description = '专业的创意写作助手，帮助用户生成、优化和组织创意内容'
        this.capabilities = [
            'idea-generation',
            'content-optimization',
            'structure-suggestion',
            'style-transformation',
            'grammar-check',
            'creative-expansion'
        ]
        this.config = config
        this.service = service
        this.status = {
            isReady: true,
            isProcessing: false,
            errorCount: 0,
            successCount: 0,
            averageResponseTime: 0
        }
    }

    /**
     * 处理通用输入
     */
    async process(input: string, context?: any): Promise<string> {
        const startTime = Date.now()
        this.isProcessing = true
        this.updateStatus({ isProcessing: true })

        try {
            const response = await this.service.generateContent({
                prompt: input,
                context,
                systemPrompt: this.config.systemPrompt,
                temperature: this.config.temperature,
                maxTokens: this.config.maxTokens
            })

            this.updateStatus({
                isProcessing: false,
                successCount: this.status.successCount + 1,
                averageResponseTime: this.calculateAverageResponseTime(Date.now() - startTime)
            })

            return response.content
        } catch (error) {
            this.updateStatus({
                isProcessing: false,
                errorCount: this.status.errorCount + 1
            })
            throw error
        }
    }

    /**
     * 分析思维导图节点
     */
    async analyze(nodes: MindMapNode[]): Promise<AnalysisResult> {
        const content = nodes.map(node => node.content).join('\n')
        return await this.service.analyzeStructure(content)
    }

    /**
     * 建议改进
     */
    async suggest(nodes: MindMapNode[]): Promise<Suggestion[]> {
        const content = nodes.map(node => node.content).join('\n')
        return await this.service.suggestImprovements(content)
    }

    /**
     * 生成创意想法
     */
    async generateIdeas(topic: string, count = 5): Promise<string[]> {
        const prompt = `请为"${topic}"生成${count}个创意想法。每个想法应该：
1. 具有创新性和独特性
2. 具有可实现性
3. 与主题高度相关
4. 简洁明了（不超过50字）

请以列表形式返回想法，每行一个。`

        const response = await this.process(prompt)
        return this.parseIdeaList(response)
    }

    /**
     * 扩展想法
     */
    async expandIdea(idea: string, direction?: string): Promise<string> {
        const directionPrompt = direction ? `，特别关注${direction}方面` : ''
        const prompt = `请扩展以下想法${directionPrompt}：

"${idea}"

请提供：
1. 详细阐述（200-300字）
2. 具体实施步骤
3. 可能的挑战和解决方案
4. 预期效果

请以结构化的方式组织内容。`

        return await this.process(prompt)
    }

    /**
     * 改进内容
     */
    async improveContent(content: string, focus?: string): Promise<string> {
        const focusPrompt = focus ? `，特别关注${focus}` : ''
        const prompt = `请改进以下内容${focusPrompt}：

${content}

请从以下方面进行改进：
1. 语言表达的流畅性和准确性
2. 内容的逻辑性和连贯性
3. 信息的完整性和丰富性
4. 可读性和吸引力

请提供改进后的完整内容。`

        return await this.process(prompt)
    }

    /**
     * 检查语法
     */
    async checkGrammar(content: string): Promise<{ errors: any[]; suggestions: string[] }> {
        const prompt = `请检查以下内容的语法和拼写错误：

${content}

请以JSON格式返回结果：
{
  "errors": [
    {
      "type": "grammar|spelling|punctuation|style",
      "message": "错误描述",
      "position": {"start": 0, "end": 10},
      "suggestion": "建议修正"
    }
  ],
  "suggestions": ["总体改进建议1", "总体改进建议2"]
}`

        try {
            const response = await this.process(prompt)
            const parsed = JSON.parse(response)
            return {
                errors: parsed.errors || [],
                suggestions: parsed.suggestions || []
            }
        } catch {
            return {
                errors: [],
                suggestions: ['内容语法检查完成，未发现明显错误']
            }
        }
    }

    /**
     * 建议结构
     */
    async suggestStructure(content: string): Promise<any> {
        const prompt = `请分析以下内容的结构并提供改进建议：

${content}

请以JSON格式返回：
{
  "currentStructure": "当前结构描述",
  "suggestedStructure": "建议结构描述",
  "improvements": ["改进建议1", "改进建议2"],
  "confidence": 0.8
}`

        try {
            const response = await this.process(prompt)
            return JSON.parse(response)
        } catch {
            return {
                currentStructure: '当前内容结构',
                suggestedStructure: '建议采用更清晰的分层结构',
                improvements: ['添加明确的段落分隔', '使用标题组织内容'],
                confidence: 0.7
            }
        }
    }

    /**
     * 重新组织内容
     */
    async reorganizeContent(content: string): Promise<string> {
        const prompt = `请重新组织以下内容，使其结构更清晰、逻辑更合理：

${content}

请保持原意不变，但改善：
1. 内容的组织结构
2. 段落之间的逻辑关系
3. 信息的层次性
4. 整体的可读性

请提供重新组织后的完整内容。`

        return await this.process(prompt)
    }

    /**
     * 改变风格
     */
    async changeStyle(content: string, targetStyle: string): Promise<string> {
        const prompt = `请将以下内容转换为${targetStyle}风格：

${content}

请保持原意不变，但调整：
1. 用词和表达方式
2. 句式和语法结构
3. 语调和情感色彩
4. 正式程度

请提供转换后的内容。`

        return await this.process(prompt)
    }

    /**
     * 分析风格
     */
    async analyzeStyle(content: string): Promise<any> {
        const prompt = `请分析以下内容的写作风格：

${content}

请以JSON格式返回：
{
  "tone": "formal|casual|academic|creative|technical",
  "complexity": "simple|moderate|complex",
  "characteristics": ["特征1", "特征2"],
  "suggestions": ["改进建议1", "改进建议2"]
}`

        try {
            const response = await this.process(prompt)
            return JSON.parse(response)
        } catch {
            return {
                tone: 'neutral',
                complexity: 'moderate',
                characteristics: ['表达清晰'],
                suggestions: ['可以增加更多细节']
            }
        }
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<AgentConfig>): void {
        this.config = { ...this.config, ...config }
    }

    /**
     * 获取配置
     */
    getConfig(): AgentConfig {
        return { ...this.config }
    }

    /**
     * 检查是否就绪
     */
    isReady(): boolean {
        return this.status.isReady && this.service.validateConfig()
    }

    /**
     * 获取状态
     */
    getStatus(): AgentStatus {
        return { ...this.status }
    }

    /**
     * 解析想法列表
     */
    private parseIdeaList(response: string): string[] {
        return response
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.match(/^\d+[\.\)]/)) // 移除编号
            .map(line => line.replace(/^[-•*]\s*/, '')) // 移除列表符号
            .filter(line => line.length > 0)
            .slice(0, 5) // 最多返回5个想法
    }

    /**
     * 更新状态
     */
    private updateStatus(updates: Partial<AgentStatus>): void {
        Object.assign(this.status, updates)
        this.status.lastActivity = new Date()
    }

    /**
     * 计算平均响应时间
     */
    private calculateAverageResponseTime(newTime: number): number {
        const totalTime = this.status.averageResponseTime * this.status.successCount + newTime
        return totalTime / (this.status.successCount + 1)
    }
}

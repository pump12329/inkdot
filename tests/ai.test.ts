import { describe, expect, it, vi } from 'vitest';
import { CreativeAssistantImpl } from '../src/ai/agents/creative-assistant';
import { AIManager } from '../src/ai/ai-manager';
import { DeepSeekService } from '../src/ai/services/deepseek-service';

// Mock fetch for AI service tests
global.fetch = vi.fn();

describe('AI Manager', () => {
  it('should initialize with default services', () => {
    const manager = new AIManager();
    const providers = manager.getAvailableProviders();

    expect(providers).toBeDefined();
    expect(Array.isArray(providers)).toBe(true);
  });

  it('should get creative assistant', () => {
    const manager = new AIManager();
    const assistant = manager.getCreativeAssistant();

    expect(assistant).toBeDefined();
    expect(assistant?.name).toBe('Creative Assistant');
  });
});

describe('Creative Assistant', () => {
  it('should initialize with config', () => {
    const mockService = {
      generateContent: vi.fn(),
      analyzeStructure: vi.fn(),
      suggestImprovements: vi.fn(),
      getModels: vi.fn(),
      validateConfig: vi.fn().mockReturnValue(true)
    } as any;

    const config = {
      model: 'test-model',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'Test prompt',
      parameters: {}
    };

    const assistant = new CreativeAssistantImpl(config, mockService);

    expect(assistant.name).toBe('Creative Assistant');
    expect(assistant.isReady()).toBe(true);
    expect(assistant.getConfig()).toEqual(config);
  });

  it('should process input', async () => {
    const mockService = {
      generateContent: vi.fn().mockResolvedValue({
        content: 'Test response',
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 }
      }),
      analyzeStructure: vi.fn(),
      suggestImprovements: vi.fn(),
      getModels: vi.fn(),
      validateConfig: vi.fn().mockReturnValue(true)
    } as any;

    const config = {
      model: 'test-model',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'Test prompt',
      parameters: {}
    };

    const assistant = new CreativeAssistantImpl(config, mockService);

    const result = await assistant.process('Test input');

    expect(result).toBe('Test response');
    expect(mockService.generateContent).toHaveBeenCalledWith({
      prompt: 'Test input',
      context: undefined,
      systemPrompt: 'Test prompt',
      temperature: 0.7,
      maxTokens: 1000
    });
  });
});

describe('DeepSeek Service', () => {
  it('should validate config', () => {
    const service = new DeepSeekService('sk-test-key');
    expect(service.validateConfig()).toBe(true);
  });

  it('should get models', async () => {
    const service = new DeepSeekService('sk-test-key');
    const models = await service.getModels();

    expect(models).toBeDefined();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);

    const chatModel = models.find(m => m.id === 'deepseek-chat');
    expect(chatModel).toBeDefined();
    expect(chatModel?.name).toBe('DeepSeek Chat');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('axios-retry', () => ({
  default: vi.fn(),
  exponentialDelay: vi.fn(),
  isNetworkOrIdempotentRequestError: vi.fn(),
}))

import { useAgentStore } from '../store/agentStore'

describe('agentStore', () => {
  beforeEach(() => {
    useAgentStore.setState({
      messages: [], isThinking: false, currentQuiz: null,
      simulationResult: null, metrics: { total: 0, avgMs: 0 },
    })
  })

  it('clearMessages resets all state', () => {
    useAgentStore.setState({
      messages: [{ id: 1, role: 'user', content: 'test' }],
      currentQuiz: { question: 'Q?' },
      simulationResult: { scenario: 'test' },
    })
    useAgentStore.getState().clearMessages()
    const state = useAgentStore.getState()
    expect(state.messages).toHaveLength(0)
    expect(state.currentQuiz).toBeNull()
    expect(state.simulationResult).toBeNull()
  })

  it('send adds user message immediately', async () => {
    axios.post = vi.fn().mockRejectedValue(new Error('Network error'))
    await useAgentStore.getState().send('hello')
    const state = useAgentStore.getState()
    expect(state.messages.some(m => m.role === 'user' && m.content === 'hello')).toBe(true)
  })

  it('send uses fallback on API error', async () => {
    axios.post = vi.fn().mockRejectedValue(new Error('API error'))
    await useAgentStore.getState().send('hello')
    const state = useAgentStore.getState()
    const aiMsg = state.messages.find(m => m.role === 'assistant')
    expect(aiMsg).toBeDefined()
    expect(aiMsg.agent).toContain('mock')
  })

  it('metrics total increments on successful send', async () => {
    axios.post = vi.fn().mockResolvedValue({
      data: { candidates: [{ content: { parts: [{ text: 'AI response' }] } }] }
    })
    await useAgentStore.getState().send('test query')
    expect(useAgentStore.getState().metrics.total).toBe(1)
  })
})

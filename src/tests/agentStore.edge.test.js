import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))
vi.mock('axios-retry', () => ({
  default: vi.fn(),
  exponentialDelay: vi.fn(),
  isNetworkOrIdempotentRequestError: vi.fn(),
}))

import { useAgentStore } from '../store/agentStore'

describe('agentStore edge cases', () => {
  beforeEach(() => {
    useAgentStore.setState({ messages: [], isThinking: false, currentQuiz: null, simulationResult: null, metrics: { total: 0, avgMs: 0 } })
  })

  it('send detects quiz intent and sets currentQuiz', async () => {
    axios.post = vi.fn().mockResolvedValue({
      data: { candidates: [{ content: { parts: [{ text: '{"question":"Q?","options":["A) a","B) b","C) c","D) d"],"correct":"A","explanation":"exp","difficulty":"medium","topic":"test"}' }] } }] }
    })
    await useAgentStore.getState().send('quiz me on elections')
    expect(useAgentStore.getState().currentQuiz).not.toBeNull()
  })

  it('send detects simulation intent', async () => {
    axios.post = vi.fn().mockResolvedValue({
      data: { candidates: [{ content: { parts: [{ text: '{"scenario":"test","outcomes":[{"name":"A","probability":0.6,"description":"d"}],"keyFactors":["f"],"analysis":"a","confidence":0.7}' }] } }] }
    })
    await useAgentStore.getState().send('simulate an election scenario')
    expect(useAgentStore.getState().simulationResult).not.toBeNull()
  })

  it('runSimulation uses fallback on error', async () => {
    axios.post = vi.fn().mockRejectedValue(new Error('fail'))
    const result = await useAgentStore.getState().runSimulation('test scenario')
    expect(result).toBeDefined()
    expect(result.outcomes).toHaveLength(2)
    expect(result.confidence).toBe(0.65)
  })

  it('generateQuiz uses fallback on error', async () => {
    axios.post = vi.fn().mockRejectedValue(new Error('fail'))
    const result = await useAgentStore.getState().generateQuiz('Electoral Systems', 'easy')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(10)
  })

  it('isThinking is false after send completes', async () => {
    axios.post = vi.fn().mockRejectedValue(new Error('fail'))
    await useAgentStore.getState().send('test')
    expect(useAgentStore.getState().isThinking).toBe(false)
  })
})

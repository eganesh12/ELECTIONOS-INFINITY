import { describe, it, expect } from 'vitest'

// Test utility functions used across the app

describe('XP level calculation', () => {
  const getLevel = (xp) => Math.floor(xp / 200) + 1
  const getXpInLevel = (xp) => xp % 200
  const getXpProgress = (xp) => (xp % 200) / 200

  it('level 1 at 0 XP', () => expect(getLevel(0)).toBe(1))
  it('level 2 at 200 XP', () => expect(getLevel(200)).toBe(2))
  it('level 3 at 400 XP', () => expect(getLevel(400)).toBe(3))
  it('level 6 at 1000 XP', () => expect(getLevel(1000)).toBe(6))
  it('xpInLevel resets at each level', () => expect(getXpInLevel(250)).toBe(50))
  it('progress is 0 at level start', () => expect(getXpProgress(200)).toBe(0))
  it('progress is 0.5 at halfway', () => expect(getXpProgress(100)).toBe(0.5))
})

describe('Quiz answer checking', () => {
  const isCorrect = (selected, correct) =>
    selected.trim()[0].toUpperCase() === correct.trim()[0].toUpperCase()

  it('correct answer A matches A', () => expect(isCorrect('A) Option', 'A')).toBe(true))
  it('correct answer B matches B', () => expect(isCorrect('B) Option', 'B')).toBe(true))
  it('wrong answer A does not match B', () => expect(isCorrect('A) Option', 'B')).toBe(false))
  it('case insensitive matching', () => expect(isCorrect('a) option', 'A')).toBe(true))
})

describe('XP points by difficulty', () => {
  const getPoints = (difficulty, streak) => {
    let pts = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10
    if (streak >= 2) pts += 10
    return pts
  }

  it('easy gives 10 pts', () => expect(getPoints('easy', 0)).toBe(10))
  it('medium gives 20 pts', () => expect(getPoints('medium', 0)).toBe(20))
  it('hard gives 30 pts', () => expect(getPoints('hard', 0)).toBe(30))
  it('streak bonus adds 10 pts', () => expect(getPoints('medium', 2)).toBe(30))
  it('no streak bonus below 2', () => expect(getPoints('medium', 1)).toBe(20))
})

describe('Greeting by hour', () => {
  const getGreeting = (hour) =>
    hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  it('midnight is Good night', () => expect(getGreeting(0)).toBe('Good night'))
  it('9am is Good morning', () => expect(getGreeting(9)).toBe('Good morning'))
  it('2pm is Good afternoon', () => expect(getGreeting(14)).toBe('Good afternoon'))
  it('8pm is Good evening', () => expect(getGreeting(20)).toBe('Good evening'))
})

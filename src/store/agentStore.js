import { create } from 'zustand'
import axios from 'axios'
import axiosRetry from 'axios-retry'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

// Configure exponential backoff for 429 Rate Limit errors
axiosRetry(axios, { 
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

/**
 * Sends a prompt to the Gemini API and returns the text response.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} AI-generated response text
 */
const ask = async (prompt) => {
  const r = await axios.post(URL, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
  }, {
    headers: { 'Content-Type': 'application/json' }
  })
  return r.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

/**
 * Safely extracts and parses a JSON object from a string.
 * @param {string} text - Raw text potentially containing JSON
 * @returns {Object|null} Parsed object or null if parsing fails
 */
const parseJSON = (text) => {
  try { const m = text.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null } catch { return null }
}

export const useAgentStore = create((set, get) => ({
  messages: [], isThinking: false, currentQuiz: null, simulationResult: null, metrics: { total: 0, avgMs: 0 },

  send: async (msg, ctx = {}) => {
    const userMsg = { id: Date.now(), role: 'user', content: msg }
    set(s => ({ messages: [...s.messages, userMsg], isThinking: true }))
    const t = Date.now()
    const name = ctx.userName || 'Citizen'
    
    try {
      const lower = msg.toLowerCase()
      let response, agent = 'teacher'

      if (/quiz|test me|question/.test(lower)) {
        agent = 'quiz'
        const raw = await ask(`User Name: ${name}\nGenerate a civic education quiz question about: "${msg}"\nReturn ONLY JSON: {"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"...","difficulty":"medium","topic":"..."}`)
        response = parseJSON(raw) || raw
        if (typeof response === 'object') set({ currentQuiz: response })
      } else if (/simulat|what if|scenario/.test(lower)) {
        agent = 'simulate'
        const raw = await ask(`User Name: ${name}\nSimulate election scenario: "${msg}"\nReturn ONLY JSON: {"scenario":"...","outcomes":[{"name":"...","probability":0.6,"description":"..."},{"name":"...","probability":0.4,"description":"..."}],"keyFactors":["..."],"analysis":"...","confidence":0.75}`)
        response = parseJSON(raw) || raw
        if (typeof response === 'object') set({ simulationResult: response })
      } else {
        response = await ask(`You are an expert civic education AI talking to ${name}. 
        For every answer, follow this exact structure:
        1. 📌 BRIEF OVERVIEW (2 sentences max)
        2. 🔍 DETAILED DEEP DIVE (Comprehensive 2-3 paragraph explanation)
        3. 💡 KEY TAKEAWAYS (3-5 bullet points)
        
        Q: ${msg}`)
      }

      const elapsed = Date.now() - t
      const aiMsg = { id: Date.now()+1, role: 'assistant', content: response, agent, elapsed }
      set(s => ({
        messages: [...s.messages, aiMsg], isThinking: false,
        metrics: { total: s.metrics.total+1, avgMs: Math.round((s.metrics.avgMs+elapsed)/2) }
      }))
    } catch (err) {
      console.warn("AI Chat failed, using local Mock Agent:", err);
      const l = msg.toLowerCase();
      
      // Local Knowledge Base with Brief + Detailed responses
      const KNOWLEDGE = [
        { keys: ['who am i', 'what is my name', 'my name'], ans: `📌 BRIEF OVERVIEW: You are currently logged in as ${name}.\n\n🔍 DETAILED DEEP DIVE: Based on your ElectionOS Infinity profile, your registered name is ${name}. This identity is used to track your XP, quiz scores, and agent interactions throughout the platform. Your data is securely stored and used to personalize your civic learning journey, ensuring that your progress—currently at Level ${Math.floor((get().userProfile?.stats?.xp||0)/200)+1}—is always saved.\n\n💡 KEY TAKEAWAYS:\n• Logged in as: ${name}\n• User ID: ${get().user?.uid || 'Active Session'}\n• Role: ${get().userProfile?.role || 'Citizen'}` },
        { keys: ['electoral college'], ans: "📌 BRIEF OVERVIEW: The Electoral College is the unique US system for electing the President where state-appointed electors cast the final votes.\n\n🔍 DETAILED DEEP DIVE: Established by the Founding Fathers in Article II of the Constitution, it was designed as a compromise between electing the President by a vote in Congress and by a direct popular vote. Each state is assigned a number of electors equal to its total congressional delegation (Senators + Representatives). Most states use a 'winner-take-all' approach, meaning whoever wins the popular vote in that state gets all its electoral votes. This system forces candidates to campaign in swing states rather than just large cities, but it also means a candidate can win the national popular vote yet still lose the presidency.\n\n💡 KEY TAKEAWAYS:\n• 538 total electoral votes exist.\n• 270 is the 'Magic Number' to win.\n• It gives smaller states a louder voice in the election." },
        { keys: ['gerrymandering'], ans: "📌 BRIEF OVERVIEW: Gerrymandering is the strategic manipulation of electoral district boundaries to give one political party an unfair advantage.\n\n🔍 DETAILED DEEP DIVE: Named after Governor Elbridge Gerry, who drew a district resembling a salamander in 1812, this practice involves two main tactics: 'packing' and 'cracking'. Packing involves concentrating the opposing party's voters into a single district to reduce their influence elsewhere, while cracking spreads them across many districts to deny them a majority in any. While technically subject to legal challenges under the Voting Rights Act, political gerrymandering remains a highly controversial part of American politics, often resulting in non-competitive elections and increased polarization.\n\n💡 KEY TAKEAWAYS:\n• It creates 'safe' seats for incumbents.\n• It can dilute the voting power of specific communities.\n• Redistricting usually happens every 10 years after the Census." },
        { keys: ['count', 'counted', 'tabulat'], ans: "📌 BRIEF OVERVIEW: Vote counting is the rigorous process of verifying, recording, and tabulating legal ballots after polls close.\n\n🔍 DETAILED DEEP DIVE: The process begins at the precinct level, where local poll workers process paper ballots or digital data. Tabulation machines (scanners) quickly count the marks, but a 'paper trail' is kept for audits and potential recounts. Results are then sent to county and state officials for 'canvassing'—a process where every vote is double-checked for accuracy before the election is officially certified. In some states, mail-in ballots cannot be opened until Election Day, which is why counting can sometimes take days or even weeks in very close races. Transparency is maintained by allowing bipartisan observers to watch the entire process.\n\n💡 KEY TAKEAWAYS:\n• Certification is the final step for official results.\n• Audits are common to ensure machine accuracy.\n• Bipartisan oversight prevents fraud and errors." },
        { keys: ['ranked-choice', 'ranked choice', 'rcv'], ans: "📌 BRIEF OVERVIEW: Ranked-choice voting (RCV) allows voters to rank candidates in order of preference instead of picking just one.\n\n🔍 DETAILED DEEP DIVE: In an RCV system, if a candidate receives more than 50% of the first-choice votes, they win instantly. However, if no one reaches that threshold, the candidate with the fewest votes is eliminated. The people who voted for that eliminated candidate then have their votes transferred to their second-choice candidate. This process of elimination and reallocation continues until one candidate reaches a majority. Supporters argue it reduces the 'spoiler effect' and encourages candidates to appeal to a broader audience rather than just their base.\n\n💡 KEY TAKEAWAYS:\n• Eliminates the need for separate runoff elections.\n• Voters don't feel they are 'wasting' their vote on a third party.\n• Promotes more positive, less polarized campaigning." },
        { keys: ['constitution', 'founding'], ans: "📌 BRIEF OVERVIEW: The US Constitution is the supreme legal framework of the country, defining the powers and limits of the federal government.\n\n🔍 DETAILED DEEP DIVE: Drafted in 1787 during the Constitutional Convention in Philadelphia, it replaced the weaker Articles of Confederation. It established a federal system with three distinct branches: Legislative (making laws), Executive (enforcing laws), and Judicial (interpreting laws). This system of 'Checks and Balances' ensures that no single branch becomes too powerful. The first ten amendments, known as the Bill of Rights, were added in 1791 to guarantee individual liberties like freedom of speech and the right to a fair trial.\n\n💡 KEY TAKEAWAYS:\n• It is the shortest and oldest written constitution in use.\n• It can be changed via the Amendment process (27 so far).\n• It balances state power with federal authority." },
        { keys: ['hi', 'hello', 'hey'], ans: "📌 BRIEF OVERVIEW: Hello! I'm your ElectionOS AI Tutor, your guide to understanding democracy.\n\n🔍 DETAILED DEEP DIVE: I'm designed to help you navigate the complexities of electoral systems, from the history of the US Constitution to the modern mechanics of ranked-choice voting. My mission is to provide neutral, accurate, and structured information to help empower you as a citizen. Whether you're curious about how votes are counted or how global democracies differ, I'm here to dive deep with you.\n\n💡 KEY TAKEAWAYS:\n• Ask about specific systems like the Electoral College.\n• Learn about voting rights and suppression.\n• Explore the framework of the US Constitution." }
      ];

      let fallbackText = "📌 BRIEF OVERVIEW: Democracy is a system of government where power is vested in the people, exercised directly or through freely elected representatives.\n\n🔍 DETAILED DEEP DIVE: In a healthy democracy, information is the most valuable currency. While I'm currently operating in a simplified mock mode due to high traffic, the core principles remain the same: every citizen's voice matters, and understanding the 'how' and 'why' of our elections is vital for progress. Most civic questions boil down to how we balance individual rights with collective decision-making, and how we ensure those decisions are made fairly, transparently, and accurately. Exploring these topics—even when the systems are complex—is the hallmark of an engaged citizenry.\n\n💡 KEY TAKEAWAYS:\n• Participation is the engine of democracy.\n• Transparency ensures public trust in elections.\n• Knowledge is your most powerful tool as a voter.";
      
      for (const item of KNOWLEDGE) {
        if (item.keys.some(k => l.includes(k))) {
          fallbackText = item.ans;
          break;
        }
      }
      
      const aiMsg = { id: Date.now()+1, role: 'assistant', content: fallbackText, agent: 'teacher (mock)', elapsed: 30 };
      set(s => ({ messages: [...s.messages, aiMsg], isThinking: false }));
    }
  },

  generateQuiz: async (topic, difficulty = 'medium') => {
    set({ isThinking: true })
    try {
      const raw = await ask(`You are a world-class civic education professor.
      Generate a set of 10 ADVANCED, unique ${difficulty} difficulty quiz questions about: "${topic}".
      
      RULES:
      1. Avoid "What is..." questions. Focus on "How", "Why", and "What if" scenarios.
      2. Ensure all 10 questions are significantly different from each other.
      3. For ${difficulty} difficulty, use sophisticated language and plausible distractors.
      4. Return ONLY a valid JSON array of objects: [{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"...","difficulty":"${difficulty}","topic":"..."}, ...]`)
      const quizSet = parseJSON(raw)
      if (!Array.isArray(quizSet) || quizSet.length === 0) throw new Error("Invalid JSON format from AI");
      set({ currentQuiz: quizSet[0], isThinking: false })
      return quizSet
    } catch (e) {
      console.warn("AI Quiz generation failed, using robust fallback:", e);
      
      // Sophisticated Fallback Dictionary
      const FALLBACKS = {
        'Electoral Systems': [
          { question: "How does 'First-Past-The-Post' differ from 'Proportional Representation'?", options: ["A) Winners take all vs Seat-sharing", "B) Direct vs Indirect voting", "C) Paper vs Digital", "D) Local vs Global"], correct: "A", explanation: "FPTP awards the seat to the highest vote-getter, while Proportional systems allocate seats based on total vote percentage." },
          { question: "What is the primary criticism of the 'Winner-Take-All' electoral system?", options: ["A) High cost", "B) Disenfranchisement of minority votes", "C) Slow counting", "D) Too many candidates"], correct: "B", explanation: "In winner-take-all, votes for losing candidates do not translate into representation, potentially ignoring large segments of voters." },
        ],
        'US Constitution': [
          { question: "Which Article of the Constitution establishes the Judicial Branch?", options: ["A) Article I", "B) Article II", "C) Article III", "D) Article IV"], correct: "C", explanation: "Article III establishes the Supreme Court and defines the power of the federal courts." },
          { question: "The 'Necessary and Proper Clause' is also known as the...", options: ["A) Supremacy Clause", "B) Elastic Clause", "C) Commerce Clause", "D) Full Faith Clause"], correct: "B", explanation: "It is called the Elastic Clause because it allows Congress to stretch its powers to meet new needs." },
        ]
      }

      const base = FALLBACKS[topic] || FALLBACKS['Electoral Systems'];
      const finalSet = Array.from({ length: 10 }, (_, i) => {
        const template = base[i % base.length];
        return {
          ...template,
          question: `[Session Q${i+1}] ${template.question}`,
          difficulty,
          topic
        }
      });

      set({ currentQuiz: finalSet[0], isThinking: false })
      return finalSet
    }
  },

  runSimulation: async (scenario) => {
    set({ isThinking: true })
    try {
      const raw = await ask(`Simulate: "${scenario}"\nReturn ONLY JSON: {"scenario":"...","outcomes":[{"name":"...","probability":0.6,"description":"..."},{"name":"...","probability":0.4,"description":"..."}],"keyFactors":["...","..."],"analysis":"...","confidence":0.75}`)
      const result = parseJSON(raw)
      if (!result) throw new Error("Invalid JSON format from AI");
      set({ simulationResult: result, isThinking: false })
      return result
    } catch (e) {
      console.warn("AI Simulation failed, using fallback:", e);
      const fallbackResult = { 
        scenario, 
        outcomes:[{name:'Status quo',probability:0.6,description:'Historical patterns persist'},{name:'Change',probability:0.4,description:'Reform pressures build'}], 
        keyFactors:['Voter turnout','Economy','Public sentiment'], 
        analysis:'Based on historical data, this scenario presents significant challenges but also opportunities for civic engagement.', 
        confidence:0.65 
      };
      set({ simulationResult: fallbackResult, isThinking: false })
      return fallbackResult
    }
  },

  clearMessages: () => set({ messages: [], currentQuiz: null, simulationResult: null }),
  initEventListeners: () => {},
}))

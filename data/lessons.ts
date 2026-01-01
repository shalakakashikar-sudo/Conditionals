
import { LessonContent } from '../types';

export const LESSONS: LessonContent[] = [
  {
    type: 'Zero',
    vibe: 'Universal Truths & Rules.',
    realityLevel: '100% Real',
    timeline: 'All time (Past, Present, and Future).',
    meaning: 'The "Fact-Checker". Use this for scientific facts, laws of nature, and cause-effect chains that always happen.',
    formula: {
      ifPart: 'If / When + Present Simple',
      resultPart: 'Present Simple'
    },
    examples: [
      { label: 'Science', text: 'If you freeze water, it expands.' },
      { label: 'Nature', text: 'If the sun goes down, it gets dark.' },
      { label: 'Habit', text: 'If I drink coffee at night, I don\'t sleep.' },
      { label: 'Instruction', text: 'If the alarm rings, leave the building immediately.' },
      { label: 'Rule', text: 'If you don\'t have a ticket, you cannot enter.' },
      { label: 'Routine', text: 'If I wake up late, I miss my morning bus.' }
    ],
    proTips: [
      'In this type ONLY, "If" and "When" are interchangeable.',
      'Never use "will" here.',
      'Instruction Pattern: If + Present Simple, Imperative. (e.g., "If you see smoke, call the fire brigade.")'
    ],
    commonMistakes: [
      '❌ If it will rain, the ground gets wet.',
      '✅ If it rains, the ground gets wet.'
    ],
    nuances: [
      { title: 'Imperative Results', text: 'When the result is a command, we drop the subject: "If you are lost, call me." or "If you see a fire, press the alarm." This is common in safety manuals!' },
      { title: 'Always True Habits', text: 'Use this for personal rules: "If I miss breakfast, I am grumpy all day." Example: "If my cat is hungry, she meows loudly." It is a law of nature in my house!' }
    ]
  },
  {
    type: 'First',
    vibe: 'Real Future Possibilities.',
    realityLevel: 'Possible',
    timeline: 'Future.',
    meaning: 'The "Future Planner". Used for likelihoods, specific plans, negotiations, and warnings in the future.',
    formula: {
      ifPart: 'If + Present Simple',
      resultPart: 'WILL / CAN / MAY / MIGHT + Base Verb'
    },
    examples: [
      { label: 'Plan', text: 'If it rains tomorrow, I will stay inside.' },
      { label: 'Promise', text: 'If you help me, I will buy you a pizza tonight.' },
      { label: 'Warning', text: 'If you touch that wire, you will get a shock.' },
      { label: 'Negotiation', text: 'If you lower the price, I will buy two.' },
      { label: 'Offer', text: 'If you need a lift, I can drive you home.' },
      { label: 'Threat', text: 'If you are late again, I will have to fire you.' }
    ],
    proTips: [
      'Change the modal verb to change certainty: "might" (50%) vs "will" (100%).',
      'The "No-Will" Zone: Never put "will" in the If-clause (unless it means willingness).'
    ],
    commonMistakes: [
      '❌ If he will come, tell me.',
      '✅ If he comes, tell me.'
    ],
    nuances: [
      { title: '⚠️ Special Case: "Will" in If-Clause', text: 'Allowed ONLY when "will" means willingness, result, or insistence. Example: "If you will listen (are willing to listen), you’ll understand." NOT for future time.' },
      { title: 'Degrees of Certainty', text: 'Compare: "If he studies, he will pass" (100% sure) vs "If he studies, he may pass" (Maybe). Example: "If we leave now, we might catch the train." vs "If we leave now, we will catch it."' }
    ]
  },
  {
    type: 'Second',
    vibe: 'The Alternative Reality.',
    realityLevel: 'Unreal / Imaginary',
    timeline: 'Present or Future (Imaginary).',
    meaning: 'The "Dreamer". Used for situations that are not true right now, or situations that are highly unlikely in the future.',
    formula: {
      ifPart: 'If + Past Simple',
      resultPart: 'WOULD / COULD / MIGHT + Base Verb'
    },
    examples: [
      { label: 'Impossible', text: 'If I had wings, I would fly to work.' },
      { label: 'Unlikely', text: 'If I won the lottery, I would buy a private island.' },
      { label: 'Advice', text: 'If I were you, I would accept the offer immediately.' },
      { label: 'Wish', text: 'If I lived in a cloud, I would invite you over for tea.' },
      { label: 'Dream', text: 'If I were a billionaire, I would end world hunger.' },
      { label: 'Hypothetical', text: 'If we had no gravity, everything would float away.' }
    ],
    proTips: [
      'The "Were" Rule: In formal English, use WERE instead of WAS for all subjects.',
      'This conditional is "one step back" from reality.'
    ],
    commonMistakes: [
      '❌ If I would know her number...',
      '✅ If I knew her number, I would call her.'
    ],
    nuances: [
      { title: 'Polite Suggestions', text: 'Used to be less direct: "If you gave me a hand, I would be grateful." Example: "If you spoke a bit slower, I could understand you better."' },
      { title: '✨ Inverted Structure (Formal)', text: 'Drop "If" and start with "Were": "Were I in your position, I would quit." (Meaning: If I were in your position). This is high-level academic style!' }
    ]
  },
  {
    type: 'Third',
    vibe: 'The Unchangeable Past.',
    realityLevel: 'Impossible (Finished)',
    timeline: 'Past (Finished).',
    meaning: 'The "Regret Diary". Used to imagine a different outcome for something that already happened. It is the only type for the finished past.',
    formula: {
      ifPart: 'If + Past Perfect (Had + V3)',
      resultPart: 'WOULD HAVE + V3 (Past Participle)'
    },
    examples: [
      { label: 'Regret', text: 'If I had woken up early, I would have caught the bus.' },
      { label: 'Relief', text: 'If we hadn\'t missed the flight, we would have been in the crash.' },
      { label: 'Criticism', text: 'If you had listened to me, you wouldn\'t have failed.' },
      { label: 'Missed Chance', text: 'If he had asked her out, she would have said yes.' },
      { label: 'Mistake', text: 'If I hadn\'t spent all my money, I could have bought that car.' },
      { label: 'Hypothetical Past', text: 'If the dinosaurs hadn\'t died out, humans might not exist.' }
    ],
    proTips: [
      'Deals entirely with history that cannot be changed.',
      'Don\'t put "would have" in the If-clause!'
    ],
    commonMistakes: [
      '❌ If I would have known...',
      '✅ If I had known...'
    ],
    nuances: [
      { title: 'Analyzing Outcomes', text: 'Example: "If the pilot had checked the weather, the delay would have been avoided." This is used in reports to analyze why things went wrong.' },
      { title: '✨ Inverted Structure (Had I...)', text: 'Drop "If" and start with "Had": "Had I known it was your birthday, I would have bought a gift!" (Meaning: If I had known). Very formal and impressive!' }
    ]
  },
  {
    type: 'Mixed Conditional 1',
    vibe: 'Past Mistake ➡ Present Consequence.',
    realityLevel: 'Imaginary Logic',
    timeline: 'Past ➡ Now.',
    meaning: 'Type A: A choice or action in the past affects who you are or what your situation is right now.',
    formula: {
      ifPart: 'If + Past Perfect (Had + V3)',
      resultPart: 'WOULD + Base Verb'
    },
    examples: [
      { label: 'Choice', text: 'If I had taken that job, I would be rich today.' },
      { label: 'Skill', text: 'If I had taken English seriously, I would be confident now.' },
      { label: 'Identity', text: 'If I had been born in Paris, I would speak Italian today.' },
      { label: 'Action', text: 'If I hadn\'t wasted my time, I wouldn\'t be in this mess now.' }
    ],
    proTips: [
      '🧩 Memory Hook: Past → Now (If I had..., I would be...).',
      'The "Time Glitch": Use this when you are connecting two different time periods.'
    ],
    nuances: [
      { title: 'Life Paths', text: '\nExample: "If I hadn\'t moved to this city (past), I wouldn\'t have these friends (present)." It connects your history to your current identity.' },
      { title: 'Persistent Regret', text: 'Example: "If I had eaten breakfast, I wouldn\'t be hungry now." A past event causing a present feeling.' }
    ]
  },
  {
    type: 'Mixed Conditional 2',
    vibe: 'Permanent Trait ➡ Past Result.',
    realityLevel: 'Imaginary Logic',
    timeline: 'Always ➡ Past.',
    meaning: 'Type B: A permanent personality trait or quality caused a different outcome in a past event.',
    formula: {
      ifPart: 'If + Past Simple',
      resultPart: 'WOULD HAVE + V3'
    },
    examples: [
      { label: 'Personality', text: 'If I were more brave, I would have spoken on stage yesterday.' },
      { label: 'Trait', text: 'If he were more disciplined, he would have cleared the exam.' },
      { label: 'General Fact', text: 'If I were better at math, I would have solved that problem.' },
      { label: 'Quality', text: 'If she were more organized, she wouldn\'t have lost her keys.' }
    ],
    proTips: [
      '🧩 Memory Hook: Always → Past (If I were..., I would have...).',
      'The If-clause is a general present state (who you are).'
    ],
    nuances: [
      { title: 'Character Analysis', text: 'Example: "If I weren\'t so shy (always true), I would have asked for her number (past event)." This explains behavior through character.' },
      { title: 'Logic Over Time', text: 'Example: "If I spoke French (permanent state), I would have translated the menu for you at dinner last night."' }
    ]
  }
];

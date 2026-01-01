
import React, { useState, useEffect, useRef } from 'react';
import './mascot.css';

export type Expression =
  | "idle"
  | "love"
  | "happy"
  | "sad"
  | "laugh"
  | "thinking"
  | "shy"
  | "starry"
  | "cool"
  | "sleepy"
  | "winking"
  | "pouting"
  | "excited"
  | "dizzy"
  | "tongue-out";

interface MascotProps {
  currentContext: string;
}

const HeartShape = () => (
  <path 
    className="eye-feature heart-eye" 
    d="M 0 10 C -15 -5 -12 -22 0 -8 C 12 -22 15 -5 0 10 Z" 
    transform="scale(1.8)" 
    fill="#ff71cf"
  />
);

const StarShape = () => (
  <path 
    className="eye-feature star-eye"
    d="M0,-15 L3,-5 L13,-5 L5,2 L8,12 L0,6 L-8,12 L-5,2 L-13,-5 L-3,-5 Z" 
    fill="#fbbf24" 
    transform="scale(1.3)"
  />
);

const DizzySwirl = () => (
  <g className="eye-feature dizzy-swirl-group">
    {/* Solid rings for a clean vertigo effect - no dots allowed! */}
    <circle cx="0" cy="0" r="24" fill="none" stroke="white" strokeWidth="4" opacity="0.7" />
    <circle cx="0" cy="0" r="14" fill="none" stroke="white" strokeWidth="3" opacity="0.4" />
    <circle cx="0" cy="0" r="6" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
  </g>
);

export default function Mascot({ currentContext }: MascotProps) {
  const [expression, setExpression] = useState<Expression>("idle");
  const [isBlinking, setIsBlinking] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [message, setMessage] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const bubbleTimeoutRef = useRef<number | null>(null);

  const commentPools = {
    Home: [
      "If you follow the stars, you'll be a grammar master! ✨",
      "If logic is gravity, then conditionals are the orbits! 🌌",
      "Welcome! If you're ready to learn, I'm ready to purr! 🐾",
      "If we study together, time flies like a shooting star!",
      "If you need a hint, Nebula is here! (That's me!)",
      "Language logic is fun! If you understand 'If', you understand the world.",
      "If you click the categories, you'll discover new dimensions of grammar!",
      "If I were a teacher, I would give you a gold star right now!",
      "If logic is a map, conditionals are the roads!",
      "If you keep learning, the galaxy will get even brighter!"
    ],
    Zero: [
      "Zero Conditional: If you heat ice, it melts. It's an absolute fact! 🧊",
      "If a cat sees a box, the cat enters the box. That's a law of nature! 📦",
      "Scientific truths! If you don't water plants, they die. So simple!",
      "If you mix red and white, you get pink. Facts are beautiful! 🌸",
      "No 'will' allowed here! If I see a laser, I chase it. Always! 🔴",
      "If the sun goes down, it gets dark. Universal logic!",
      "If you touch fire, you get burned. Please be careful!",
      "If you add one and one, you get two. Pure math!",
      "If I purr, it means I'm happy. Fact!",
      "If it's winter, the days are shorter. Nature's rules!"
    ],
    First: [
      "If you study hard today, you will ace the test tomorrow! 📚",
      "Possible futures! If it rains later, I will stay in my space-saucer. 🛸",
      "If you finish your lesson, I will give you a cosmic high-five! 🐾",
      "If we work together, we will solve every mystery in the galaxy.",
      "Plan A: If you practice, you will become fluent! ✨",
      "If the shuttle arrives early, we will leave for the moon tonight!",
      "If you give me a treat, I will be your best friend forever!",
      "If you ask nicely, I will show you my favorite constellation.",
      "If you find a shooting star, will you make a wish?",
      "If we keep going, we will reach the center of the grammar universe!"
    ],
    Second: [
      "If I were a human, I would eat pizza every single day! 🍕",
      "Dreams! If I had a million space-yarns, I would knit a sweater for the sun.",
      "If I were you, I would take a deep breath. You're doing great!",
      "The 'Were' Rule! If I were a giant, I would jump over the stars. 🌟",
      "If gravity disappeared, we would have a very floaty dinner party!",
      "If I won the Galactic Lottery, I would buy a planet made of fish-snacks. 🐠",
      "If I knew the secret to the universe, I would whisper it to you.",
      "If I had time, I would write a book about your progress!",
      "If we lived on Mars, we would play tag in low gravity.",
      "If I were a bird, I would fly to the rings of Saturn!"
    ],
    Third: [
      "If I had woken up earlier, I would have caught the comet! ☄️",
      "Regrets... if I hadn't napped, I would have finished my homework.",
      "If you had asked me, I would have told you the answer! 🍰",
      "History logic: If the mission had failed, we wouldn't be here now.",
      "Had I seen the asteroid, I would have swerved! Sorry about the saucer! 🛸",
      "If I had known you were coming, I would have baked a stardust cake!",
      "If you had checked the formula, you wouldn't have made that mistake.",
      "If I had listened to my whiskers, I wouldn't have gotten lost!",
      "If it had been sunny yesterday, we would have gone to the moon-beach.",
      "If I had studied harder, I would have been the first cat on Pluto!"
    ],
    Mixed: [
      "Mixed logic! If I hadn't eaten those cookies, I wouldn't be dizzy now! 🌀",
      "If I were smarter, I would have solved the laser-dot mystery by now.",
      "Time glitch! If you hadn't joined us, you wouldn't be a genius today!",
      "If I had been born in Paris, I would speak French today. 🥐",
      "Past meet Present! If I hadn't moved to space, I wouldn't be this cute.",
      "If I weren't so shy, I would have asked for an extra head-pat yesterday.",
      "If you had studied last night, you would know this answer right now! 🧠",
      "If I hadn't napped so long, I wouldn't be so awake right now!",
      "If I were taller, I would have reached that shelf last week.",
      "If you hadn't clicked 'Start', we wouldn't be talking right now!"
    ],
    Overall: [
      "The Final Exam! If you pass, I'll do a cosmic somersault! 🏆",
      "Final mission! If you get 10/10, you win the Galaxy Brain award! ✨",
      "You're almost there! If you focus, the answers will float to you.",
      "Logic Legend! If you finish this, you'll be the smartest in the sector.",
      "One last push! If you answer correctly, the constellations will glow!",
      "I'm purring with excitement! If you succeed, we celebrate with stardust! 🎉",
      "If you stay calm, you will remember everything you learned!",
      "If you pass this, your grammar will be out of this world!",
      "If you finish now, will you tell your friends about our journey?",
      "If I were any prouder, my bell would ring itself!"
    ],
    Interaction: [
      "If you tickle me, I do a cosmic flip! Wheee! 💫",
      "Boop! If you touch my nose, I'll sneeze a shooting star! 🐈✨",
      "Hehe! If you keep clicking, I might get dizzy! 😵‍💫",
      "Stop that! If you tickle my ears, they twitch! 😂",
      "Kawaii! If I were any cuter, the universe would explode! 💖",
      "If you love grammar as much as I do, we're soul-mates! 🐾",
      "Zzz... if you stop clicking, I'll dream of fish-shaped nebulae...",
      "If you rub my chin, I might share my space-nip! 🌿",
      "Hey! If you pull my tail, I'll turn into a black hole! Just kidding!",
      "If you tickle my tummy, I will laugh like a quasar!"
    ]
  };

  const triggerBubble = (msg: string) => {
    setMessage(msg);
    setShowBubble(true);
    if (bubbleTimeoutRef.current) window.clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = window.setTimeout(() => {
      setShowBubble(false);
    }, 8000);
  };

  const getRandomComment = (poolKey: keyof typeof commentPools) => {
    const pool = commentPools[poolKey];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  useEffect(() => {
    const blinkLoop = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(blinkLoop);
  }, []);

  useEffect(() => {
    if (isFlipping) return;
    
    let poolKey: keyof typeof commentPools = "Home";
    let newExpression: Expression = "happy";

    if (currentContext.includes('Zero')) { poolKey = "Zero"; newExpression = "starry"; }
    else if (currentContext.includes('First')) { poolKey = "First"; newExpression = "excited"; }
    else if (currentContext.includes('Second')) { poolKey = "Second"; newExpression = "thinking"; }
    else if (currentContext.includes('Third')) { poolKey = "Third"; newExpression = "sad"; }
    else if (currentContext.includes('Mixed')) { poolKey = "Mixed"; newExpression = "starry"; }
    else if (currentContext === 'Home') { poolKey = "Home"; newExpression = "idle"; }
    else { poolKey = "Overall"; newExpression = "winking"; }

    const comment = getRandomComment(poolKey);
    // Special condition for 'cute' context
    if (comment.toLowerCase().includes('kawaii') || comment.toLowerCase().includes('cute')) {
      newExpression = "love";
    }

    triggerBubble(comment);
    setExpression(newExpression);
  }, [currentContext]);

  const handleTickle = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setExpression("excited");
    triggerBubble(getRandomComment("Interaction"));
    
    setTimeout(() => {
      setIsFlipping(false);
      setExpression("dizzy");
      setTimeout(() => {
        if (currentContext.includes('Third')) setExpression("sad");
        else if (currentContext.includes('Second')) setExpression("thinking");
        else if (currentContext.includes('Zero') || currentContext.includes('Mixed')) setExpression("starry");
        else if (currentContext.includes('Overall')) setExpression("winking");
        else setExpression("idle");
      }, 3000);
    }, 850);
  };

  const isShow = (exprs: Expression[]) => exprs.includes(expression) ? 1 : 0;
  
  // Logic to determine if standard pupil highlights should be visible
  const shouldShowPupilHighlights = () => 
    !["love", "sad", "pouting", "sleepy", "dizzy", "winking", "starry"].includes(expression);

  return (
    <div className={`mascot-wrapper ${isFlipping ? 'flip-action' : (expression === 'thinking' ? 'expression-thinking' : 'nebula-float-idle')}`}>
      <div className={`speech-bubble ${showBubble ? 'bubble-visible' : 'bubble-hidden'}`}>
        <p className="text-sm font-black text-slate-800 leading-tight text-center">
          {message}
        </p>
        <div className="bubble-tail" />
      </div>

      <div className="mascot-container" onClick={handleTickle}>
        <svg viewBox="0 0 500 500" className="w-full h-full nebula-svg">
          <defs>
            <radialGradient id="eye-galaxy">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="65%" stopColor="#6d28d9" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>

          {/* CUTE EARS */}
          <g className="ear-group">
            <path className="ear-path left-ear" d="M170,230 C130,120 220,130 240,200" fill="white" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            <path d="M185,215 C165,150 210,160 225,195" fill="#fda4af" opacity="0.4" />
            <path className="ear-path right-ear" d="M330,230 C370,120 280,130 260,200" fill="white" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            <path d="M315,215 C335,150 290,160 275,195" fill="#fda4af" opacity="0.4" />
          </g>

          {/* MAIN BODY / HEAD */}
          <circle cx="250" cy="285" r="110" fill="white" stroke="#1e293b" strokeWidth="10" />
          
          <circle cx="250" cy="285" r="145" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="4" className="helmet-glass" />

          <g className="blush-layer" opacity={isShow(["shy", "happy", "love", "excited", "laugh"]) ? 0.7 : 0.2}>
            <circle cx="180" cy="335" r="15" fill="#fda4af" />
            <circle cx="320" cy="335" r="15" fill="#fda4af" />
          </g>

          <g className="eyes-master-group">
            {/* LEFT EYE */}
            <g transform="translate(190, 290)" className="eye-group">
              {/* PERMANENT LARGE BLACK IRIS - ALWAYS VISIBLE */}
              <ellipse cx="0" cy="0" rx="38" ry="48" fill="#000000" />
              
              <g opacity={expression === 'starry' || shouldShowPupilHighlights() ? 1 : 0}>
                {/* Subtle Galaxy Shimmer */}
                <ellipse cx="0" cy="4" rx="32" ry="42" fill="url(#eye-galaxy)" opacity="0.3" />
                
                {/* Star shape for starry expression */}
                <g opacity={expression === 'starry' ? 1 : 0} transform="translate(0, 4)"><StarShape /></g>
                
                {/* Pupil sparkles - standard state */}
                <g opacity={shouldShowPupilHighlights() ? 1 : 0}>
                  <circle cx="-15" cy="-18" r="12" fill="white" className="galaxy-sparkle" />
                  <circle cx="18" cy="20" r="6" fill="white" opacity="0.8" />
                </g>
              </g>

              {/* Special Features layered over black iris */}
              <g opacity={expression === 'love' ? 1 : 0} transform="translate(0, 4)"><HeartShape /></g>
              <g opacity={expression === 'dizzy' ? 1 : 0}><DizzySwirl /></g>
              <path opacity={isShow(["sad", "pouting"]) ? 1 : 0} d="M-22,5 Q0,-20 22,5" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
              <rect opacity={expression === 'cool' ? 1 : 0} x="-38" y="-12" width="76" height="24" rx="8" fill="#1e293b" stroke="white" strokeWidth="2" />
              <path opacity={isShow(["sleepy", "winking"]) ? 1 : 0} d="M-22,8 Q0,-5 22,8" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
              
              <g className="blink-layer" opacity={isBlinking ? 1 : 0}>
                <ellipse cx="0" cy="0" rx="40" ry="50" fill="white" />
                <path d="M-30,5 Q0,25 30,5" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
              </g>
            </g>

            {/* RIGHT EYE */}
            <g transform="translate(310, 290)" className="eye-group">
              {/* PERMANENT LARGE BLACK IRIS */}
              <ellipse cx="0" cy="0" rx="38" ry="48" fill="#000000" />
              
              <g opacity={expression !== 'winking' && (expression === 'starry' || shouldShowPupilHighlights()) ? 1 : 0}>
                <ellipse cx="0" cy="4" rx="32" ry="42" fill="url(#eye-galaxy)" opacity="0.3" />
                <g opacity={expression === 'starry' ? 1 : 0} transform="translate(0, 4)"><StarShape /></g>
                <g opacity={shouldShowPupilHighlights() ? 1 : 0}>
                  <circle cx="-15" cy="-18" r="12" fill="white" className="galaxy-sparkle" />
                  <circle cx="18" cy="20" r="6" fill="white" opacity="0.8" />
                </g>
              </g>

              <g opacity={expression === 'love' ? 1 : 0} transform="translate(0, 4)"><HeartShape /></g>
              <g opacity={expression === 'dizzy' ? 1 : 0}><DizzySwirl /></g>
              <path opacity={isShow(["sad", "pouting"]) ? 1 : 0} d="M-22,5 Q0,-20 22,5" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
              <rect opacity={expression === 'cool' ? 1 : 0} x="-38" y="-12" width="76" height="24" rx="8" fill="#1e293b" stroke="white" strokeWidth="2" />
              <path opacity={isShow(["sleepy", "winking"]) ? 1 : 0} d="M-22,8 Q0,-5 22,8" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
              
              <g className="blink-layer" opacity={isBlinking ? 1 : 0}>
                <ellipse cx="0" cy="0" rx="40" ry="50" fill="white" />
                <path d="M-30,5 Q0,25 30,5" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
              </g>
            </g>
          </g>

          {/* MOUTH */}
          <g transform="translate(250, 360)" className="mouth-group">
            <path opacity={isShow(["idle", "happy", "shy", "starry", "cool", "sleepy", "winking", "dizzy"]) ? 1 : 0} d="M-18,-2 Q-10,12 0,-2 Q10,12 18,-2" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <path opacity={isShow(["laugh", "excited", "love"]) ? 1 : 0} d="M-15,-2 Q0,24 15,-2 Z" fill="#fda4af" stroke="#1e293b" strokeWidth="4" />
            <path opacity={isShow(["sad", "pouting"]) ? 1 : 0} d="M-12,14 Q0,0 12,14" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <g opacity={expression === 'tongue-out' ? 1 : 0}>
               <path d="M-15,-2 Q0,10 15,-2" fill="none" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
               <rect x="-8" y="2" width="16" height="20" rx="8" fill="#ff71cf" stroke="#1e293b" strokeWidth="2" className="tongue-wiggle" />
            </g>
          </g>

          {/* BELL & COLLAR */}
          <path d="M190,385 Q250,420 310,385" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeLinecap="round" />
          <circle cx="250" cy="415" r="18" fill="#fbbf24" className="bell-pulse" />
          <path d="M250,407 L252,412 L258,414 L252,416 L250,421 L248,416 L242,414 L248,412 Z" fill="white" />
        </svg>

        {isFlipping && (
          <div className="star-trail">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`trail-particle p${i}`}>✨</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

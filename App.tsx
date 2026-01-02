
import React, { useState, useEffect, useRef } from 'react';
import Mascot from './components/Mascot';
import Quiz from './components/Quiz';
import { LESSONS } from './data';
import { ConditionalType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConditionalType>('Master Guide');
  const [showQuiz, setShowQuiz] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  const tabs: ConditionalType[] = [
    'Master Guide', 'Zero', 'First', 'Second', 'Third', 
    'Mixed Conditional 1', 'Mixed Conditional 2', 'Overall'
  ];

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Tab switching: Keys 1-8
      const keyNum = parseInt(e.key);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= tabs.length) {
        setActiveTab(tabs[keyNum - 1]);
        setShowQuiz(false);
      }

      // Exit quiz: Escape
      if (e.key === 'Escape' && showQuiz) {
        setShowQuiz(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showQuiz, tabs.length]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (activeTab === 'Master Guide' && !showQuiz) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (mainContentRef.current) {
        mainContentRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }, [activeTab, showQuiz]);

  const getThemeColorClass = (type: string) => {
    if (type === 'Zero') return 'glass-glow-teal';
    if (type === 'First') return 'glass-glow-peach';
    if (type === 'Second') return 'glass-glow-lavender';
    if (type === 'Third') return 'glass-glow-peach';
    return 'glass-glow-teal';
  };

  const NavButton = ({ type, label, index }: { type: ConditionalType, label: string, index: number }) => (
    <button
      onClick={() => { setActiveTab(type); setShowQuiz(false); }}
      className={`group relative px-6 py-3 rounded-full font-black transition-all duration-500 text-sm whitespace-nowrap shadow-xl border-2 ${
        activeTab === type 
          ? 'bg-teal-500 text-white border-white scale-110 shadow-teal-500/40' 
          : 'bg-white/10 text-white border-white/20 hover:bg-white/30 hover:border-teal-300'
      }`}
    >
      <span className="mr-1">{label}</span>
      <span className="absolute -top-2 -right-2 bg-indigo-950 text-white text-[8px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
        {index + 1}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="w-full pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <div className="group flex flex-col items-center gap-3 mb-6">
          <div className="bg-indigo-500/30 text-indigo-100 px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.4em] shadow-lg border-2 border-indigo-400/50 backdrop-blur-md transition-all hover:bg-indigo-500/40">
            ✨ Grammar Galaxy ✨
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            By Shalaka Kashikar
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300/40 md:hidden">
            By Shalaka Kashikar
          </span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-6 heading-shadow text-glow leading-none">
          Conditionals
        </h1>
        <p className="text-indigo-100 font-black max-w-xl text-2xl italic opacity-95 text-glow">
          Navigate the orbits of logic and time.
        </p>
      </header>

      {/* Navigation */}
      <div className="w-full sticky top-6 z-40 px-4 flex justify-center">
        <nav className="glass p-3 rounded-[3.5rem] flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar shadow-2xl bg-white/10 backdrop-blur-xl border-white/40">
          <NavButton type="Master Guide" label="Master Guide 🛠️" index={0} />
          <NavButton type="Zero" label="Type 0" index={1} />
          <NavButton type="First" label="Type 1" index={2} />
          <NavButton type="Second" label="Type 2" index={3} />
          <NavButton type="Third" label="Type 3" index={4} />
          <NavButton type="Mixed Conditional 1" label="Mixed 1" index={5} />
          <NavButton type="Mixed Conditional 2" label="Mixed 2" index={6} />
          <button
            onClick={() => { setActiveTab('Overall'); setShowQuiz(false); }}
            className={`group relative px-8 py-3 rounded-full font-black transition-all duration-300 text-sm whitespace-nowrap ml-2 shadow-xl border-2 ${
              activeTab === 'Overall' 
                ? 'bg-orange-500 text-white border-white scale-105' 
                : 'bg-orange-600/80 text-white border-orange-400/40 hover:bg-orange-500'
            }`}
          >
            Final Exam 🏆
            <span className="absolute -top-2 -right-2 bg-indigo-950 text-white text-[8px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
              8
            </span>
          </button>
        </nav>
      </div>

      <main 
        ref={mainContentRef}
        className="w-full max-w-5xl px-6 mt-16 relative z-10 min-h-[75vh] scroll-mt-32 transition-all duration-500 ease-in-out"
      >
        {showQuiz ? (
          <Quiz type={activeTab} onClose={() => setShowQuiz(false)} />
        ) : activeTab === 'Master Guide' ? (
          <div className="space-y-12 animate-scale">
            <div className="glass p-12 md:p-16 rounded-[4rem] border-white shadow-2xl">
               <h2 className="text-5xl font-black text-indigo-950 mb-8 border-b-4 border-indigo-100 pb-4 inline-block">The Logic Blueprint ✨</h2>
               <p className="text-2xl text-slate-900 leading-relaxed font-black mb-10">
                Conditionals connect a <b>Condition</b> (If-clause) to a <b>Result</b> (Main-clause). 
                They are the mathematical "If-Then" formulas of the English language.
               </p>
               <div className="p-10 bg-indigo-50 rounded-[3rem] border-4 border-indigo-200 flex flex-col md:flex-row gap-8 items-center justify-center text-center shadow-inner">
                  <div className="flex-1">
                     <span className="text-sm font-black uppercase text-orange-600 tracking-widest block mb-3">If this is true...</span>
                     <p className="text-3xl font-black text-indigo-950 italic">"If we study together..."</p>
                  </div>
                  <div className="text-6xl text-indigo-300 animate-pulse">➔</div>
                  <div className="flex-1">
                     <span className="text-sm font-black uppercase text-teal-600 tracking-widest block mb-3">...this happens next!</span>
                     <p className="text-3xl font-black text-indigo-950 italic">"...we will pass!"</p>
                  </div>
               </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-[4rem] border-l-[16px] border-teal-500 bg-white shadow-xl">
               <h3 className="text-4xl font-black text-slate-950 mb-8">💡 The Distance Principle</h3>
               <p className="text-2xl text-slate-900 mb-10 font-black">
                 Grammar moves "one step back" as reality fades away.
               </p>
               <div className="overflow-hidden rounded-[2.5rem] border-4 border-indigo-50 bg-white shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-indigo-950 text-white">
                      <tr>
                        <th className="p-6 text-sm font-black uppercase tracking-widest">Reality Level</th>
                        <th className="p-6 text-sm font-black uppercase tracking-widest">Type</th>
                        <th className="p-6 text-sm font-black uppercase tracking-widest">Verb Tense Shift</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-50 font-black text-indigo-950 text-xl">
                      <tr className="bg-teal-50/60"><td className="p-6">100% Fact</td><td className="p-6 italic text-teal-700">Type 0</td><td className="p-6">Present Simple</td></tr>
                      <tr><td className="p-6">Possible Future</td><td className="p-6 italic text-orange-600">Type 1</td><td className="p-6">Present → Will</td></tr>
                      <tr className="bg-purple-50/60"><td className="p-6">Unreal Present</td><td className="p-6 italic text-purple-700">Type 2</td><td className="p-6">Past Simple → Would</td></tr>
                      <tr><td className="p-6">Impossible Past</td><td className="p-6 italic text-pink-600">Type 3</td><td className="p-6">Past Perfect → Would Have</td></tr>
                    </tbody>
                  </table>
               </div>
            </div>

            {/* NEW SECTION: The Logic Evolution */}
            <div className="glass p-12 md:p-16 rounded-[4rem] bg-white border-4 border-slate-100 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60 -mr-32 -mt-32"></div>
              <h3 className="text-4xl font-black text-slate-950 mb-4 flex items-center gap-4 relative z-10">
                <span className="text-5xl">🚗</span> The Logic Evolution
              </h3>
              <p className="text-xl text-slate-500 mb-12 font-bold italic relative z-10">Watch how one story changes as we travel away from reality...</p>
              
              <div className="space-y-6 relative z-10">
                {[
                  { type: 'Type 0', label: 'THE LAW', text: 'If you win the lottery, you become rich.', mood: '💯 General Fact', color: 'border-teal-400 bg-teal-50/30' },
                  { type: 'Type 1', label: 'THE PLAN', text: 'If I win the lottery tomorrow, I will buy a car.', mood: '🗓️ Real Possibility', color: 'border-orange-400 bg-orange-50/30' },
                  { type: 'Type 2', label: 'THE DREAM', text: 'If I won the lottery today, I would buy a car.', mood: '🦄 Imaginary Now', color: 'border-purple-400 bg-purple-50/30' },
                  { type: 'Type 3', label: 'THE REGRET', text: 'If I had won the lottery yesterday, I would have bought a car.', mood: '⌛ Impossible Past', color: 'border-pink-400 bg-pink-50/30' },
                  { type: 'Mixed', label: 'THE BRIDGE', text: 'If I had won the lottery then, I would be rich now.', mood: '🧩 Past ➔ Present', color: 'border-indigo-400 bg-indigo-50/30' }
                ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border-4 ${item.color} transition-all hover:scale-[1.01] hover:shadow-lg flex flex-col md:flex-row md:items-center gap-6`}>
                    <div className="flex flex-col min-w-[140px]">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.type}</span>
                      <span className="text-xl font-black text-slate-900">{item.label}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-indigo-950 italic">"{item.text}"</p>
                    </div>
                    <div className="px-5 py-2 rounded-full bg-white/60 border border-white text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm whitespace-nowrap">
                      {item.mood}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-[4rem] bg-indigo-950 border-4 border-indigo-400 text-white shadow-2xl">
               <h3 className="text-4xl font-black mb-12 flex items-center gap-4">
                 <span className="text-5xl">🧠</span> The 5-Step Logic Matrix
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { step: 1, title: 'Always True?', text: 'Scientific facts or habits? Use Type 0.', color: 'border-teal-400' },
                   { step: 2, title: 'Possible Future?', text: 'A real plan or warning? Use Type 1.', color: 'border-orange-400' },
                   { step: 3, title: 'Hypothetical Now?', text: 'Imaginary dreaming? Use Type 2.', color: 'border-purple-400' },
                   { step: 4, title: 'Finished Past?', text: 'Regrets or missed chances? Use Type 3.', color: 'border-pink-400' },
                   { step: 5, title: 'Time Jumping?', text: 'Past action affecting now? Use Mixed.', color: 'border-indigo-300' },
                   { step: '!', title: 'Signal Words', text: 'Check for "Yesterday", "Now", or "Tomorrow".', color: 'border-white' }
                 ].map((box, i) => (
                   <div key={i} className={`p-8 rounded-[2.5rem] border-4 ${box.color} bg-white/5 backdrop-blur-sm`}>
                     <div className="flex items-center gap-4 mb-3">
                       <span className="w-10 h-10 rounded-full bg-white text-indigo-950 flex items-center justify-center font-black">{box.step}</span>
                       <h4 className="text-xl font-black tracking-tight">{box.title}</h4>
                     </div>
                     <p className="text-indigo-100/80 font-bold leading-snug">{box.text}</p>
                   </div>
                 ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
               <div className="glass p-12 rounded-[4rem] bg-white border-4 border-indigo-100 shadow-xl">
                 <h4 className="font-black text-indigo-700 uppercase tracking-[0.3em] text-sm mb-8">🎩 Master Style: Inversion</h4>
                 <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                     <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Formal Type 2</p>
                     <p className="text-xl font-black text-indigo-950">"Were I rich, I would go."</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                     <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Formal Type 3</p>
                     <p className="text-xl font-black text-indigo-950">"Had I known, I would have stayed."</p>
                   </div>
                 </div>
               </div>
               <div className="glass p-12 rounded-[4rem] bg-white border-4 border-teal-100 shadow-xl">
                 <h4 className="font-black text-teal-700 uppercase tracking-[0.3em] text-sm mb-8">🧩 Condition Connectors</h4>
                 <div className="space-y-4">
                    {[
                      { w: 'Unless', d: 'If... not', ex: 'Unless you pay, you leave.' },
                      { w: 'Provided', d: 'Only if', ex: 'I\'ll go provided you stay.' },
                      { w: 'Otherwise', d: 'If not', ex: 'Study! Otherwise you fail.' }
                    ].map(item => (
                      <div key={item.w} className="flex justify-between items-center p-4 border-b-2 border-teal-50">
                        <span className="font-black text-indigo-900 text-lg">{item.w}</span>
                        <span className="text-xs font-black text-slate-400 italic">"{item.ex}"</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
               <div className="bg-teal-50 p-12 rounded-[4rem] border-4 border-teal-200 shadow-xl">
                  <h4 className="font-black text-teal-800 mb-8 uppercase text-sm tracking-[0.3em] flex items-center gap-3">
                    <span className="text-3xl">⭐</span> PRO TIPS
                  </h4>
                  <ul className="space-y-4 text-lg text-indigo-900 font-black">
                    <li>✨ Look at the RESULT clause first to narrow types.</li>
                    <li>✨ "If" and "When" are ONLY equal in Type 0.</li>
                    <li>✨ Check for "Yesterday" to spot Type 3 or Mixed.</li>
                  </ul>
               </div>
               <div className="bg-red-50 p-12 rounded-[4rem] border-4 border-red-200 shadow-xl">
                  <h4 className="font-black text-red-700 mb-8 uppercase text-sm tracking-[0.3em] flex items-center gap-3">
                    <span className="text-3xl">🚩</span> WATCH OUT!
                  </h4>
                  <ul className="space-y-4 text-lg text-red-900 font-black italic">
                    <li>❌ "If I will..." is almost always wrong!</li>
                    <li>❌ "If I would have..." is a major trap!</li>
                    <li>❌ Missing the comma when "If" starts the sentence.</li>
                  </ul>
               </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setActiveTab('Zero')}
                className="w-full bg-teal-500 text-white py-12 rounded-[4rem] font-black text-4xl hover:bg-teal-600 transition-all shadow-2xl active:scale-95 border-b-8 border-teal-800"
              >
                Begin the Lesson Path ➔
              </button>
            </div>
          </div>
        ) : activeTab === 'Overall' ? (
          <div key="overall" className="space-y-12 animate-scale">
            <div className="glass p-12 md:p-16 rounded-[4rem] border-4 border-orange-400 shadow-orange-500/30 bg-white">
               <h2 className="text-5xl font-black text-slate-950 mb-12 flex items-center gap-6">
                 <span className="text-orange-500 text-6xl drop-shadow-xl">📒</span> The Final Cheat Sheet
               </h2>
               <div className="grid gap-6">
                 {[
                   { type: 'Type 0', name: 'Facts', formula: 'Present + Present' },
                   { type: 'Type 1', name: 'Plans', formula: 'Present + Will' },
                   { type: 'Type 2', name: 'Dreams', formula: 'Past + Would' },
                   { type: 'Type 3', name: 'Regret', formula: 'Had V3 + Would Have V3' },
                   { type: 'Mixed 1', name: 'Time Glitch 1', formula: 'Had V3 + Would' },
                   { type: 'Mixed 2', name: 'Time Glitch 2', formula: 'Past + Would Have V3' }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[3rem] border-4 border-indigo-50 shadow-xl hover:scale-[1.01] transition-transform">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                         <span className="font-black text-orange-600 text-2xl whitespace-nowrap">{item.type}</span>
                         <span className="font-black text-indigo-950 text-2xl">{item.name}</span>
                      </div>
                      <code className="bg-indigo-900 px-8 py-3 rounded-2xl text-teal-300 font-mono text-xl font-black border-b-4 border-indigo-950">{item.formula}</code>
                   </div>
                 ))}
               </div>
            </div>

            <button 
                onClick={() => setShowQuiz(true)}
                className="w-full bg-orange-500 text-white py-12 rounded-[4rem] font-black text-5xl hover:bg-orange-600 transition-all shadow-2xl active:scale-95 border-b-8 border-orange-800"
              >
                Start Final Exam 🏁
            </button>
          </div>
        ) : (
          <div key={activeTab} className="animate-scale">
            {LESSONS.filter(l => l.type === activeTab).map(lesson => (
              <div key={lesson.type} className={`glass p-12 md:p-16 rounded-[4rem] border-4 ${getThemeColorClass(lesson.type)} bg-white shadow-2xl`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[3rem] bg-indigo-950 flex items-center justify-center text-5xl shadow-2xl border-4 border-indigo-400">
                      {lesson.type.includes('Zero') ? '🍭' : lesson.type.includes('First') ? '🎀' : lesson.type.includes('Second') ? '🦄' : '🧸'}
                    </div>
                    <div>
                      <h2 className="text-6xl font-black text-indigo-950 tracking-tight">{lesson.type}</h2>
                      <p className="text-teal-600 font-black uppercase tracking-[0.4em] text-sm mt-1">
                        {lesson.type.toLowerCase().includes('conditional') ? lesson.type : `${lesson.type} Conditional`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-6 py-3 rounded-full bg-indigo-950 text-white text-sm font-black uppercase tracking-widest shadow-lg border-2 border-indigo-400">
                      {lesson.realityLevel}
                    </span>
                    <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
                       {lesson.timeline}
                    </span>
                  </div>
                </div>

                <div className="space-y-16">
                  <section>
                    <div className="mb-4 text-xs font-black text-indigo-500 uppercase tracking-widest">The Core Vibe</div>
                    <p className="text-5xl text-indigo-950 leading-tight font-black mb-6">
                      "{lesson.vibe}"
                    </p>
                    <p className="text-2xl text-slate-900 font-black italic border-l-[12px] border-teal-500 pl-8 py-4 bg-teal-50/40 rounded-r-3xl">
                      {lesson.meaning}
                    </p>
                  </section>

                  <section>
                    <div className="mb-8 text-xs font-black text-indigo-500 uppercase tracking-widest">The Conditional Formula</div>
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                      <div className="flex-1 bg-orange-50 p-12 rounded-[3.5rem] border-4 border-orange-200 shadow-xl">
                        <div className="text-sm font-black uppercase text-orange-600 tracking-widest mb-6">IF PART (The Condition)</div>
                        <div className="font-mono text-3xl text-orange-800 font-black">{lesson.formula.ifPart}</div>
                      </div>
                      <div className="flex items-center justify-center text-indigo-100 text-7xl font-black">,</div>
                      <div className="flex-1 bg-teal-50 p-12 rounded-[3.5rem] border-4 border-teal-200 shadow-xl">
                        <div className="text-sm font-black uppercase text-teal-600 tracking-widest mb-6">OUTCOME (The Result)</div>
                        <div className="font-mono text-3xl text-teal-800 font-black">{lesson.formula.resultPart}</div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="mb-8 text-xs font-black text-indigo-500 uppercase tracking-widest">Real-World Examples</div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {lesson.examples.map((ex, i) => (
                        <div key={i} className="flex flex-col gap-4 p-8 rounded-[3rem] bg-white border-4 border-indigo-100 hover:border-teal-400 transition-all group shadow-xl hover:scale-[1.02]">
                          <span className="px-5 py-2 rounded-full bg-orange-200 text-sm font-black text-orange-800 uppercase tracking-widest w-fit border-2 border-orange-300">
                            {ex.label}
                          </span>
                          <span className="text-indigo-950 text-2xl font-black italic leading-snug">"{ex.text}"</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="grid md:grid-cols-2 gap-10">
                    {lesson.proTips && (
                      <div className="bg-teal-50 p-12 rounded-[4rem] border-4 border-teal-200 shadow-xl">
                        <h4 className="font-black text-teal-800 mb-8 uppercase text-sm tracking-[0.3em] flex items-center gap-3">
                          <span className="text-3xl">⭐</span> MASTER TIPS
                        </h4>
                        <ul className="space-y-6">
                          {lesson.proTips.map((tip, i) => (
                            <li key={i} className="text-xl text-indigo-900 font-black flex gap-4">
                              <span className="text-teal-500 text-2xl">✨</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lesson.commonMistakes && (
                      <div className="bg-red-50 p-12 rounded-[4rem] border-4 border-red-200 shadow-xl">
                        <h4 className="font-black text-red-700 mb-8 uppercase text-sm tracking-[0.3em] flex items-center gap-3">
                          <span className="text-3xl">🚩</span> WATCH OUT!
                        </h4>
                        <ul className="space-y-6">
                          {lesson.commonMistakes.map((mistake, i) => (
                            <li key={i} className="text-xl text-red-900 font-black italic leading-relaxed">
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-12 flex flex-col md:flex-row gap-8">
                    <button 
                      onClick={() => setShowQuiz(true)}
                      className="flex-1 bg-teal-500 text-white py-12 rounded-[4rem] font-black text-5xl hover:bg-teal-600 transition-all hover:scale-[1.02] shadow-2xl border-b-8 border-teal-800"
                    >
                      PRACTICE! 🦄
                    </button>
                    <button 
                      onClick={() => {
                        const idx = LESSONS.findIndex(l => l.type === activeTab);
                        if (idx < LESSONS.length - 1) setActiveTab(LESSONS[idx + 1].type);
                        else setActiveTab('Overall');
                      }}
                      className="px-14 py-12 rounded-[4rem] bg-indigo-950 text-white font-black text-2xl hover:bg-black transition-all border-4 border-indigo-400 shadow-xl"
                    >
                      NEXT ➔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto py-24 text-white text-center relative z-10 flex flex-col items-center gap-8">
        <div className="h-2 w-48 bg-white/20 rounded-full shadow-lg"></div>
        <p className="font-black text-white/60 uppercase tracking-[0.6em] text-sm text-glow">By Shalaka Kashikar</p>
        <p className="text-lg font-black italic text-white/40 max-w-lg leading-relaxed">"Conditionals are mirrors of how we think about reality, possibility, imagination, and regret."</p>
      </footer>

      <Mascot currentContext={activeTab} />
    </div>
  );
};

export default App;

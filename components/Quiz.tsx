
import React, { useState, useEffect, useRef } from 'react';
import { Question, ConditionalType } from '../types';
import { QUESTIONS } from '../data';

interface QuizProps {
  type: ConditionalType;
  onClose: () => void;
}

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Quiz({ type, onClose }: QuizProps) {
  // Setup State
  const [isSetup, setIsSetup] = useState(true);
  const [targetDifficulty, setTargetDifficulty] = useState<DifficultyFilter>('All');
  const [targetCount, setTargetCount] = useState<number>(10);

  // Active Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | string | undefined)[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  const quizTopRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const fillInputRef = useRef<HTMLInputElement>(null);

  // Scroll Logic
  useEffect(() => {
    if (quizTopRef.current) {
      requestAnimationFrame(() => {
        quizTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [currentIndex, isSetup, showResult, showReview]);

  useEffect(() => {
    if (hasAnswered && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [hasAnswered]);

  // Keyboard Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;

      if (isSetup && e.key === 'Enter') {
        startQuiz();
        return;
      }

      if (showResult && !showReview) {
        if (e.key === 'Enter') onClose();
        if (e.key.toLowerCase() === 'r') setShowReview(true);
        if (e.key.toLowerCase() === 'a') {
          setShowResult(false);
          setIsSetup(true);
        }
        return;
      }

      if (showReview) {
        if (e.key === 'Enter' || e.key === 'Escape') setShowReview(false);
        return;
      }

      if (!isSetup && !showResult) {
        const currentQ = activeQuestions[currentIndex];

        if (!hasAnswered && !isTyping && (currentQ.questionType === 'multiple-choice' || currentQ.questionType === 'boolean')) {
          const keyNum = parseInt(e.key);
          if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= (currentQ.options?.length || 0)) {
            const idx = keyNum - 1;
            setSelectedOption(idx);
            checkAnswer(idx);
            return;
          }
        }

        if (e.key === 'Enter') {
          if (!hasAnswered) {
            if (currentQ.questionType === 'fill-blank' && fillValue.trim()) {
              checkAnswer(fillValue);
            }
          } else {
            nextQuestion();
          }
          return;
        }

        if (e.key === 'ArrowRight' && hasAnswered) {
          nextQuestion();
          return;
        }

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          prevQuestion();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSetup, showResult, showReview, currentIndex, hasAnswered, fillValue, activeQuestions]);

  const startQuiz = () => {
    let finalSelection: Question[] = [];
    if (type === 'Overall') {
      const special = QUESTIONS.filter(q => q.type === 'Overall');
      const others = QUESTIONS.filter(q => q.type !== 'Overall');
      const filteredSpecial = targetDifficulty === 'All' ? special : special.filter(q => q.difficulty === targetDifficulty);
      const filteredOthers = targetDifficulty === 'All' ? others : others.filter(q => q.difficulty === targetDifficulty);
      const shuffledSpecial = shuffleArray(filteredSpecial);
      const shuffledOthers = shuffleArray(filteredOthers);
      const idealCount = Math.max(2, Math.floor(targetCount * 0.3));
      const actualSpecial = Math.min(shuffledSpecial.length, idealCount);
      const actualOthers = Math.min(shuffledOthers.length, targetCount - actualSpecial);
      finalSelection = shuffleArray([...shuffledSpecial.slice(0, actualSpecial), ...shuffledOthers.slice(0, actualOthers)]);
    } else {
      let pool = QUESTIONS.filter(q => q.type === type);
      if (targetDifficulty !== 'All') pool = pool.filter(q => q.difficulty === targetDifficulty);
      finalSelection = shuffleArray(pool).slice(0, targetCount);
    }

    const randomized = finalSelection.map(q => {
      if ((q.questionType === 'multiple-choice' || q.questionType === 'boolean') && q.options) {
        const orig = [...q.options];
        const correctText = orig[q.correctAnswer as number];
        const shuffled = shuffleArray(orig);
        return { ...q, options: shuffled, correctAnswer: shuffled.indexOf(correctText) };
      }
      return q;
    });

    setActiveQuestions(randomized);
    setUserAnswers(new Array(randomized.length).fill(undefined));
    setCurrentIndex(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedOption(null);
    setFillValue("");
    setIsSetup(false);
    setShowResult(false);
    setShowReview(false);
  };

  const currentQuestion = activeQuestions[currentIndex];

  const checkAnswer = (answer: number | string) => {
    if (hasAnswered) return;
    let isCorrect = false;
    if (currentQuestion.questionType === 'fill-blank') {
      isCorrect = String(answer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
    } else {
      isCorrect = answer === currentQuestion.correctAnswer;
    }
    setHasAnswered(true);
    const updated = [...userAnswers];
    updated[currentIndex] = answer;
    setUserAnswers(updated);
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      const n = currentIndex + 1;
      setCurrentIndex(n);
      syncState(n);
    } else setShowResult(true);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      const p = currentIndex - 1;
      setCurrentIndex(p);
      syncState(p);
    }
  };

  const syncState = (idx: number) => {
    const ans = userAnswers[idx];
    const q = activeQuestions[idx];
    if (ans !== undefined) {
      setHasAnswered(true);
      if (q.questionType === 'fill-blank') {
        setFillValue(ans as string);
        setSelectedOption(null);
      } else {
        setSelectedOption(ans as number);
        setFillValue("");
      }
    } else {
      setHasAnswered(false);
      setSelectedOption(null);
      setFillValue("");
    }
  };

  // UI Component: Structured Insight Card
  const InsightPoints = ({ text }: { text: string }) => {
    const parts = text.split('\n\n').filter(p => p.trim());
    
    return (
      <div className="space-y-4">
        {parts.map((part, i) => {
          let title = "Logic Point";
          let icon = "✨";
          let bgColor = "bg-slate-50";
          let textColor = "text-slate-900";
          let accentColor = "text-slate-500";
          let borderColor = "border-slate-200";

          if (part.toLowerCase().includes('conditional type:')) {
            title = "Conditional Class";
            icon = "🏷️";
            bgColor = "bg-indigo-50";
            textColor = "text-indigo-900";
            accentColor = "text-indigo-500";
            borderColor = "border-indigo-100";
          } else if (part.toLowerCase().includes('why it applies:')) {
            title = "The Logic Goal";
            icon = "🧠";
            bgColor = "bg-amber-50";
            textColor = "text-amber-900";
            accentColor = "text-amber-600";
            borderColor = "border-amber-100";
          } else if (part.toLowerCase().includes('grammar recipe:')) {
            title = "The Formula";
            icon = "⚙️";
            bgColor = "bg-teal-50";
            textColor = "text-teal-900";
            accentColor = "text-teal-600";
            borderColor = "border-teal-100";
          }

          const cleanText = part.split(':').slice(1).join(':').trim();

          return (
            <div key={i} className={`p-6 rounded-[2.5rem] border-2 shadow-sm ${bgColor} ${borderColor} transition-all hover:shadow-md`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor}`}>{title}</span>
              </div>
              <p className={`text-xl font-bold leading-snug ${textColor}`}>{cleanText || part}</p>
            </div>
          );
        })}
      </div>
    );
  };

  if (isSetup) {
    const counts = [5, 10, 20, 30, 40, 50];
    const diffs: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard'];
    return (
      <div ref={quizTopRef} className="glass p-12 md:p-16 rounded-[4rem] max-w-2xl w-full mx-auto animate-scale border-white shadow-2xl bg-white scroll-mt-32">
        <h2 className="text-5xl font-black text-indigo-950 mb-10 text-center">Quiz Setup ✨</h2>
        <div className="space-y-12">
          <section>
            <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Select Intensity Level</p>
            <div className="grid grid-cols-2 gap-4">
              {diffs.map(d => (
                <button key={d} onClick={() => setTargetDifficulty(d)} className={`py-6 rounded-[2rem] font-black text-xl transition-all border-4 ${targetDifficulty === d ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl scale-105' : 'bg-white text-indigo-900 border-slate-100 hover:border-indigo-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Question Count</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {counts.map(c => (
                <button key={c} onClick={() => setTargetCount(c)} className={`py-4 rounded-[1.5rem] font-black text-lg transition-all border-4 ${targetCount === c ? 'bg-teal-500 text-white border-teal-300 shadow-lg scale-110' : 'bg-slate-50 text-slate-400 border-transparent hover:border-teal-100'}`}>
                  {c}
                </button>
              ))}
            </div>
          </section>
          <div className="pt-8 flex flex-col gap-4">
            <button onClick={startQuiz} className="group relative w-full py-10 bg-teal-500 text-white rounded-[4rem] font-black text-3xl shadow-2xl hover:bg-teal-600 transition-all active:scale-95 border-b-8 border-teal-800">
              Start Learning Mission 🚀
              <span className="hidden md:inline-block ml-4 text-xs bg-black/20 px-2 py-1 rounded-md align-middle uppercase">↵ Enter</span>
            </button>
            <button onClick={onClose} className="w-full py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">
              Cancel <span className="ml-1 opacity-60">[Esc]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuestions.length === 0) {
    return (
      <div ref={quizTopRef} className="glass p-20 rounded-[4rem] text-center border-white shadow-2xl scroll-mt-32">
        <p className="text-4xl font-black text-slate-900">No challenges found!</p>
        <div className="mt-12 flex gap-4 justify-center">
          <button onClick={() => setIsSetup(true)} className="px-12 py-6 bg-teal-500 text-white rounded-full font-black text-2xl shadow-xl hover:bg-teal-600 transition-all">Adjust</button>
          <button onClick={onClose} className="px-12 py-6 bg-slate-200 text-slate-600 rounded-full font-black text-2xl shadow-xl hover:bg-slate-300 transition-all">Exit</button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div ref={quizTopRef} className="glass p-12 md:p-16 rounded-[4rem] max-w-4xl w-full mx-auto animate-scale border-white shadow-2xl scroll-mt-32">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-black text-indigo-950">Conditional Insights</h2>
          <button onClick={() => setShowReview(false)} className="bg-indigo-950 text-white px-10 py-4 rounded-full font-black hover:bg-black transition-all">Close <span className="ml-2 text-xs opacity-50">[↵]</span></button>
        </div>
        <div className="space-y-12 max-h-[65vh] overflow-y-auto pr-6 no-scrollbar pb-12">
          {activeQuestions.map((q, idx) => {
            const ans = userAnswers[idx];
            const isCorrect = q.questionType === 'fill-blank' ? String(ans).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase() : ans === q.correctAnswer;
            return (
              <div key={idx} className={`p-10 rounded-[4rem] bg-white border-4 shadow-xl relative overflow-hidden ${isCorrect ? 'border-teal-100' : 'border-red-100'}`}>
                <div className="flex gap-3 mb-6">
                  <span className="px-4 py-1 rounded-full bg-indigo-950 text-white text-[10px] font-black uppercase">CH {idx + 1}</span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${isCorrect ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>{isCorrect ? 'Correct' : 'Missed'}</span>
                </div>
                <p className="font-black text-2xl text-indigo-950 mb-8 leading-snug">{q.text}</p>
                <InsightPoints text={q.explanation} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div ref={quizTopRef} className="glass p-24 rounded-[5rem] text-center animate-scale border-white shadow-2xl scroll-mt-32">
        <h2 className="text-6xl font-black text-teal-600 mb-8">Mission Complete!</h2>
        <div className="text-9xl mb-12 animate-float">🦄💎</div>
        <p className="text-4xl mb-16 text-slate-800 font-black">Score: <span className="text-teal-600 text-7xl">{score}</span> / {activeQuestions.length}</p>
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          <button onClick={() => setShowReview(true)} className="w-full py-8 bg-indigo-50 text-indigo-700 border-4 border-indigo-200 rounded-[3rem] font-black text-2xl hover:bg-indigo-100 shadow-xl transition-all">
            See Detailed Insights <span className="ml-2 text-xs bg-indigo-200 px-2 py-1 rounded">R</span>
          </button>
          <div className="flex gap-6">
            <button onClick={() => { setShowResult(false); setIsSetup(true); }} className="flex-1 py-8 border-4 border-teal-100 text-teal-600 rounded-[3rem] font-black text-2xl hover:bg-teal-50 shadow-xl bg-white">
              Adjust <span className="ml-1 text-xs opacity-50">[A]</span>
            </button>
            <button onClick={onClose} className="flex-1 py-8 bg-teal-500 text-white rounded-[3rem] font-black text-2xl hover:bg-teal-600 shadow-2xl border-b-8 border-teal-800">
              Finish <span className="ml-1 text-xs opacity-40">[↵]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={quizTopRef} className="glass p-12 md:p-16 rounded-[4rem] max-w-4xl w-full mx-auto relative overflow-hidden animate-scale border-white shadow-2xl bg-white scroll-mt-32">
      <div className="absolute top-0 left-0 w-full h-3 bg-slate-50">
         <div className="h-full bg-teal-400 transition-all duration-700 shadow-[0_0_15px_rgba(45,212,191,0.6)]" style={{width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`}}></div>
      </div>
      <div className="flex justify-between items-center mb-16 pt-8">
        <div className="flex items-center gap-4">
           {currentIndex > 0 && <button onClick={prevQuestion} className="bg-indigo-50 text-indigo-500 hover:bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md">←</button>}
           <span className="bg-indigo-50 text-indigo-500 px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest shadow-inner">Step {currentIndex + 1} of {activeQuestions.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-md ${currentQuestion.difficulty === 'Easy' ? 'bg-teal-500 text-white' : currentQuestion.difficulty === 'Medium' ? 'bg-orange-500 text-white' : 'bg-pink-600 text-white'}`}>{currentQuestion.difficulty}</span>
          <button onClick={onClose} className="px-6 py-4 rounded-full text-xs font-black uppercase bg-red-50 text-red-500 border-2 border-red-100 shadow-sm">Exit [Esc]</button>
        </div>
      </div>

      <h3 className="text-4xl font-black text-indigo-950 mb-16 leading-tight">{currentQuestion.text}</h3>

      <div className="space-y-8">
        {currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'boolean' ? (
          <div className={`grid gap-6 ${currentQuestion.questionType === 'boolean' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {currentQuestion.options?.map((option, idx) => (
              <button key={idx} disabled={hasAnswered} onClick={() => { setSelectedOption(idx); checkAnswer(idx); }} className={`group relative w-full p-10 text-left rounded-[3rem] border-4 transition-all duration-300 text-3xl font-black shadow-xl ${hasAnswered ? (idx === currentQuestion.correctAnswer ? 'bg-teal-50 border-teal-400 text-teal-700 scale-[1.03]' : (idx === selectedOption ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 opacity-20')) : 'bg-white border-slate-100 hover:border-teal-300 hover:bg-teal-50 text-indigo-950'}`}>
                <span>{option}</span>
                {!hasAnswered && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Key {idx + 1}</span>}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); checkAnswer(fillValue); }} className="space-y-6">
            <input ref={fillInputRef} type="text" disabled={hasAnswered} value={fillValue} onChange={(e) => setFillValue(e.target.value)} placeholder="Type your answer here..." className={`w-full p-10 rounded-[3rem] border-4 text-3xl font-black shadow-xl outline-none transition-all ${hasAnswered ? (fillValue.trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase() ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-red-50 border-red-200 text-red-500') : 'bg-white border-indigo-100 focus:border-indigo-400 text-indigo-950'}`} />
            {!hasAnswered && <button type="submit" className="w-full py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl hover:bg-indigo-700 shadow-xl transition-all">Submit 🚀 <span className="ml-2 text-xs opacity-40">[↵]</span></button>}
          </form>
        )}
      </div>

      {hasAnswered && (
        <div ref={feedbackRef} className="mt-16 animate-scale">
          <div className="p-10 bg-white rounded-[4rem] mb-12 border-4 border-indigo-100 shadow-inner">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black">!</div>
              <span className="font-black text-indigo-600 uppercase text-lg tracking-[0.3em]">Nebula's Insight</span>
            </div>
            
            <InsightPoints text={currentQuestion.explanation} />
            
            {currentQuestion.questionType === 'fill-blank' && (
              <div className="mt-8 p-6 rounded-[2.5rem] bg-rose-50 border-2 border-rose-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Correct Answer</span>
                <span className="text-2xl font-black text-rose-600 italic">{currentQuestion.correctAnswer}</span>
              </div>
            )}
          </div>
          <button onClick={nextQuestion} className="w-full py-12 bg-teal-500 text-white rounded-[4rem] font-black text-5xl hover:bg-teal-600 transition-all shadow-2xl border-b-8 border-teal-800">
            {currentIndex < activeQuestions.length - 1 ? 'Keep Climbing! ➔' : 'Complete Mission! 🦄'}
            <span className="ml-4 text-xs bg-black/20 px-3 py-1 rounded-md align-middle uppercase hidden md:inline-block">↵ Enter / →</span>
          </button>
        </div>
      )}
    </div>
  );
}

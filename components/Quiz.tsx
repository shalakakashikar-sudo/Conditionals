
import React, { useState, useEffect, useRef } from 'react';
import { Question, ConditionalType } from '../types';
import { QUESTIONS } from '../data';

interface QuizProps {
  type: ConditionalType;
  onClose: () => void;
}

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

/**
 * Fisher-Yates Shuffle Algorithm
 * Ensures truly unbiased randomization of any array.
 */
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

  // Refs for seamless scrolling
  const quizTopRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Scroll logic
  useEffect(() => {
    if (!isSetup && quizTopRef.current) {
      quizTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentIndex, isSetup, showResult, showReview]);

  useEffect(() => {
    if (hasAnswered && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [hasAnswered]);

  const startQuiz = () => {
    let finalSelection: Question[] = [];

    if (type === 'Overall') {
      const special = QUESTIONS.filter(q => q.type === 'Overall');
      const others = QUESTIONS.filter(q => q.type !== 'Overall');

      const filteredSpecial = targetDifficulty === 'All' ? special : special.filter(q => q.difficulty === targetDifficulty);
      const filteredOthers = targetDifficulty === 'All' ? others : others.filter(q => q.difficulty === targetDifficulty);

      const shuffledSpecial = shuffleArray(filteredSpecial);
      const shuffledOthers = shuffleArray(filteredOthers);

      const idealSpecialCount = Math.max(2, Math.floor(targetCount * 0.3));
      const actualSpecialCount = Math.min(shuffledSpecial.length, idealSpecialCount);
      const actualOthersCount = Math.min(shuffledOthers.length, targetCount - actualSpecialCount);

      finalSelection = [
        ...shuffledSpecial.slice(0, actualSpecialCount),
        ...shuffledOthers.slice(0, actualOthersCount)
      ];
      
      finalSelection = shuffleArray(finalSelection);
    } else {
      let pool = QUESTIONS.filter(q => q.type === type);
      if (targetDifficulty !== 'All') {
        pool = pool.filter(q => q.difficulty === targetDifficulty);
      }
      finalSelection = shuffleArray(pool).slice(0, targetCount);
    }

    const randomizedQuestions = finalSelection.map(q => {
      if ((q.questionType === 'multiple-choice' || q.questionType === 'boolean') && q.options) {
        const originalOptions = [...q.options];
        const correctAnswerText = originalOptions[q.correctAnswer as number];
        const shuffledOptions = shuffleArray(originalOptions);
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);
        
        return {
          ...q,
          options: shuffledOptions,
          correctAnswer: newCorrectIndex
        };
      }
      return q;
    });
    
    setActiveQuestions(randomizedQuestions);
    setUserAnswers(new Array(randomizedQuestions.length).fill(undefined));
    setCurrentIndex(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedOption(null);
    setFillValue("");
    setIsSetup(false);
  };

  const currentQuestion = activeQuestions[currentIndex];

  const checkAnswer = (answer: number | string) => {
    if (hasAnswered) return;
    
    let isCorrect = false;
    if (currentQuestion.questionType === 'fill-blank') {
      const normalizedInput = String(answer).trim().toLowerCase();
      const normalizedCorrect = String(currentQuestion.correctAnswer).trim().toLowerCase();
      isCorrect = normalizedInput === normalizedCorrect;
    } else {
      isCorrect = answer === currentQuestion.correctAnswer;
    }

    setHasAnswered(true);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = answer;
    setUserAnswers(updatedAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fillValue.trim()) return;
    checkAnswer(fillValue);
  };

  const syncStateWithAnswer = (index: number) => {
    const answer = userAnswers[index];
    const question = activeQuestions[index];
    
    if (answer !== undefined) {
      setHasAnswered(true);
      if (question.questionType === 'fill-blank') {
        setFillValue(answer as string);
        setSelectedOption(null);
      } else {
        setSelectedOption(answer as number);
        setFillValue("");
      }
    } else {
      setHasAnswered(false);
      setSelectedOption(null);
      setFillValue("");
    }
  };

  const nextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      syncStateWithAnswer(nextIdx);
    } else {
      setShowResult(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      syncStateWithAnswer(prevIdx);
    }
  };

  if (isSetup) {
    const counts = [5, 10, 20, 30, 40, 50];
    const difficulties: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard'];
    
    return (
      <div className="glass p-12 md:p-16 rounded-[4rem] max-w-2xl w-full mx-auto animate-scale border-white shadow-2xl bg-white scroll-mt-32">
        <h2 className="text-5xl font-black text-indigo-950 mb-10 text-center">Quiz Setup ✨</h2>
        
        <div className="space-y-12">
          <section>
            <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Select Intensity Level</p>
            <div className="grid grid-cols-2 gap-4">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setTargetDifficulty(d)}
                  className={`py-6 rounded-[2rem] font-black text-xl transition-all border-4 ${
                    targetDifficulty === d 
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl scale-105' 
                    : 'bg-white text-indigo-900 border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Question Count</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {counts.map(c => (
                <button
                  key={c}
                  onClick={() => setTargetCount(c)}
                  className={`py-4 rounded-[1.5rem] font-black text-lg transition-all border-4 ${
                    targetCount === c 
                    ? 'bg-teal-500 text-white border-teal-300 shadow-lg scale-110' 
                    : 'bg-slate-50 text-slate-400 border-transparent hover:border-teal-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-8 flex flex-col gap-4">
            <button
              onClick={startQuiz}
              className="w-full py-10 bg-teal-500 text-white rounded-[4rem] font-black text-3xl shadow-2xl hover:bg-teal-600 transition-all active:scale-95 border-b-8 border-teal-800"
            >
              Start Learning Mission 🚀
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuestions.length === 0) {
    return (
      <div ref={quizTopRef} className="glass p-20 rounded-[4rem] text-center border-white shadow-2xl scroll-mt-32">
        <p className="text-4xl font-black text-slate-900">No challenges found for this setup!</p>
        <p className="text-lg text-slate-500 mt-4 font-bold">Try lowering the difficulty or changing settings.</p>
        <div className="mt-12 flex gap-4 justify-center">
          <button 
            onClick={() => setIsSetup(true)} 
            className="px-12 py-6 bg-teal-500 text-white rounded-full font-black text-2xl shadow-xl hover:bg-teal-600 transition-all"
          >
            Adjust Settings
          </button>
          <button 
            onClick={onClose} 
            className="px-12 py-6 bg-slate-200 text-slate-600 rounded-full font-black text-2xl shadow-xl hover:bg-slate-300 transition-all"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div ref={quizTopRef} className="glass p-12 md:p-16 rounded-[4rem] max-w-4xl w-full mx-auto animate-scale border-white shadow-2xl scroll-mt-32">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black text-indigo-950 mb-2 text-glow">Conditional Insights</h2>
            <p className="text-indigo-400 font-black uppercase tracking-widest text-sm">Reviewing your logic path</p>
          </div>
          <button 
            onClick={() => setShowReview(false)} 
            className="bg-indigo-950 text-white px-10 py-4 rounded-full text-lg font-black hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Close Insights
          </button>
        </div>

        <div className="space-y-12 max-h-[65vh] overflow-y-auto pr-6 no-scrollbar pb-12">
          {activeQuestions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            let isCorrect = false;
            if (q.questionType === 'fill-blank') {
              isCorrect = String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
            } else {
              isCorrect = userAnswer === q.correctAnswer;
            }

            return (
              <div key={idx} className={`p-10 rounded-[4rem] bg-white border-4 shadow-xl transition-all relative overflow-hidden ${isCorrect ? 'border-teal-100' : 'border-red-100'}`}>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-5 py-2 rounded-full bg-indigo-950 text-white text-xs font-black uppercase tracking-widest">
                    Challenge {idx + 1}
                  </span>
                  <span className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                    {q.type} Conditional
                  </span>
                  <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                    q.difficulty === 'Easy' ? 'bg-teal-100 text-teal-700' :
                    q.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {q.difficulty}
                  </span>
                  {isCorrect ? (
                     <span className="px-5 py-2 rounded-full bg-teal-500 text-white text-xs font-black uppercase tracking-widest shadow-lg ml-auto">Perfect ✨</span>
                  ) : (
                     <span className="px-5 py-2 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest shadow-lg ml-auto">Missed ❌</span>
                  )}
                </div>

                <p className="font-black text-3xl text-indigo-950 mb-10 leading-snug">
                  {q.text}
                </p>

                <div className="mb-10">
                   {q.questionType === 'fill-blank' ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className={`p-8 rounded-[3rem] border-4 flex flex-col gap-2 ${isCorrect ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                           <span className="text-xs font-black uppercase tracking-widest opacity-60">Your Answer</span>
                           <span className="text-2xl font-black italic">{userAnswer || "(Empty)"}</span>
                        </div>
                        {!isCorrect && (
                           <div className="p-8 rounded-[3rem] border-4 bg-teal-50 border-teal-400 text-teal-800 flex flex-col gap-2 shadow-lg scale-105">
                              <span className="text-xs font-black uppercase tracking-widest opacity-60">Correct Answer</span>
                              <span className="text-2xl font-black italic">{q.correctAnswer}</span>
                           </div>
                        )}
                      </div>
                   ) : (
                      <div className="space-y-4">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Logic Options Breakdown:</p>
                        <div className="grid gap-4">
                           {q.options?.map((option, optIdx) => {
                              const isSelectedByPlayer = optIdx === Number(userAnswer);
                              const isCorrectOption = optIdx === q.correctAnswer;
                              
                              let statusClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                              let label = null;

                              if (isCorrectOption) {
                                 statusClass = "bg-teal-50 border-teal-400 text-teal-800 shadow-md ring-4 ring-teal-500/10";
                                 label = <span className="text-[10px] font-black uppercase bg-teal-500 text-white px-3 py-1 rounded-full shadow-sm">Correct Answer</span>;
                              }
                              if (isSelectedByPlayer) {
                                 if (isCorrectOption) {
                                    statusClass = "bg-teal-100 border-teal-500 text-teal-900 shadow-lg scale-[1.02] ring-4 ring-teal-500/20";
                                    label = <span className="text-[10px] font-black uppercase bg-teal-600 text-white px-3 py-1 rounded-full shadow-sm">Your Choice & Correct! ✨</span>;
                                 } else {
                                    statusClass = "bg-red-50 border-red-300 text-red-800 shadow-md opacity-100";
                                    label = <span className="text-[10px] font-black uppercase bg-red-500 text-white px-3 py-1 rounded-full shadow-sm">Your Choice ❌</span>;
                                 }
                              }

                              return (
                                 <div key={optIdx} className={`p-6 rounded-[2.5rem] border-4 transition-all flex items-center justify-between gap-4 ${statusClass}`}>
                                    <span className="text-xl font-black italic">{option}</span>
                                    {label}
                                 </div>
                              );
                           })}
                        </div>
                      </div>
                   )}
                </div>

                <div className="bg-indigo-50/50 p-10 rounded-[3.5rem] border-2 border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-3 h-full bg-indigo-500 opacity-60"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-indigo-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="text-xl">✨</span> Nebula's Logic Guide
                    </p>
                    <p className="text-xl text-indigo-900 font-bold leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-10 border-t-4 border-indigo-50 mt-4 text-center">
          <p className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-8">Ready for the next mission?</p>
          <div className="flex gap-4">
             <button 
                onClick={onClose} 
                className="flex-1 py-10 bg-teal-500 text-white rounded-[4rem] font-black text-4xl shadow-2xl active:scale-95 transition-all border-b-8 border-teal-800"
             >
                Mission Debrief Complete 🚀
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div ref={quizTopRef} className="glass p-24 rounded-[5rem] text-center animate-scale border-white shadow-2xl scroll-mt-32">
        <h2 className="text-6xl font-black text-teal-600 mb-8 drop-shadow-lg">Mission Complete!</h2>
        <div className="text-9xl mb-12 animate-float inline-block filter drop-shadow-[0_20px_40px_rgba(255,255,255,0.8)]">🦄💎</div>
        <p className="text-4xl mb-16 text-slate-800 font-black">Score: <span className="text-teal-600 text-7xl">{score}</span> / {activeQuestions.length}</p>
        
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          <button 
            onClick={() => setShowReview(true)} 
            className="w-full py-8 bg-indigo-50 text-indigo-700 border-4 border-indigo-200 rounded-[3rem] font-black text-2xl hover:bg-indigo-100 transition-all shadow-xl scale-105"
          >
            See Detailed Insights 📖
          </button>
          <div className="flex gap-6">
            <button 
              onClick={() => setIsSetup(true)} 
              className="flex-1 py-8 border-4 border-teal-100 text-teal-600 rounded-[3rem] font-black text-2xl hover:bg-teal-50 transition-all shadow-xl bg-white"
            >
              Adjust
            </button>
            <button onClick={onClose} className="flex-1 py-8 bg-teal-500 text-white rounded-[3rem] font-black text-2xl hover:bg-teal-600 shadow-2xl transition-all border-b-8 border-teal-800">
              Finish
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
           {currentIndex > 0 && (
             <button 
                onClick={prevQuestion}
                className="bg-indigo-50 text-indigo-500 hover:bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90"
                title="Previous Question"
             >
                <span className="text-xl font-black">←</span>
             </button>
           )}
           <span className="bg-indigo-50 text-indigo-500 px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest shadow-inner">
             Step {currentIndex + 1} of {activeQuestions.length}
           </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-md ${
            currentQuestion.difficulty === 'Easy' ? 'bg-teal-500 text-white' :
            currentQuestion.difficulty === 'Medium' ? 'bg-orange-500 text-white' :
            'bg-pink-600 text-white'
          }`}>
            {currentQuestion.difficulty} Level
          </span>
          <button 
            onClick={onClose}
            className="px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition-all active:scale-90 shadow-sm"
          >
            Exit Mission 🚪
          </button>
        </div>
      </div>

      <div className="mb-10 text-xs font-black text-indigo-400 uppercase tracking-widest">
        Type: {currentQuestion.questionType.replace('-', ' ')}
      </div>

      <h3 className="text-4xl font-black text-indigo-950 mb-16 leading-tight heading-shadow">
        {currentQuestion.text}
      </h3>

      <div className="space-y-8">
        {currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'boolean' ? (
          <div className={`grid gap-6 ${currentQuestion.questionType === 'boolean' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {currentQuestion.options?.map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctAnswer;
              const isSelected = idx === selectedOption;
              
              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => {
                    setSelectedOption(idx);
                    checkAnswer(idx);
                  }}
                  className={`w-full p-10 text-left rounded-[3rem] border-4 transition-all duration-300 text-3xl font-black relative overflow-hidden shadow-xl ${
                    hasAnswered 
                      ? isCorrect 
                        ? 'bg-teal-50 border-teal-400 text-teal-700 scale-[1.03] shadow-teal-200' 
                        : isSelected 
                          ? 'bg-red-50 border-red-200 text-red-500' 
                          : 'bg-slate-50 border-slate-50 text-slate-200 opacity-20'
                      : 'bg-white border-slate-100 hover:border-teal-300 hover:bg-teal-50 text-indigo-950 hover:scale-[1.01]'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span>{option}</span>
                    {hasAnswered && isCorrect && <span className="text-5xl animate-bounce">✨</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleFillSubmit} className="space-y-6">
            <input 
              type="text"
              disabled={hasAnswered}
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full p-10 rounded-[3rem] border-4 text-3xl font-black shadow-xl outline-none transition-all ${
                hasAnswered
                  ? String(fillValue).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase()
                    ? 'bg-teal-50 border-teal-400 text-teal-700 shadow-teal-200'
                    : 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white border-indigo-100 focus:border-indigo-400 text-indigo-950'
              }`}
            />
            {!hasAnswered && (
              <button 
                type="submit"
                className="w-full py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl hover:bg-indigo-700 shadow-xl transition-all active:scale-95"
              >
                Submit Logic 🚀
              </button>
            )}
          </form>
        )}
      </div>

      {hasAnswered && (
        <div ref={feedbackRef} className="mt-16 animate-scale">
          <div className="p-12 bg-indigo-50 rounded-[4rem] mb-12 border-4 border-indigo-100 shadow-inner">
            <div className="text-2xl text-indigo-950 font-bold leading-relaxed whitespace-pre-wrap">
               <span className="font-black text-indigo-600 mr-2 uppercase text-base tracking-widest block mb-6 text-glow">Nebula's Insight:</span> 
               {currentQuestion.explanation}
               {currentQuestion.questionType === 'fill-blank' && (
                  <span className="block mt-4 text-teal-600 font-black">Correct Answer: {currentQuestion.correctAnswer}</span>
               )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <button 
              onClick={nextQuestion}
              className="flex-[2] py-12 bg-teal-500 text-white rounded-[4rem] font-black text-5xl hover:bg-teal-600 transition-all shadow-2xl active:scale-95 border-b-8 border-teal-800"
            >
              {currentIndex < activeQuestions.length - 1 ? 'Keep Climbing! ➔' : 'Complete Mission! 🦄'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Sparkles, ChevronRight, ChevronLeft, Loader2, Info } from 'lucide-react';

function Assessment() {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      id: 'q1',
      text: 'How heavily do your personal emotions dictate your focus throughout the day?',
      options: [
        { label: 'Rarely', value: '1_internal', desc: 'I stay logic-driven mostly.' },
        { label: 'Sometimes', value: '2_internal', desc: 'Emotions play a role occasionally.' },
        { label: 'Very Often', value: '3_internal', desc: 'My feelings are my compass.' }
      ]
    },
    {
      id: 'q2',
      text: "Do news, social media, or other people's opinions alter your current mood?",
      options: [
        { label: 'Not much', value: '1_external', desc: 'I stay grounded in my own space.' },
        { label: 'Somewhat', value: '2_external', desc: 'I feel the hum of the world.' },
        { label: 'Significantly', value: '3_external', desc: 'External noises affect me deeply.' }
      ]
    },
    {
      id: 'q3',
      text: 'When facing a challenge, do you tend to sit quietly and process your feelings alone?',
      options: [
        { label: 'Never', value: '1_internal', desc: 'I act immediately or seek help.' },
        { label: 'Usually', value: '2_internal', desc: 'I prefer some solitude first.' },
        { label: 'Always', value: '3_internal', desc: 'Introspection is my first response.' }
      ]
    },
    {
      id: 'q4',
      text: 'How much pressure do you feel to meet the expectations of your community?',
      options: [
        { label: 'Very Little', value: '1_external', desc: 'I march to my own beat.' },
        { label: 'Moderate', value: '2_external', desc: 'I want to fit in comfortably.' },
        { label: 'A lot', value: '3_external', desc: 'High pressure to conform.' }
      ]
    },
    {
      id: 'q5',
      text: 'I find myself lost in thought about past conversations or future possibilities.',
      options: [
        { label: 'Disagree', value: '1_internal', desc: 'I live in the present.' },
        { label: 'Neutral', value: '2_internal', desc: 'I reflect occasionally.' },
        { label: 'Agree', value: '3_internal', desc: 'My mind is a constant theater.' }
      ]
    },
    {
      id: 'q6',
      text: 'Being in a crowded or noisy environment quickly drains my energy.',
      options: [
        { label: 'Not at all', value: '1_external', desc: 'I thrive on the chaos.' },
        { label: 'A bit', value: '2_external', desc: 'I enjoy it for a while.' },
        { label: 'Exhausting', value: '3_external', desc: 'It drains me very fast.' }
      ]
    }
  ];

  const handleOptionChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(key => {
      const [score, type] = answers[key].split('_');
      return {
        question: key,
        score: parseInt(score),
        type
      };
    });

    if (formattedAnswers.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete',
        text: 'Please answer all questions before submitting.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/questionnaire', { answers: formattedAnswers });
      Swal.fire({
        icon: 'success',
        title: 'Analysis Complete',
        text: 'Your mindscape insights are ready.',
        confirmButtonColor: '#6366f1',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate(`/result?id=${res.data.result_id}`);
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'Failed to process your results. Please try again.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 md:p-16 border-none overflow-hidden relative"
      >
        {/* Progress header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-indigo-600">
            <span className="flex items-center gap-2">
                <ClipboardCheck size={18} /> Step {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
               className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
             />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                {currentQuestion.text}
              </h2>
              <p className="text-slate-500">Select the option that feels most natural to you today.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentQuestion.options.map((opt) => (
                <label 
                  key={opt.value} 
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group ${answers[currentQuestion.id] === opt.value ? 'bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={opt.value}
                    checked={answers[currentQuestion.id] === opt.value}
                    onChange={() => handleOptionChange(currentQuestion.id, opt.value)}
                    className="hidden"
                  />
                  <div className="space-y-1">
                    <span className={`block font-bold text-lg ${answers[currentQuestion.id] === opt.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {opt.label}
                    </span>
                    <span className="text-sm text-slate-500">{opt.desc}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQuestion.id] === opt.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'}`}>
                     {answers[currentQuestion.id] === opt.value && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${currentIndex === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20} /> Back
          </button>

          {isLastQuestion ? (
            <button
               onClick={handleSubmit}
               disabled={!isAnswered || loading}
               className="btn-primary flex items-center gap-2 px-10 py-4 shadow-indigo-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Analyzing...' : 'Submit Reflection'}
            </button>
          ) : (
            <button
               onClick={handleNext}
               disabled={!isAnswered}
               className={`flex items-center gap-2 font-bold px-10 py-4 rounded-xl transition-all ${!isAnswered ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}
            >
              Continue <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="mt-16 p-6 bg-slate-50 rounded-2xl flex gap-4 border border-slate-100">
          <Info className="text-indigo-600 shrink-0" size={20} />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Note: This is an introspective tool designed for personal reflection and is not a substitute for professional medical diagnosis or counseling.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Assessment;

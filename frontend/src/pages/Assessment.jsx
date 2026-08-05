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
    },
    {
      id: 'q7',
      text: 'How often do you compare your life situation to people you see on social media?',
      options: [
        { label: 'Rarely', value: '1_external', desc: 'I focus on my own journey.' },
        { label: 'Sometimes', value: '2_external', desc: 'I notice but try to brush it off.' },
        { label: 'Frequently', value: '3_external', desc: 'It affects how I feel about myself.' }
      ]
    },
    {
      id: 'q8',
      text: 'I am able to recognize and name my emotions clearly when they arise.',
      options: [
        { label: 'Rarely', value: '1_internal', desc: "I don't always know what I feel." },
        { label: 'Sometimes', value: '2_internal', desc: 'I can, but it takes a moment.' },
        { label: 'Usually', value: '3_internal', desc: 'I have strong emotional awareness.' }
      ]
    },
    {
      id: 'q9',
      text: 'When a close person is upset, how strongly does their mood affect yours?',
      options: [
        { label: 'Not much', value: '1_external', desc: 'I can hold my own ground.' },
        { label: 'A little', value: '2_external', desc: 'I feel a subtle shift in my mood.' },
        { label: 'Very strongly', value: '3_external', desc: 'Their emotions quickly become mine.' }
      ]
    },
    {
      id: 'q10',
      text: 'I regularly set time aside to journal, meditate, or reflect on my inner state.',
      options: [
        { label: 'Never', value: '1_internal', desc: 'I rarely slow down for that.' },
        { label: 'Occasionally', value: '2_internal', desc: 'I do it when things get heavy.' },
        { label: 'Consistently', value: '3_internal', desc: 'It is a regular part of my routine.' }
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

    if (formattedAnswers.length < 10) {
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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-12 border border-slate-200/50 overflow-hidden relative"
      >
        {/* Progress header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 tracking-tight">
            <span className="flex items-center gap-1.5">
                <ClipboardCheck size={16} /> Step {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
               className="h-full bg-indigo-600 rounded-full"
             />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {currentQuestion.text}
              </h2>
              <p className="text-sm text-slate-500 font-light">Select the option that feels most natural to you today.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt) => (
                <label 
                  key={opt.value} 
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${answers[currentQuestion.id] === opt.value ? 'bg-indigo-50/50 border-indigo-600' : 'bg-white border-slate-200 hover:border-slate-350'}`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={opt.value}
                    checked={answers[currentQuestion.id] === opt.value}
                    onChange={() => handleOptionChange(currentQuestion.id, opt.value)}
                    className="hidden"
                  />
                  <div className="space-y-0.5">
                    <span className={`block font-semibold text-base ${answers[currentQuestion.id] === opt.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {opt.label}
                    </span>
                    <span className="text-xs text-slate-500 font-light">{opt.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${answers[currentQuestion.id] === opt.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'}`}>
                     {answers[currentQuestion.id] === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between border-t border-slate-200/50 pt-8">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 text-sm font-semibold transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-750'}`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {isLastQuestion ? (
            <button
               onClick={handleSubmit}
               disabled={!isAnswered || loading}
               className="btn-primary flex items-center gap-1.5 px-8 py-2.5 shadow-none"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loading ? 'Analyzing...' : 'Submit Reflection'}
            </button>
          ) : (
            <button
               onClick={handleNext}
               disabled={!isAnswered}
               className={`flex items-center gap-1 text-sm font-semibold px-6 py-2.5 rounded-full transition-all ${!isAnswered ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-none'}`}
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="mt-12 p-5 bg-slate-50 rounded-[20px] flex gap-3 border border-slate-200/40">
          <Info className="text-indigo-600 shrink-0" size={18} />
          <p className="text-xs text-slate-500 leading-relaxed font-light italic">
            Note: This is an introspective tool designed for personal reflection and is not a substitute for professional medical diagnosis or counseling.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Assessment;

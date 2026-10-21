/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info, 
  HelpCircle, 
  Check, 
  Clock, 
  User, 
  Smile, 
  Coffee,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ProgressEntry {
  id: string;
  date: string;
  circuitDone: boolean;
  ritualDone: boolean;
  feeling: 'Confortável' | 'Neutro' | 'Desconfortável';
  notes: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'body' | 'ritual' | 'exercises' | 'habits' | 'safety' | 'progress' | 'faq'>('home');
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [zoomedExerciseIndex, setZoomedExerciseIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Ritual Timer State (3 minutes = 180 seconds)
  const [ritualActive, setRitualActive] = useState(false);
  const [ritualSecondsLeft, setRitualSecondsLeft] = useState(180);
  const [ritualStepIndex, setRitualStepIndex] = useState(0);

  // Exercise Circuit Timer State (5 minutes = 300 seconds)
  const [exerciseActive, setExerciseActive] = useState(false);
  const [exerciseSecondsLeft, setExerciseSecondsLeft] = useState(300);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseFeedback, setExerciseFeedback] = useState<'Confortável' | 'Versão mais leve' | 'Desconforto' | null>(null);

  // Progress State
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>(() => {
    const saved = localStorage.getItem('seios_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        circuitDone: true,
        ritualDone: true,
        feeling: 'Confortável',
        notes: 'Início da rotina de autocuidado.'
      }
    ];
  });

  const [todayCircuitDone, setTodayCircuitDone] = useState(false);
  const [todayRitualDone, setTodayRitualDone] = useState(false);
  const [todayFeeling, setTodayFeeling] = useState<'Confortável' | 'Neutro' | 'Desconfortável'>('Confortável');
  const [todayNotes, setTodayNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('seios_progress', JSON.stringify(progressEntries));
  }, [progressEntries]);

  // Lock body scroll when zoom modal is open to keep screen fully stationary
  useEffect(() => {
    if (zoomedExerciseIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [zoomedExerciseIndex]);

  // Ritual Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (ritualActive && ritualSecondsLeft > 0) {
      interval = setInterval(() => {
        setRitualSecondsLeft(prev => {
          if (prev <= 1) {
            setRitualActive(false);
            setTodayRitualDone(true);
            return 0;
          }
          const elapsed = 180 - (prev - 1);
          if (elapsed <= 30) setRitualStepIndex(0);
          else if (elapsed <= 90) setRitualStepIndex(1);
          else if (elapsed <= 150) setRitualStepIndex(2);
          else setRitualStepIndex(3);

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ritualActive, ritualSecondsLeft]);

  // Exercise Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (exerciseActive && exerciseSecondsLeft > 0) {
      interval = setInterval(() => {
        setExerciseSecondsLeft(prev => {
          if (prev <= 1) {
            setExerciseActive(false);
            setTodayCircuitDone(true);
            return 0;
          }
          const elapsed = 300 - (prev - 1);
          if (elapsed <= 30) setCurrentExerciseIndex(0);
          else if (elapsed <= 90) setCurrentExerciseIndex(1);
          else if (elapsed <= 135) setCurrentExerciseIndex(2);
          else if (elapsed <= 195) setCurrentExerciseIndex(3);
          else if (elapsed <= 255) setCurrentExerciseIndex(4);
          else setCurrentExerciseIndex(5);

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exerciseActive, exerciseSecondsLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveProgressToday = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    const existingIndex = progressEntries.findIndex(p => p.date === todayStr);
    const newEntry: ProgressEntry = {
      id: existingIndex >= 0 ? progressEntries[existingIndex].id : Date.now().toString(),
      date: todayStr,
      circuitDone: todayCircuitDone,
      ritualDone: todayRitualDone,
      feeling: todayFeeling,
      notes: todayNotes
    };

    if (existingIndex >= 0) {
      const updated = [...progressEntries];
      updated[existingIndex] = newEntry;
      setProgressEntries(updated);
    } else {
      setProgressEntries([newEntry, ...progressEntries]);
    }
    alert('Registro salvo com sucesso!');
  };

  const ritualStepsData = [
    { time: '0:00 – 0:30', title: 'Prepare-se', desc: 'Lave e seque as mãos. Se for usar hidratante, teste em pequena área.' },
    { time: '0:30 – 1:30', title: 'Espalhe o hidratante', desc: 'Com a palma da mão e pressão leve, espalhe no colo e parte externa.' },
    { time: '1:30 – 2:30', title: 'Movimentos circulares suaves', desc: 'Círculos pequenos e superficiais, sem apertar ou deslocar o tecido.' },
    { time: '2:30 – 3:00', title: 'Finalize', desc: 'Passe as mãos suavemente pelo colo e pare. Interrompa se houver dor.' }
  ];

  const exercisesData = [
    { 
      time: '0:00 – 0:30', 
      title: 'Preparação (Círculos com os ombros)', 
      desc: 'Fique de pé ou sentada. Relaxe os ombros, respire e faça círculos para trás com calma.',
      image: 'https://i.postimg.cc/KvNsRmms/Duck-ai-image-2026-10-15-23-01.jpg'
    },
    { 
      time: '0:30 – 1:30', 
      title: 'Flexão na parede', 
      desc: 'Apoie as mãos na parede a um braço de distância. Dobre os cotovelos aproximando o peito devagar.',
      image: 'https://i.postimg.cc/fTKgJMMq/Duck-ai-image-2026-10-15-23-01-(1).jpg'
    },
    { 
      time: '1:30 – 2:15', 
      title: 'Pressão isométrica das palmas', 
      desc: 'Junte as palmas à frente do peito, pressione com força confortável por 5s, relaxe 5s.',
      image: 'https://i.postimg.cc/gkDBnGGV/Duck-ai-image-2026-10-15-23-01-(2).jpg'
    },
    { 
      time: '2:15 – 3:15', 
      title: 'Retração suave das escápulas', 
      desc: 'Leve os ombros para trás aproximando as escápulas. Segure 3s e relaxe sem curvar a coluna.',
      image: 'https://i.postimg.cc/GhQSHbbJ/Duck-ai-image-2026-10-15-23-01-(3).jpg'
    },
    { 
      time: '3:15 – 4:15', 
      title: 'Deslizamento dos braços na parede', 
      desc: 'Apoie os antebraços e deslize para cima e para baixo suavemente, respeitando seus limites.',
      image: 'https://i.postimg.cc/DygY877P/Duck-ai-image-2026-10-15-23-01-(4).jpg'
    },
    { 
      time: '4:15 – 5:00', 
      title: 'Respiração e relaxamento natural', 
      desc: 'Abaixe os braços, faça respirações profundas e naturais, soltando a tensão acumulada.',
      image: 'https://i.postimg.cc/zXjPVqqw/Duck-ai-image-2026-10-15-23-01-(5).jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex justify-center items-start selection:bg-rose-100 selection:text-rose-900 font-sans">
      
      {/* Mobile Shell Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden border-x border-stone-200">
        
        {/* Top Header */}
        <header className="bg-gradient-to-r from-rose-900 to-rose-950 text-white px-6 pt-6 pb-5 sticky top-0 z-30 shadow-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-widest text-rose-200 font-medium">Guia Educativo & Autocuidado</span>
            <button 
              onClick={() => setShowDisclaimerModal(true)} 
              className="text-rose-200 hover:text-white transition p-1 rounded-full bg-rose-900/50 hover:bg-rose-800"
              title="Aviso importante"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-xl font-serif font-semibold tracking-tight text-white flex items-center gap-2">
            Seios Firmes & Empinados
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400"></span>
          </h1>
          <p className="text-xs text-rose-100/90 mt-1 line-clamp-1">
            Postura, fortalecimento do peitoral e autocuidado sem falsas promessas.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-28 px-5 pt-5 space-y-6">

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-rose-50 via-amber-50/30 to-stone-100 rounded-2xl p-6 border border-rose-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <span className="inline-block bg-rose-100 text-rose-900 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  Seu cuidado, no seu ritmo
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  Bem-estar e respeito ao seu corpo
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-5">
                  Este guia reúne informações educativas, um ritual suave de autocuidado e exercícios simples para o peitoral e a postura.
                </p>

                <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-rose-100/60 text-xs text-stone-700 mb-5 space-y-2">
                  <p className="font-medium text-rose-900">Nota fundamental:</p>
                  <p>
                    O objetivo é apoiar uma rotina de bem-estar — <strong>não mudar o tamanho dos seios nem garantir que fiquem mais firmes ou elevados</strong>. Cada corpo é único, e a aparência muda com o tempo, hormônios e gestação.
                  </p>
                </div>

                <button 
                  onClick={() => setActiveTab('body')}
                  className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3.5 px-6 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Começar Jornada</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>

              {/* Quick Access Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Explorar o Guia</h3>
                <div className="grid grid-cols-2 gap-3">
                  
                  <button 
                    onClick={() => setActiveTab('body')}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition text-left flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center mb-3 group-hover:bg-rose-900 group-hover:text-white transition">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-stone-800">Entenda seu corpo</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Mitos e realidades</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('ritual')}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition text-left flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-900 group-hover:text-white transition">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-stone-800">Ritual de 3 min</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Autocuidado com pele</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('exercises')}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition text-left flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-900 group-hover:text-white transition">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-stone-800">Circuito de 5 min</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Peitoral e postura</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('habits')}
                    className="bg-white p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition text-left flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:bg-purple-900 group-hover:text-white transition">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-stone-800">Hábitos diários</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Conforto e suporte</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Brief Footer Notice */}
              <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-600 flex gap-3 items-start border border-stone-200">
                <ShieldCheck className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block mb-0.5">Conteúdo Educativo</span>
                  Este material não substitui avaliação ou orientação de profissionais de saúde. Não promete resultados estéticos ou terapêuticos.
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ENTENDA SEU CORPO */}
          {activeTab === 'body' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 01</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  O que os exercícios podem — e não podem — fazer
                </h2>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-sm text-stone-700 leading-relaxed space-y-3">
                <p>
                  Os seios <strong>não são formados por músculos</strong>. Eles são compostos principalmente por tecido glandular, gordura e tecido conjuntivo, e ficam sobre os músculos do tórax.
                </p>
                <p>
                  Por isso, exercícios para o peitoral não “treinam o seio” diretamente e não conseguem garantir que ele fique levantado ou mais firme.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Esclarecendo mitos comuns</h3>
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-800"></span>
                    Exercícios
                  </h4>
                  <p className="text-xs text-stone-600">
                    Fortalecem músculos do tórax, braços e ombros, melhorando a sustentação geral e a postura.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-800"></span>
                    Postura
                  </h4>
                  <p className="text-xs text-stone-600">
                    Trabalhar a postura ajuda você a manter o tronco mais ereto, o que valoriza o porte físico.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Massagem
                  </h4>
                  <p className="text-xs text-stone-600">
                    Excelente momento de autocuidado, mas <strong>não há evidência conclusiva</strong> de que levante ou previna a flacidez.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Óleos e cremes
                  </h4>
                  <p className="text-xs text-stone-600">
                    Podem ajudar a hidratar a pele, mas não aumentam os seios nem mudam sua forma de maneira duradoura.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setActiveTab('ritual')} 
                  className="flex-1 bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
                >
                  <span>Ir para Ritual de Autocuidado</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RITUAL DE AUTOCUIDADO */}
          {activeTab === 'ritual' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 02</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Ritual de Autocuidado de 3 Minutos
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Um momento suave para cuidar da pele e se familiarizar com o próprio corpo.
                </p>
              </div>

              {/* Timer Box */}
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/60 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
                <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
                  {ritualActive ? `Passo ${ritualStepIndex + 1} de 4` : 'Pronto para começar?'}
                </div>
                
                <div className="text-4xl font-serif font-bold text-stone-900 tracking-wider my-3">
                  {formatTime(ritualSecondsLeft)}
                </div>

                <div className="bg-white/90 rounded-xl p-3 mb-5 border border-amber-100 text-left">
                  <span className="text-xs font-bold text-rose-900 block">{ritualStepsData[ritualStepIndex].time} — {ritualStepsData[ritualStepIndex].title}</span>
                  <p className="text-xs text-stone-600 mt-1">{ritualStepsData[ritualStepIndex].desc}</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!ritualActive ? (
                    <button 
                      onClick={() => setRitualActive(true)}
                      className="bg-rose-900 hover:bg-rose-950 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {ritualSecondsLeft < 180 && ritualSecondsLeft > 0 ? 'Retomar Ritual' : 'Iniciar Ritual (3 min)'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setRitualActive(false)}
                      className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow transition"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      Pausar
                    </button>
                  )}

                  <button 
                    onClick={() => { setRitualActive(false); setRitualSecondsLeft(180); setRitualStepIndex(0); }}
                    className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 p-3 rounded-xl transition"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step By Step List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Passo a passo detalhado</h3>
                {ritualStepsData.map((step, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border transition ${ritualStepIndex === idx && ritualActive ? 'border-rose-400 bg-rose-50/50 shadow-sm' : 'border-stone-200 bg-white'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-rose-800">{step.time}</span>
                      <span className="text-xs text-stone-400 font-mono">Passo {idx + 1}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-stone-900">{step.title}</h4>
                    <p className="text-xs text-stone-600 mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* Security box for ritual */}
              <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-700 space-y-2 border border-stone-200">
                <span className="font-semibold text-stone-950 block">Precauções importantes do ritual:</span>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  <li>A massagem deve ser <strong>leve e confortável</strong>, nunca dolorosa.</li>
                  <li>Não use óleos essenciais ou misturas que prometam crescimento ou firmeza.</li>
                  <li>Se notar um caroço novo ou alteração na pele, procure avaliação profissional imediata.</li>
                </ul>
              </div>

              <button 
                onClick={() => setActiveTab('exercises')}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Avançar para Exercícios de 5 Minutos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 4: EXERCÍCIOS DE 5 MINUTOS */}
          {activeTab === 'exercises' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 03</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Circuito Leve para Peitoral e Postura
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Frequência sugerida: 2 a 3 vezes por semana, em dias alternados. Sem equipamentos.
                </p>
              </div>

              {/* Circuit Timer Box */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-stone-100 border border-emerald-200/60 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
                <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-2">
                  {exerciseActive ? exercisesData[currentExerciseIndex].title : 'Circuito de 5 Minutos'}
                </div>
                
                <div className="text-4xl font-serif font-bold text-stone-900 tracking-wider my-3">
                  {formatTime(exerciseSecondsLeft)}
                </div>

                <div className="bg-white/90 rounded-xl p-3 mb-4 border border-emerald-100 text-left">
                  <span className="text-xs font-bold text-emerald-900 block">{exercisesData[currentExerciseIndex].time}</span>
                  <p className="text-xs text-stone-700 font-medium mt-0.5">{exercisesData[currentExerciseIndex].title}</p>
                  <p className="text-xs text-stone-600 mt-1">{exercisesData[currentExerciseIndex].desc}</p>
                </div>

                <div 
                  onClick={() => { setZoomedExerciseIndex(currentExerciseIndex); setZoomScale(1); }}
                  className="mb-5 rounded-2xl overflow-hidden border border-emerald-300/80 bg-stone-900 shadow-lg h-64 flex items-center justify-center relative cursor-pointer group"
                >
                  <img 
                    src={exercisesData[currentExerciseIndex].image} 
                    alt={exercisesData[currentExerciseIndex].title}
                    className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-102"
                    loading="eager"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                    HD
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow border border-white/15 transition group-hover:scale-105">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="font-medium text-[11px]">Ampliar em Alta Qualidade</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!exerciseActive ? (
                    <button 
                      onClick={() => setExerciseActive(true)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {exerciseSecondsLeft < 300 && exerciseSecondsLeft > 0 ? 'Retomar Circuito' : 'Iniciar Circuito (5 min)'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setExerciseActive(false)}
                      className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow transition"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      Pausar
                    </button>
                  )}

                  <button 
                    onClick={() => { setExerciseActive(false); setExerciseSecondsLeft(300); setCurrentExerciseIndex(0); }}
                    className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 p-3 rounded-xl transition"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Passos do Circuito (Toque na imagem para ampliar)</h3>
                {exercisesData.map((ex, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border transition ${currentExerciseIndex === idx && exerciseActive ? 'border-emerald-400 bg-emerald-50/50 shadow-sm' : 'border-stone-200 bg-white'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-emerald-800">{ex.time}</span>
                      <span className="text-xs text-stone-400 font-mono">Bloco {idx + 1} de 6</span>
                    </div>
                    <h4 className="font-semibold text-sm text-stone-900 mb-1.5">{ex.title}</h4>
                    <p className="text-xs text-stone-600 mb-3">{ex.desc}</p>
                    
                    <div 
                      onClick={() => { setZoomedExerciseIndex(idx); setZoomScale(1); }}
                      className="rounded-xl overflow-hidden border border-stone-300/80 h-56 bg-stone-900 relative cursor-pointer group shadow-sm transition hover:border-emerald-500"
                    >
                      <img 
                        src={ex.image} 
                        alt={ex.title} 
                        className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-102"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                        HD 100%
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow border border-white/15 transition group-hover:scale-105">
                        <Maximize2 className="w-3.5 h-3.5 text-rose-300" />
                        <span className="font-medium text-[11px]">Ampliar Imagem</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback Prompt */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-semibold text-sm text-stone-900">Como você se sentiu com o circuito?</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { setExerciseFeedback('Confortável'); alert('Ótimo! Continue mantendo uma rotina saudável e segura.'); }}
                    className={`p-2.5 rounded-lg text-xs font-medium border transition ${exerciseFeedback === 'Confortável' ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                  >
                    Foi confortável
                  </button>
                  <button 
                    onClick={() => { setExerciseFeedback('Versão mais leve'); alert('Compreendido. Você pode reduzir a amplitude ou fazer menos repetições.'); }}
                    className={`p-2.5 rounded-lg text-xs font-medium border transition ${exerciseFeedback === 'Versão mais leve' ? 'bg-amber-800 text-white border-amber-800' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                  >
                    Versão mais leve
                  </button>
                  <button 
                    onClick={() => { setExerciseFeedback('Desconforto'); alert('Atenção: Interrompa o exercício se sentir dor persistente, falta de ar ou tontura.'); }}
                    className={`p-2.5 rounded-lg text-xs font-medium border transition ${exerciseFeedback === 'Desconforto' ? 'bg-rose-800 text-white border-rose-800' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                  >
                    Senti dor
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('habits')}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Avançar para Hábitos de Sustentação</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 5: HÁBITOS DE SUSTENTAÇÃO */}
          {activeTab === 'habits' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 04</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Conforto no Dia a Dia
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Práticas cotidianas focadas em bem-estar, suporte e aceitação.
                </p>
              </div>

              <div className="space-y-3">
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Escolha um sutiã confortável</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Ele não deve machucar, apertar a ponto de dificultar a respiração ou deixar marcas dolorosas na pele.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Atividades com impacto</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Experimente uma peça esportiva adequada que reduza o desconforto e permita se movimentar com segurança.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Ajuste conforme seu corpo muda</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Tamanho e conforto podem variar ao longo do tempo com mudanças de peso, ciclo menstrual, gestação e amamentação.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Cuide da pele</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Se sua pele tolerar, um hidratante simples pode ajudar com o ressecamento. Hidratante não levanta os seios.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Respeite seu corpo</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Assimetria e mudanças ao longo da vida são absolutamente comuns; não há um único formato “correto”.
                    </p>
                  </div>
                </div>

              </div>

              <button 
                onClick={() => setActiveTab('safety')}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Avançar para Segurança e Alertas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 6: SEGURANÇA E SINAIS DE ALERTA */}
          {activeTab === 'safety' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 05</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Quando Parar e Procurar Orientação
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Atendimento médico e auto-observação responsável.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-stone-800 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-900 text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  Procure orientação se perceber:
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-700 leading-relaxed">
                  <li>Um caroço novo na mama ou na axila;</li>
                  <li>Espessamento, inchaço ou mudança recente no tamanho ou formato;</li>
                  <li>Covinhas, retração, irritação ou descamação da pele;</li>
                  <li>Mamilo que passou a ficar invertido;</li>
                  <li>Secreção pelo mamilo que não seja leite, especialmente se houver sangue;</li>
                  <li>Dor localizada persistente ou uma mudança que seja diferente do habitual.</li>
                </ul>
              </div>

              <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-600 space-y-2 border border-stone-200">
                <span className="font-semibold text-stone-800 block">Nota importante:</span>
                <p>
                  Esses sinais <strong>não significam necessariamente câncer</strong>, mas merecem avaliação profissional. A massagem ou o autoexame não substituem consultas, exames ou rastreamento clínico.
                </p>
              </div>

              <button 
                onClick={() => setActiveTab('progress')}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Avançar para Meu Progresso & Registro</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 7: MEU PROGRESSO */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Seção 06</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Meu Progresso Diário
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Registre consistência, conforto e percepção pessoal — sem julgamento corporal.
                </p>
              </div>

              {/* Form to log today */}
              <form onSubmit={handleSaveProgressToday} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-800" />
                  Registro de Hoje ({new Date().toLocaleDateString('pt-BR')})
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={todayCircuitDone} 
                      onChange={e => setTodayCircuitDone(e.target.checked)}
                      className="w-4 h-4 text-rose-900 rounded border-stone-300 focus:ring-rose-800"
                    />
                    <span>Fiz o circuito de 5 minutos</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={todayRitualDone} 
                      onChange={e => setTodayRitualDone(e.target.checked)}
                      className="w-4 h-4 text-rose-900 rounded border-stone-300 focus:ring-rose-800"
                    />
                    <span>Fiz o ritual de autocuidado</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Como você se senti hoje?</label>
                  <select 
                    value={todayFeeling} 
                    onChange={e => setTodayFeeling(e.target.value as any)}
                    className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:outline-none focus:border-rose-800"
                  >
                    <option value="Confortável">Confortável / Bem</option>
                    <option value="Neutro">Neutro</option>
                    <option value="Desconfortável">Desconfortável / Preciso descansar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Observação opcional</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Postura mais ereta hoje, boa sensação..."
                    value={todayNotes}
                    onChange={e => setTodayNotes(e.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:outline-none focus:border-rose-800"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-2.5 rounded-xl transition text-sm shadow"
                >
                  Salvar Registro de Hoje
                </button>
              </form>

              {/* History list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Histórico de Registros</h3>
                {progressEntries.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">Nenhum registro salvo ainda.</p>
                ) : (
                  progressEntries.map(entry => (
                    <div key={entry.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-900">{entry.date}</span>
                        <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full font-medium">{entry.feeling}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-stone-600 pt-1">
                        <span>Circuito: {entry.circuitDone ? '✅ Sim' : '❌ Não'}</span>
                        <span>Ritual: {entry.ritualDone ? '✅ Sim' : '❌ Não'}</span>
                      </div>
                      {entry.notes && <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 p-2 rounded">"{entry.notes}"</p>}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-xs text-stone-600">
                <span className="font-semibold text-stone-900 block mb-1">Lembrete:</span>
                O progresso aqui é sobre criar uma rotina segura e perceber como você se sente. O aplicativo não prevê nem garante mudanças no tamanho ou na firmeza.
              </div>

              <button 
                onClick={() => setActiveTab('faq')}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <span>Ver Perguntas Frequentes (FAQ)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 8: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">Dúvidas Frequentes</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Perguntas e Respostas
                </h2>
              </div>

              <div className="space-y-3">
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900">“A massagem deixa os seios mais firmes?”</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Não há evidência conclusiva de que a massagem levante os seios ou previna a flacidez. Ela pode ser usada como momento de autocuidado; um hidratante pode ajudar com o ressecamento da pele, mas não muda a estrutura do tecido mamário.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900">“Exercícios de peitoral levantam os seios?”</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Não diretamente. Os músculos peitorais ficam abaixo dos seios. Fortalecê-los pode trabalhar o tórax e ajudar no condicionamento, mas não garante elevação do tecido mamário.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900">“Qual óleo devo usar?”</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    O uso de óleo é opcional. Prefira não recomendar óleos essenciais nem misturas com promessas de crescimento. Se quiser hidratar, escolha um produto simples que já tolere.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900">“Posso fazer os exercícios todos os dias?”</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    O circuito foi pensado como uma atividade leve, mas não é necessário fazê-lo diariamente. Faça apenas se for confortável e descanse quando precisar.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <h4 className="font-semibold text-sm text-stone-900">“A massagem pode substituir exames?”</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Não. Estar familiarizada com o próprio corpo pode ajudar a perceber mudanças, mas massagem ou autoexame não substituem avaliação clínica nem exames de rastreamento.
                  </p>
                </div>

              </div>

              {/* Complete Educational Disclaimer Box */}
              <div className="bg-stone-100 rounded-xl p-4 text-[11px] text-stone-600 space-y-2 border border-stone-200">
                <span className="font-semibold text-stone-900 block">Aviso Educativo Completo</span>
                <p className="leading-relaxed">
                  Este conteúdo é exclusivamente educativo e informativo. Não constitui consulta, diagnóstico ou tratamento médico. Os exercícios e o ritual descritos não prometem aumento, redução, firmeza, elevação ou qualquer mudança específica no tamanho, formato ou posição dos seios.
                </p>
              </div>

            </div>
          )}

        </main>

        {/* Disclaimer Modal */}
        {showDisclaimerModal && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-stone-900">Aviso Importante</h3>
                <button onClick={() => setShowDisclaimerModal(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Este material é educativo e não substitui avaliação ou orientação de profissionais de saúde. Não promete resultados estéticos ou terapêuticos. Os exercícios fortalecem o peitoral e a postura, mas não alteram o tecido mamário.
              </p>
              <button 
                onClick={() => setShowDisclaimerModal(false)}
                className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-2.5 rounded-xl text-sm transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen High-Quality Zoom Lightbox Modal */}
        {zoomedExerciseIndex !== null && (
          <div 
            className="fixed inset-0 z-[9999] bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none animate-fadeIn overscroll-none"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex flex-col pr-2">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                  Exercício {zoomedExerciseIndex + 1} de {exercisesData.length} (Alta Resolução)
                </span>
                <h3 className="text-white font-serif font-semibold text-base sm:text-lg leading-tight truncate">
                  {exercisesData[zoomedExerciseIndex].title}
                </h3>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Zoom Scale Buttons */}
                <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg p-0.5 text-xs text-white">
                  <button 
                    onClick={() => setZoomScale(prev => Math.max(1, +(prev - 0.25).toFixed(2)))} 
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 disabled:opacity-30"
                    disabled={zoomScale <= 1}
                    title="Diminuir Zoom"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-stone-300 min-w-[3rem] text-center">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button 
                    onClick={() => setZoomScale(prev => Math.min(2.5, +(prev + 0.25).toFixed(2)))} 
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300 disabled:opacity-30"
                    disabled={zoomScale >= 2.5}
                    title="Aumentar Zoom"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => { setZoomedExerciseIndex(null); setZoomScale(1); }} 
                  className="bg-white/10 hover:bg-rose-900 text-white p-2 rounded-full transition border border-white/10"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Stage */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden my-2">
              {/* Prev Button */}
              <button 
                onClick={() => {
                  setZoomedExerciseIndex(prev => (prev !== null && prev > 0 ? prev - 1 : exercisesData.length - 1));
                  setZoomScale(1);
                }}
                className="absolute left-2 z-20 bg-stone-900/80 hover:bg-stone-800 text-white p-2.5 rounded-full border border-stone-700 shadow-xl transition"
                title="Exercício anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* High Quality Image Stage */}
              <div className="w-full h-full flex items-center justify-center overflow-auto p-1">
                <img 
                  src={exercisesData[zoomedExerciseIndex].image} 
                  alt={exercisesData[zoomedExerciseIndex].title}
                  className="max-h-[68vh] sm:max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${zoomScale})` }}
                  loading="eager"
                />
              </div>

              {/* Next Button */}
              <button 
                onClick={() => {
                  setZoomedExerciseIndex(prev => (prev !== null && prev < exercisesData.length - 1 ? prev + 1 : 0));
                  setZoomScale(1);
                }}
                className="absolute right-2 z-20 bg-stone-900/80 hover:bg-stone-800 text-white p-2.5 rounded-full border border-stone-700 shadow-xl transition"
                title="Próximo exercício"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Info & Close */}
            <div className="w-full pt-2 border-t border-stone-800 flex flex-col gap-2">
              <div className="bg-stone-900/90 rounded-xl p-3 border border-stone-800 text-left">
                <span className="text-emerald-400 font-semibold text-xs block">
                  {exercisesData[zoomedExerciseIndex].time}
                </span>
                <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                  {exercisesData[zoomedExerciseIndex].desc}
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setZoomScale(1)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium px-4 py-2.5 rounded-xl transition"
                >
                  Redefinir Zoom
                </button>
                <button 
                  onClick={() => { setZoomedExerciseIndex(null); setZoomScale(1); }}
                  className="flex-1 bg-rose-900 hover:bg-rose-800 text-white font-medium py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                >
                  <span>Fechar Visualização</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <nav className="bg-white border-t border-stone-200 px-3 py-2 flex justify-around items-center absolute bottom-0 left-0 right-0 z-30 shadow-lg">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'home' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Início</span>
          </button>

          <button 
            onClick={() => setActiveTab('body')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'body' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px]">Corpo</span>
          </button>

          <button 
            onClick={() => setActiveTab('ritual')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'ritual' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px]">Ritual</span>
          </button>

          <button 
            onClick={() => setActiveTab('exercises')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'exercises' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Exercícios</span>
          </button>

          <button 
            onClick={() => setActiveTab('habits')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'habits' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">Hábitos</span>
          </button>

          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 p-1.5 transition ${activeTab === 'progress' ? 'text-rose-900 font-semibold' : 'text-stone-400 hover:text-stone-700'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Progresso</span>
          </button>

        </nav>

      </div>

    </div>
  );
}

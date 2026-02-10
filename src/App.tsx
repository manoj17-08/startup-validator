import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';

function App() {
  const [view, setView] = useState<'input' | 'dashboard'>('input');
  const [currentIdea, setCurrentIdea] = useState('');

  const handleIdeaSubmit = (idea: string) => {
    setCurrentIdea(idea);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InputSection onSubmit={handleIdeaSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setView('input')}
                className="mb-6 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm"
              >
                ← New Idea
              </button>
              <Dashboard idea={currentIdea} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

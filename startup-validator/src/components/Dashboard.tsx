import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, Map, Terminal, Loader2, FileText, Download, type LucideIcon } from 'lucide-react';
import { type AgentMessage, MOCK_DEBATE, MOCK_SWOT, MOCK_RADAR } from '../mockData';
import { generatePDFReport } from '../utils/pdfGenerator';
import { SWOTAnalysis } from './SWOTAnalysis';
import { RadarChart } from './RadarChart';
import clsx from 'clsx';

interface DashboardProps {
    idea: string;
}

const AgentCard = ({
    name,
    icon: Icon,
    color,
    messages,
    status
}: {
    name: string;
    icon: LucideIcon;
    color: string;
    messages: AgentMessage[];
    status: 'idle' | 'thinking' | 'done';
}) => {
    return (
        <div className={clsx(
            "relative h-[600px] rounded-3xl border bg-slate-900/50 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-500",
            status === 'thinking' ? `border-${color}-500/50 shadow-[0_0_30px_-5px_var(--color-${color}-500)]` : "border-slate-800"
        )}>
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg", `bg-${color}-500/10 text-${color}-400`)}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{name}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                            {status === 'thinking' ? 'Processing...' : status === 'done' ? 'Complete' : 'Waiting'}
                        </p>
                    </div>
                </div>
                {status === 'thinking' && (
                    <Loader2 className={`animate-spin text-${color}-400`} size={20} />
                )}
            </div>

            {/* Content Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
                        >
                            <div className="flex gap-2 items-center mb-2">
                                <span className={clsx(
                                    "text-xs font-mono px-2 py-0.5 rounded-full",
                                    msg.type === 'action' ? "bg-blue-500/20 text-blue-300" :
                                        msg.type === 'final' ? "bg-emerald-500/20 text-emerald-300" :
                                            "bg-slate-700 text-slate-300"
                                )}>
                                    {msg.type.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-600">{new Date(msg.timestamp).toLocaleTimeString()} s</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {msg.content}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Decorative Bottom Gradient */}
            <div className={clsx("h-1 w-full", `bg-gradient-to-r from-transparent via-${color}-500/50 to-transparent`)} />
        </div>

    );
};

export const Dashboard: React.FC<DashboardProps> = ({ idea }) => {
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [activeAgents, setActiveAgents] = useState<Record<string, 'idle' | 'thinking' | 'done'>>({
        Researcher: 'thinking',
        Critic: 'idle',
        Planner: 'idle'
    });

    // Simulation effect
    useEffect(() => {
        let currentIndex = 0;

        // Initial state
        setActiveAgents({ Researcher: 'thinking', Critic: 'idle', Planner: 'idle' });

        const interval = setInterval(() => {
            if (currentIndex >= MOCK_DEBATE.length) {
                clearInterval(interval);
                setActiveAgents({ Researcher: 'done', Critic: 'done', Planner: 'done' });
                return;
            }

            const msg = MOCK_DEBATE[currentIndex];
            setMessages(prev => [...prev, msg]);

            // Update active status based on who's talking
            setActiveAgents(prev => {
                const next = { ...prev };
                // Mark current speaker as thinking
                next[msg.agent] = 'thinking';
                // If switching agents, mark others as done/idle logic could be more complex but simple for now
                if (currentIndex > 0 && MOCK_DEBATE[currentIndex - 1].agent !== msg.agent) {
                    next[MOCK_DEBATE[currentIndex - 1].agent] = 'done';
                }
                return next;
            });

            currentIndex++;
        }, 2500); // Delay between messages

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex items-center gap-2 text-slate-500 mb-2">
                    <Terminal size={14} />
                    <span className="text-sm font-mono">SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Evaluating: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">"{idea}"</span></h2>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <AgentCard
                    name="Market Researcher"
                    icon={Search}
                    color="blue"
                    status={activeAgents.Researcher}
                    messages={messages.filter(m => m.agent === 'Researcher')}
                />
                <AgentCard
                    name="Chief Critic"
                    icon={AlertTriangle}
                    color="red"
                    status={activeAgents.Critic}
                    messages={messages.filter(m => m.agent === 'Critic')}
                />
                <AgentCard
                    name="Strategic Planner"
                    icon={Map}
                    color="emerald"
                    status={activeAgents.Planner}
                    messages={messages.filter(m => m.agent === 'Planner')}
                />
            </div>

            {/* Advanced Analytics Section */}
            {activeAgents.Planner === 'done' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
                >
                    <div className="lg:col-span-2">
                        <SWOTAnalysis data={MOCK_SWOT} />
                    </div>
                    <div className="bg-slate-900/50 rounded-3xl p-1 border border-slate-800">
                        <RadarChart data={MOCK_RADAR} />
                    </div>
                </motion.div>
            )}

            {/* Unified Transcript & Actions */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <FileText className="text-blue-400" />
                        <h3 className="text-xl font-bold">Scientific Debate Transcript</h3>
                    </div>
                    {activeAgents.Planner === 'done' && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => generatePDFReport(idea, messages)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            <Download size={20} />
                            Download Feasibility Report
                        </motion.button>
                    )}
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex gap-4 group">
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                                    msg.agent === 'Researcher' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                        msg.agent === 'Critic' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                )}>
                                    {msg.agent === 'Researcher' ? <Search size={18} /> :
                                        msg.agent === 'Critic' ? <AlertTriangle size={18} /> :
                                            <Map size={18} />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <span className={clsx("font-bold text-sm",
                                            msg.agent === 'Researcher' ? "text-blue-400" :
                                                msg.agent === 'Critic' ? "text-red-400" :
                                                    "text-emerald-400"
                                        )}>
                                            {msg.agent.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <div className="text-center text-slate-600 py-12">
                                Waiting for agents to start the debate...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

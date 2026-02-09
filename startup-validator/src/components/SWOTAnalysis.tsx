import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Skull } from 'lucide-react';
import clsx from 'clsx';

interface SWOTProps {
    data: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
}

const SwotCard = ({ title, items, icon: Icon, color, delay }: { title: string, items: string[], icon: any, color: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className={clsx(
            "p-6 rounded-2xl border bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300",
            `border-${color}-500/20 hover:border-${color}-500/50`
        )}
    >
        <div className={clsx("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20", `bg-${color}-500`)} />

        <div className="flex items-center gap-3 mb-4">
            <div className={clsx("p-2 rounded-lg", `bg-${color}-500/10 text-${color}-400`)}>
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className={clsx("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", `bg-${color}-500`)} />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

export const SWOTAnalysis: React.FC<SWOTProps> = ({ data }) => {
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sword className="text-purple-500" />
                Strategic SWOT Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SwotCard
                    title="Strengths"
                    items={data.strengths}
                    icon={Shield}
                    color="emerald"
                    delay={0.1}
                />
                <SwotCard
                    title="Weaknesses"
                    items={data.weaknesses}
                    icon={Zap}
                    color="orange"
                    delay={0.2}
                />
                <SwotCard
                    title="Opportunities"
                    items={data.opportunities}
                    icon={Sword}
                    color="blue"
                    delay={0.3}
                />
                <SwotCard
                    title="Threats"
                    items={data.threats}
                    icon={Skull}
                    color="red"
                    delay={0.4}
                />
            </div>
        </div>
    );
};

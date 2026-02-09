wimport React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
    data: {
        label: string;
        value: number; // 0-100
    }[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
    const size = 300;
    const center = size / 2;
    const radius = (size - 60) / 2;
    const levels = 5;

    const getCoordinates = (value: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const x = center + (radius * (value / 100)) * Math.cos(angle);
        const y = center + (radius * (value / 100)) * Math.sin(angle);
        return { x, y };
    };

    const pathData = data.map((d, i) => {
        const { x, y } = getCoordinates(d.value, i, data.length);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

            <h3 className="text-xl font-bold text-white mb-6 z-10">Market Viability Radar</h3>

            <div className="relative z-10">
                <svg width={size} height={size} className="overflow-visible">
                    {/* Grid Levels */}
                    {[...Array(levels)].map((_, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={(radius * (i + 1)) / levels}
                            fill="none"
                            stroke="#334155"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Axes */}
                    {data.map((_, i) => {
                        const { x, y } = getCoordinates(100, i, data.length);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="#334155"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Data Path */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d={pathData}
                        fill="url(#gradient)"
                        stroke="#60a5fa"
                        strokeWidth="3"
                    />

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>

                    {/* Labels */}
                    {data.map((d, i) => {
                        const { x, y } = getCoordinates(115, i, data.length);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#94a3b8"
                                fontSize="12"
                                fontWeight="500"
                            >
                                {d.label}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-6 flex gap-4 text-sm z-10">
                {data.map((d) => (
                    <div key={d.label} className="flex flex-col items-center">
                        <span className="text-slate-500 text-xs uppercase">{d.label}</span>
                        <span className="font-bold text-blue-400">{d.value}/100</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

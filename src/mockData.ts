export interface AgentMessage {
    id: string;
    agent: 'Researcher' | 'Critic' | 'Planner';
    content: string;
    timestamp: number;
    type: 'thought' | 'action' | 'final';
}

export const MOCK_DEBATE: AgentMessage[] = [
    {
        id: '1',
        agent: 'Researcher',
        content: 'Searching specifically for "Uber for Dog Walking" competitors and market size...',
        timestamp: 1000,
        type: 'action'
    },
    {
        id: '2',
        agent: 'Researcher',
        content: 'Found major competitors: Wag!, Rover. Market is saturated but growing. Key differentiator needed.',
        timestamp: 3000,
        type: 'thought'
    },
    {
        id: '3',
        agent: 'Critic',
        content: 'Analyzing risks based on Researcher findings. High barrier to entry due to network effects of Rover.',
        timestamp: 4500,
        type: 'action'
    },
    {
        id: '4',
        agent: 'Critic',
        content: 'RISK ALERT: Customer Acquisition Cost (CAC) will be astronomical. Trust and safety are massive liabilities.',
        timestamp: 6000,
        type: 'thought'
    },
    {
        id: '5',
        agent: 'Planner',
        content: 'Synthesizing strategy. To bypass direct competition, niche down or focus on a specific untapped vertical (e.g., elderly dog care, premium grooming integration).',
        timestamp: 8000,
        type: 'thought'
    },
    {
        id: '6',
        agent: 'Planner',
        content: 'Proposed Pivot: "Premium Concierge for Diabetic Dogs". High value, low competition.',
        timestamp: 10000,
        type: 'final'
    }
];

export const MOCK_SWOT = {
    strengths: ['Growing Market Demand', 'Low Overhead Model', 'Strong Network Effects', 'Scalable Tech Stack'],
    weaknesses: ['High Competition', 'Low Entry Barrier', 'Trust & Safety Risks', 'Operational Complexity'],
    opportunities: ['Niche Verticals (Elderly Dogs)', 'Premium Subscription Models', 'Partnerships with Vets', 'AI-Driven Matching'],
    threats: ['Regulatory Changes', 'Platform Leakage', 'Economic Downturn', 'Competitor Consolidation']
};

export const MOCK_RADAR = [
    { label: 'Innovation', value: 65 },
    { label: 'Feasibility', value: 85 },
    { label: 'Market Size', value: 90 },
    { label: 'Scalability', value: 75 },
    { label: 'Moat', value: 40 }
];

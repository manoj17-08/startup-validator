from crewai import Task

def create_tasks(researcher, critic, planner):
    # 1. Research Task
    research_task = Task(
        description=(
            "Conduct a comprehensive market analysis for the startup idea: '{idea}'. "
            "Identify at least 3 major competitors, their key weaknesses, and current market trends for 2024-2026. "
            "Look for recent news or funding rounds in this space."
        ),
        expected_output=(
            "A detailed market research report containing competitor analysis, "
            "market size estimation, and key consumer trends."
        ),
        agent=researcher
    )

    # 2. Critique Task
    critique_task = Task(
        description=(
            "Review the research findings and the original idea: '{idea}'. "
            "Play Devil's Advocate. List 5 specific reasons why this startup might fail. "
            "Focus on customer acquisition costs, technical feasibility, and market saturation."
        ),
        expected_output=(
            "A critical risk assessment report highlighting the top 5 dangers "
            "and potential pitfalls of the business model."
        ),
        agent=critic,
        context=[research_task] # Depends on research
    )

    # 3. Strategy Task
    strategy_task = Task(
        description=(
            "Based on the research and the critical feedback, develop a strategic roadmap. "
            "Address the specific risks raised by the Critic. "
            "Provide a final 'Go/No-Go' recommendation and a unique value proposition that avoids the identified pitfalls."
        ),
        expected_output=(
            "A strategic roadmap document with a clear value proposition, "
            "mitigation strategies for the identified risks, and a final verdict."
        ),
        agent=planner,
        context=[research_task, critique_task] # Depends on both
    )
    
    return research_task, critique_task, strategy_task

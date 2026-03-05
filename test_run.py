
import os
import sys
import time

# Add python_core to path
sys.path.append(os.path.join(os.getcwd(), 'python_core'))

from crewai import Crew, Process
from agents import create_agents
from tasks import create_tasks

print("Creating agents and tasks...")
try:
    researcher, critic, planner = create_agents()
    research_task, critique_task, strategy_task = create_tasks(researcher, critic, planner)
    
    # Create a smaller crew for testing to save tokens/time if possible, 
    # but the tasks are interdependent so we need all of them.
    # We will use a very simple idea.
    
    crew = Crew(
        agents=[researcher, critic, planner],
        tasks=[research_task, critique_task, strategy_task],
        verbose=True,
        process=Process.sequential
    )
    
    idea = "A lemonade stand with a subscription model."
    print(f"Kickoff with idea: {idea}")
    
    start_time = time.time()
    result = crew.kickoff(inputs={'idea': idea})
    end_time = time.time()
    
    print("\n\n########################")
    print("## EXECUTION SUCCESSFUL ##")
    print("########################\n")
    print(f"Time taken: {end_time - start_time:.2f}s")
    print("Result snippet:")
    print(str(result)[:500])

except Exception as e:
    print("\n\n########################")
    print("## EXECUTION FAILED ##")
    print("########################\n")
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

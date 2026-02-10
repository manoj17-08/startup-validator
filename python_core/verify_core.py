from agents import create_agents
from tasks import create_tasks
from crewai import Crew, Process
import os

# Mock Streamlit for local testing
class MockStreamlit:
    def write(self, text):
        print(f"[ST.WRITE] {text}")
    def markdown(self, text):
        print(f"[ST.MARKDOWN] {text}")
    def error(self, text):
        print(f"[ST.ERROR] {text}")

def main():
    print("Initializing agents...")
    try:
        researcher, critic, planner = create_agents()
        research_task, critique_task, strategy_task = create_tasks(researcher, critic, planner)
        
        print("Creating crew...")
        crew = Crew(
            agents=[researcher, critic, planner],
            tasks=[research_task, critique_task, strategy_task],
            verbose=True,
            process=Process.sequential
        )
        
        print("Kickoff...")
        # Simple test idea
        result = crew.kickoff(inputs={'idea': 'A coffee shop that sells only cold brew'})
        print("Result:", result)
        print("SUCCESS")
        
    except Exception as e:
        print(f"FAILURE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

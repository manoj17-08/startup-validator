
import os
import sys

# Add python_core to path
sys.path.append(os.path.join(os.getcwd(), 'python_core'))

print("Attempting imports...")
try:
    from crewai import Agent, Task, Crew, Process
    print("CrewAI imported successfully.")
except ImportError as e:
    print(f"Error importing CrewAI: {e}")
    sys.exit(1)

try:
    from agents import create_agents
    from tasks import create_tasks
    print("Agents and Tasks imported successfully.")
except ImportError as e:
    print(f"Error importing local modules: {e}")
    # Print traceback
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Attempting to create agents...")
try:
    researcher, critic, planner = create_agents()
    print("Agents created.")
except Exception as e:
    print(f"Error creating agents: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Diagnostic passed.")

import os
os.environ["CREWAI_TELEMETRY_OPT_OUT"] = "true"
import signal
import threading

# Patch signal to avoid errors in threads
if threading.current_thread() is not threading.main_thread():
    original_signal = signal.signal
    def threaded_signal(sig, handler):
        if threading.current_thread() is not threading.main_thread():
            return
        return original_signal(sig, handler)
    signal.signal = threaded_signal

import streamlit as st
from crewai import Crew, Process
from agents import create_agents
from tasks import create_tasks
from utils import create_pdf
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    st.set_page_config(page_title="Startup Validator", page_icon="🚀", layout="wide")

    # --- Custom CSS for High-Fidelity "Organic Tech" Look ---
    st.markdown("""
        <style>
        /* Import Premium Font */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        /* Reset and Base Styles */
        * {
            font-family: 'Outfit', sans-serif !important;
        }

        /* Animated Aurora Background */
        .stApp {
            background: linear-gradient(-45deg, #021a1a, #063d35, #0d5f57, #134e4a);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            color: #e0f2f1;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Clean Streamlit UI */
        header {visibility: hidden;}
        footer {visibility: hidden;}
        .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
            max-width: 66rem;
        }

        /* Deep Glassmorphism Cards */
        div[data-testid="stExpander"], div[data-testid="stStatusWidget"], section[data-testid="stSidebar"] > div {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        div[data-testid="stExpander"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Typography */
        h1 {
            font-weight: 700;
            background: linear-gradient(to right, #4ade80, #2dd4bf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: normal; /* Resetting to avoid overlap */
            padding-bottom: 10px;
            line-height: 1.2;
        }
        h2, h3 {
            color: #ccfbf1 !important;
            font-weight: 600;
            letter-spacing: 0.5px; /* Added spacing */
            line-height: 1.4;
        }
        p, .stMarkdown, div, span {
            color: #99f6e4;
            line-height: 1.8 !important; /* Increased for readability */
            font-weight: 300;
            letter-spacing: 0.3px;
        }

        /* Sidebar Styling */
        section[data-testid="stSidebar"] {
            background-color: rgba(0, 0, 0, 0.2);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Inputs - Organic Shapes */
        .stTextArea>div>div>textarea {
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            color: #ffffff;
            font-size: 16px;
        }
        .stTextArea>div>div>textarea:focus {
            border: 1px solid #2dd4bf;
            box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
        }

        /* Buttons - Glowing Neon */
        .stButton>button {
            background: linear-gradient(90deg, #10b981, #0d9488);
            color: white;
            border: none;
            border-radius: 50px; /* Pill shape */
            padding: 0.75rem 2rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
            width: 100%;
        }
        .stButton>button:hover {
            background: linear-gradient(90deg, #059669, #0f766e);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
            transform: scale(1.02);
        }

        /* Tabs - Minimalist */
        .stTabs [data-baseweb="tab-list"] {
            gap: 20px;
            background-color: transparent;
        }
        .stTabs [data-baseweb="tab"] {
            height: auto;
            background-color: transparent;
            border: none;
            color: #5eead4;
            font-weight: 500;
            padding-bottom: 10px;
        }
        .stTabs [aria-selected="true"] {
             color: #ffffff;
             border-bottom: 2px solid #2dd4bf;
        }
        
        /* Status Container */
        div[data-testid="stStatusWidget"] {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid #10b981;
        }

        </style>
        """, unsafe_allow_html=True)

    st.title("🚀 Automated Startup Validator")
    st.markdown("### AI-Powered Decision Support for Founders")

    # Check for API Keys
    if not os.getenv("GOOGLE_API_KEY") or not os.getenv("TAVILY_API_KEY"):
        st.error("⚠️ API Keys are missing! Please check your .env file.")
        st.stop()

    with st.sidebar:
        st.header("💡 Input Your Idea")
        idea = st.text_area(
            "Describe your startup concept:",
            height=150,
            placeholder="e.g. A subscription service for eco-friendly baby diapers delivered by drones..."
        )
        submitted = st.button("Validate Idea ⚡", type="primary")
        
        st.divider()
        st.markdown("**The Crew:**")
        st.markdown("- 🕵️ **Market Researcher**")
        st.markdown("- ⚖️ **Cynical Critic**")
        st.markdown("- 🎯 **Strategic Planner**")

    # Tabs for organized layout
    tab1, tab2, tab3 = st.tabs(["📊 Strategic Report", "🛠️ Live Agent Logs", "📄 Raw Data"])

    if submitted and idea:
        # Define the streaming callback
        def step_callback(step_output):
            # This function updates the "Live Agent Logs" tab in real-time
            with tab2:
                # Handle list of steps (sometimes happens)
                if isinstance(step_output, list):
                    for step in step_output:
                        step_callback(step)
                    return

                # Check for AgentAction (has tool and tool_input)
                if hasattr(step_output, 'tool') and hasattr(step_output, 'tool_input'):
                    agent_name = getattr(step_output, 'agent', 'Agent')
                    with st.expander(f"🤖 Agent Action: {agent_name}", expanded=True):
                        st.markdown(f"**Thought:** {getattr(step_output, 'thought', '')}")
                        st.markdown(f"**Used Tool:** `{step_output.tool}`")
                        st.markdown(f"**Tool Input:** `{step_output.tool_input}`")
                
                # Check for AgentFinish (has return_values or output)
                elif hasattr(step_output, 'output'):
                    with st.expander("✅ Agent Conclusion", expanded=True):
                         st.markdown(f"**Conclusion:** {step_output.output}")
                
                else:
                    # Fallback
                    with st.expander("🤔 Agent Thought", expanded=True):
                        st.write(step_output)

        with tab1:
            with st.status("🤖 **Agents are working...**", expanded=True) as status:
                st.write("🚀 Kickstarting the crew...")
                
                # Create fresh agents and tasks for this run
                researcher, critic, planner = create_agents()
                research_task, critique_task, strategy_task = create_tasks(researcher, critic, planner)
                
                crew = Crew(
                    agents=[researcher, critic, planner],
                    tasks=[research_task, critique_task, strategy_task],
                    verbose=True,
                    process=Process.sequential,
                    step_callback=step_callback # Injecting the callback
                )
                
                try:
                    result = crew.kickoff(inputs={'idea': idea})
                    status.update(label="✅ **Validation Complete!**", state="complete", expanded=False)
                    st.divider()
                    st.markdown(result)
                    
                    # PDF Download
                    st.subheader("📥 Export Report")
                    pdf_bytes = create_pdf(str(result), idea)
                    st.download_button(
                        label="📄 Download Business Plan (PDF)",
                        data=pdf_bytes,
                        file_name="startup_validation_report.pdf",
                        mime="application/pdf"
                    )
                except Exception as e:
                    import time
                    status.update(label="⚠️ **Error Occurred**", state="error", expanded=False)
                    st.error(f"An error occurred: {str(e)}")
                    if "429" in str(e):
                         st.warning("⚠️ **Volume Limit Reached**: The AI is experiencing high traffic. Please wait 60 seconds and try again.")
                    else:
                         st.error("Something went wrong. Please check your API keys and connection.")

        with tab3:
            st.subheader("Raw Task Outputs")
            st.info("Raw task outputs are aggregated in the final report.")
            if research_task.output:
                with st.expander("Market Research Raw Output"):
                    st.write(research_task.output.raw)
            if critique_task.output:
                with st.expander("Criticism Raw Output"):
                    st.write(critique_task.output.raw)

    elif submitted and not idea:
        st.warning("Please enter a startup idea first.")
    
    else:
        with tab1:
            st.info("👈 Enter your startup idea in the sidebar to begin validation.")

if __name__ == "__main__":
    main()

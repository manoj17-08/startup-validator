# 🚀 Automated Startup Validator

A high-fidelity AI-powered dashboard that validates startup ideas using autonomous agents. Built with **CrewAI**, **Streamlit**, and **Gemini**.

## ✨ Features

-   **Autonomous Agents**:
    -   🕵️ **Market Researcher**: Scours the web for competitors and trends.
    -   ⚖️ **Cynical Critic**: brutally analyzes risks and failure points.
    -   🎯 **Strategic Planner**: Develops a roadmap and value proposition.
-   **High-Fidelity UI**: "Organic Tech" aesthetic with animated aurora backgrounds and glassmorphism.
-   **Live Streaming**: Watch agents think and act in real-time.
-   **PDF Export**: Download a professional business plan report.

## 🛠️ Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/manoj17-08/startup-validator.git
    cd startup-validator
    ```

2.  **Install Dependencies**:
    Requires Python 3.10+.
    ```bash
    pip install -r python_core/requirements.txt
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your API keys:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    TAVILY_API_KEY=your_tavily_api_key
    ```

## 🚀 Run the App

Execute the following command in your terminal:

```bash
python -m streamlit run python_core/app.py
```

The app will open in your browser at `http://localhost:8501`.

## ⚠️ Note on API Limits

The app uses the free tier of Google Gemini API, which has a rate limit of **15 requests per minute**.
-   If you see a "Volume Limit Reached" warning, **wait 60 seconds** before trying again.
-   The app includes automatic rate limiting to help prevent this.

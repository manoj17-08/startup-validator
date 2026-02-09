import os
from dotenv import load_dotenv
from crewai.tools.base_tool import BaseTool
from tavily import TavilyClient

load_dotenv()

class MarketSearchTool(BaseTool):
    name: str = "Market Search"
    description: str = "Search the internet for accurate market data, competitors, and trends."

    def _run(self, query: str) -> str:
        tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        return str(tavily.search(query=query))

market_search_tool = MarketSearchTool()

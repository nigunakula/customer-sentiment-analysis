from langgraph.graph import StateGraph
from langgraph.graph import END

from app.graph.state import CallState

from app.graph.nodes import (
    sentiment_node,
    emotion_node,
    summary_node,
    risk_node
)

workflow = StateGraph(CallState)

workflow.add_node(
    "sentiment",
    sentiment_node
)

workflow.add_node(
    "emotion",
    emotion_node
)

workflow.add_node(
    "summary",
    summary_node
)

workflow.add_node(
    "risk",
    risk_node
)

workflow.set_entry_point(
    "sentiment"
)

workflow.add_edge(
    "sentiment",
    "emotion"
)

workflow.add_edge(
    "emotion",
    "summary"
)

workflow.add_edge(
    "summary",
    "risk"
)

workflow.add_edge(
    "risk",
    END
)

graph = workflow.compile()
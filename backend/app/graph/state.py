from typing import TypedDict


class CallState(TypedDict):

    transcript: str

    sentiment: dict

    emotion: str

    summary: str

    risk: str
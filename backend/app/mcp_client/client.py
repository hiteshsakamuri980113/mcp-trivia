import os
import json
import os
from fastapi import FastAPI
from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters, SseServerParams

from fastapi import APIRouter
from google.genai import types
from dotenv import load_dotenv
from pydantic import BaseModel
from app.utils.json_parser import extract_questions_from_mcp_response


load_dotenv()
router = APIRouter()

# Pydantic model for request body
class TriviaRequest(BaseModel):
    topic: str
    difficulty: str
    count: int = 3

APP_NAME="app-client-01"
USER_ID="hitesh-01"
SESSION_ID="session-01"
initial_state={
    "formatted_questions": []
}

TARGET_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "mcp_server", "server.py")

_session = None
_session_service = None
_final_response = None


async def create_session():
    try:
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
            state=initial_state
        )

        global _session
        _session = session

        global _session_service
        _session_service = session_service

    except Exception as e:
        print(f"error while creating a session: {e}")


root_agent = Agent(
    name="trivia_agent",
    model="gemini-2.0-flash",
    description="An agent that coordinates with MCP server to provide trivia questions.",
    instruction="""You are a trivia coordinator agent that MUST follow these rules:

1. When you receive a request for trivia questions with topic, difficulty, and count, you MUST use the available MCP tool to get questions
2. Call the get_trivia_questions tool with the exact topic, difficulty, and count parameters provided
3. Once you receive the response from the MCP tool, output the EXACT response without any modifications
4. Do not add, remove, or modify any content from the MCP tool response
5. Store the complete response in the formatted_questions state
6. Your response should be exactly what the MCP tool returns - no additional formatting or explanations

Steps to follow:
1. Use the get_trivia_questions MCP tool with the provided topic, difficulty, and count
2. Take the tool's response and output it exactly as received
3. Store this response in the state under formatted_questions key""",
    tools=[
        MCPToolset(
            connection_params=StdioServerParameters(
                command="python",
                args=[
                    os.path.abspath(TARGET_FILE_PATH)
                ]
            )
        )
        # MCPToolset(
        #     connection_params=SseServerParams(
        #         url="http://localhost:8001"
        #     )
        # )

    ],
    output_key="formatted_questions"
)


@router.post("/get-questions")
async def get_questions(request: TriviaRequest):

    try:
        print(f"get questions call received! Topic: {request.topic}, Difficulty: {request.difficulty}")
        await create_session()

        runner = Runner(
            agent=root_agent,
            app_name=APP_NAME,
            session_service=_session_service
        )

        content = types.Content(role='user', parts=[types.Part(text=f"""Please use the get_trivia_questions MCP tool to generate trivia questions.

Parameters:
- Topic: {request.topic}
- Difficulty: {request.difficulty}
- Count: {request.count}

Call the get_trivia_questions tool with these parameters and return the exact response from the tool without any modifications.""")])

        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content):

            if event.is_final_response():
                if event.content and event.content.parts:
                    global _final_response
                    _final_response = event.content.parts[0].text

        print(f"Raw response from MCP server: {_final_response}")
        
        # Use the JSON parser to handle the response
        parse_result = extract_questions_from_mcp_response(_final_response)
        
        if parse_result["success"]:
            return {
                "success": True,
                "questions": parse_result["questions"]
            }
        else:
            return {
                "success": False,
                "questions": [],
                "error": parse_result["error"],
                "raw_response": _final_response
            }

    except Exception as e:
        print(f"error while running the agent: {e}")
        return {
            "success": False,
            "questions": [],
            "error": str(e)
        }





        







    
        






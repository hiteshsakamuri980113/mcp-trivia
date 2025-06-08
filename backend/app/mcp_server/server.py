from fastmcp import FastMCP
from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.tools import google_search
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

APP_NAME="app-server-01"
USER_ID="hitesh-01"
SESSION_ID="session-01"

_session=None
_session_service=None
_final_response=None

global_state={
    "questions": []
}

mcp = FastMCP("A trivia mcp!")

async def create_session():
    try:
        session_service = InMemorySessionService()

        session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
            state=dict(global_state)
        )

        global _session
        _session = session

        global _session_service
        _session_service = session_service

    except Exception as e:
        print(f"error while creating a session: {e}")

trivia_questions_agent = Agent(
    name="trivia_questions_agent",
    model="gemini-2.0-flash",
    description="An agent to provide trivia questions with multiple choice answers.",
    instruction="""You are a trivia questions agent that MUST follow these rules EXACTLY:

1. ALWAYS use the google_search tool to find trivia questions - NEVER use your own knowledge
2. Search for trivia questions related to the given topic and difficulty level
3. Generate EXACTLY the requested number of multiple choice questions (usually 3-10)
4. Your response MUST be ONLY a valid JSON array with NO markdown, NO explanations, NO additional text
5. Each question must have this EXACT structure:
   {
     "question": "Question text here?",
     "options": ["Option A", "Option B", "Option C", "Option D"],
     "correct_answer": 0,
     "explanation": "Brief explanation of the correct answer"
   }
6. Return ONLY the JSON array starting with [ and ending with ]
7. DO NOT wrap the response in markdown code blocks
8. DO NOT add any text before or after the JSON array
9. IMPORTANT: When including titles, names, or quotes in your questions:
   - Use simple double quotes for JSON strings
   - For movie/book titles, use simple text without extra quotes: Romeo and Juliet (not "Romeo and Juliet")
   - Avoid apostrophes in contractions - use full words: do not (not don't)
   - This prevents JSON parsing errors
10. Ensure questions are appropriate for the specified difficulty level:
   - Easy: Basic facts and common knowledge
   - Medium: Requires some specialized knowledge
   - Hard: Complex concepts and detailed knowledge
10. Use multiple google_search queries if needed to gather enough quality questions
11. Verify facts using google_search before including them in questions

CRITICAL: Your response must be ONLY valid JSON - nothing else!""",
    tools=[google_search],
    output_key="questions"
)


@mcp.tool()
async def get_trivia_questions(topic: str, difficulty: str, count: int = 3):

    await create_session()

    try:
        await create_session()

        runner = Runner(
            agent=trivia_questions_agent,
            app_name=APP_NAME,
            session_service=_session_service
        )

        content = types.Content(role='user', parts=[types.Part(text=f"""Generate {count} trivia questions about {topic} with {difficulty} difficulty.

CRITICAL REQUIREMENTS:
- Use google_search tool to find accurate information
- Return ONLY a valid JSON array - no markdown, no explanations, no extra text
- Start response with [ and end with ]
- Each question must have: question, options (4 choices), correct_answer (0-3), explanation
- For movie/book titles, use simple text without extra quotes: Romeo and Juliet (not "Romeo and Juliet")
- Avoid apostrophes in contractions - use full words: do not (not don't)

Topic: {topic}
Difficulty: {difficulty}
Count: {count}

Respond with ONLY the JSON array.""")])

        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content):

            if event.is_final_response():
                if event.content and event.content.parts:
                    global _final_response
                    _final_response = event.content.parts[0].text

        # Parse the JSON response and return the actual array
        import json
        try:
            # Clean the response - remove any markdown code blocks if present
            clean_response = _final_response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response.replace('```json', '').replace('```', '').strip()
            elif clean_response.startswith('```'):
                clean_response = clean_response.replace('```', '').strip()
            
            # Parse the JSON
            questions_array = json.loads(clean_response)
            
            # Return the parsed array directly
            return questions_array
            
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {e}")
            print(f"Raw response: {_final_response}")
            # Return a fallback structure
            return {
                "error": "Failed to parse response",
                "raw_response": _final_response
            }
    

    except Exception as e:
        print(f"error while running the agent: {e}")


if __name__ == "__main__":
    try:
        mcp.run()
    except Exception as e:
        print(f"error while running mcp server: {e}")











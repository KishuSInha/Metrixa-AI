from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os
import json
from engine import engine

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Metrixa AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins
    allow_credentials=True,
    allow_methods=["*"],  # Permits all methods
    allow_headers=["*"],  # Permits all headers
)

openai.api_key = os.getenv("OPENAI_API_KEY")

class PromptRequest(BaseModel):
    prompt: str

SYSTEM_PROMPT = """
You are the brain of Metrixa AI, a Windows system-level assistant.
Your job is to parse user prompts and return a JSON object representing the intended OS action.
Supported intents:
- open_app: { "target": "name of app" }
- toggle_dark_mode: { "enabled": true/false }
- file_action: { "action": "list/move/delete", "path": "...", "target": "..." }
- unknown: { "message": "I didn't understand that." }

Be concise. Only return the JSON.
"""

@app.post("/process")
async def process_prompt(request: PromptRequest):
    if not openai.api_key:
         raise HTTPException(status_code=500, detail="OpenAI API Key not configured.")
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        intent_json = json.loads(response.choices[0].message.content)
        intent = intent_json.get("intent")
        
        # Execute action using engine
        result = {"message": "Action processed", "intent": intent_json}
        
        if intent == "open_app":
            result["engine_result"] = engine.open_app(intent_json.get("target"))
        elif intent == "toggle_dark_mode":
            result["engine_result"] = engine.toggle_dark_mode(intent_json.get("enabled", True))
        elif intent == "file_action":
            result["engine_result"] = engine.manage_files(
                intent_json.get("action"), 
                intent_json.get("path"), 
                intent_json.get("target")
            )
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# โหลดตัวแปรจากไฟล์ .env (สำหรับ Local Dev เท่านั้น บน Vercel จะใช้ Cloud Env Vars)
load_dotenv()

# ตั้งค่า Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

# เริ่มต้นระบบ FastAPI
app = FastAPI(
    title="AI Backend API",
    description="Python FastAPI backend powered by Google Gemini (Vercel Ready)",
    version="1.0.0"
)

# เปิดใช้งาน CORS เพื่อให้หน้าเว็บ (Frontend) เรียกใช้ API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- กำหนดโครงสร้างข้อมูล (Models) ----
class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    reply: str

# ---- Endpoints ----
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "AI Backend is running on Vercel!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash') # อัปเดตเป็นโมเดลที่แนะนำ
        response = model.generate_content(request.prompt)
        return ChatResponse(reply=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Note: Vercel จะรันแอปผ่านตัวแปร app อัตโนมัติ

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# โหลดตัวแปรจากไฟล์ .env
load_dotenv()

# ตั้งค่า Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY or API_KEY == "your_api_key_here":
    print("WARNING: GEMINI_API_KEY is not set correctly in .env file.")

genai.configure(api_key=API_KEY)

# เริ่มต้นระบบ FastAPI
app = FastAPI(
    title="AI Backend API",
    description="Python FastAPI backend powered by Google Gemini",
    version="1.0.0"
)

# เปิดใช้งาน CORS เพื่อให้หน้าเว็บเรา (Frontend) เรียกใช้ API ข้ามโฟลเดอร์/พอร์ตได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ในตอนทดสอบอนุญาตให้เข้าถึงได้จากทุกที่ (ถ้าทำระบบจริงควรระบุโดเมนชัดเจน)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- กำหนดโครงสร้างข้อมูลรับ-ส่ง (Models) ----
class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    reply: str

# ---- Endpoints ----
@app.get("/")
async def health_check():
    """Endpoint สำหรับเช็คว่าเซิร์ฟเวอร์หลังบ้านยังทำงานอยู่หรือไม่"""
    return {"status": "ok", "message": "AI Backend is running!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """
    รับข้อความคำถาม (Prompt) ส่งให้ Gemini แล้วตอบผลลัพธ์กลับ
    """
    if not API_KEY or API_KEY == "your_api_key_here":
        raise HTTPException(status_code=500, detail="Gemini API Key is missing. Please set it in the .env file.")
    
    try:
        # ใช้โมเดล gemini-2.5-flash ที่มีความรวดเร็วและเป็นเวอร์ชันล่าสุด
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(request.prompt)
        
        return ChatResponse(reply=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Gemini: {str(e)}")

# วิธีรันเซิร์ฟเวอร์แบบ manual (หากไม่ได้รันผ่านสคริปต์):
# uvicorn main:app --reload

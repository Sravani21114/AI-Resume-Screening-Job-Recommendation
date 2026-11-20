from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from resume_parser import extract_text
from skill_extractor import extract_skills
from ats_score import calculate_score
from recommender import recommend_jobs

app = FastAPI(title="AI Resume Screening API")

# Add CORS Middleware to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "../uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Resume Screening API Running"}


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(filepath)
    skills = extract_skills(text)
    score = calculate_score(skills)
    jobs = recommend_jobs(skills)

    return {
        "skills": skills,
        "ATS Score": score,
        "Recommended Jobs": jobs
    }
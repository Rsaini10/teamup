
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="TeamUp Recommendation Engine")


# Student or project listing structure
class Listing(BaseModel):
    listingId: str = ""
    name: str = ""
    email: str = ""
    projectTitle: str = ""
    description: str = ""
    skills: str = ""


# Data received from Node.js
class RecommendationRequest(BaseModel):
    project: Listing
    students: List[Listing]


# Convert listing information into text
def create_text(listing):
    return " ".join([
        listing.projectTitle,
        listing.description,
        listing.skills
    ])


# Clean and separate skills
def normalize_skills(skills):
    return [
        skill.strip().lower()
        for skill in skills.replace(";", ",").replace("\n", ",").split(",")
        if skill.strip()
    ]


# Main recommendation API
@app.post("/recommend")
def recommend(data: RecommendationRequest):

    project = data.project
    students = data.students

    if not students:
        return {"recommendations": []}

    # Create text documents for comparison
    documents = [create_text(project)]

    for student in students:
        documents.append(create_text(student))

    # Convert text into numerical vectors
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2)
    )

    try:
        vectors = vectorizer.fit_transform(documents)

    except ValueError:
        return {"recommendations": []}

    # Calculate cosine similarity
    scores = cosine_similarity(
        vectors[0:1],
        vectors[1:]
    )[0]

    # Extract required project skills
    required_skills = normalize_skills(project.skills)

    recommendations = []

    for i, student in enumerate(students):

        # Extract student skills
        student_skills = normalize_skills(student.skills)

        # Find common skills
        matched_skills = [
            skill for skill in required_skills
            if skill in student_skills
        ]

        # Calculate similarity score
        score = round(float(scores[i]) * 100, 2)

        # Ignore students with zero similarity
        if score <= 0:
            continue

        recommendations.append({
            "listingId": student.listingId,
            "name": student.name,
            "email": student.email,
            "skills": student.skills,
            "matchedSkills": matched_skills,
            "matchScore": score
        })

    # Sort students from highest to lowest score
    recommendations.sort(
        key=lambda x: x["matchScore"],
        reverse=True
    )

    # Return top 5 students
    return {
        "recommendations": recommendations[:5]
    }


@app.get("/")
def home():
    return {
        "message": "TeamUp Recommendation Engine is running!"
    }

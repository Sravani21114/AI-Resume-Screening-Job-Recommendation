import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

jobs = pd.read_csv("../dataset/jobs.csv")


def recommend_jobs(skills):

    resume = " ".join(skills)

    resume_embedding = model.encode([resume])

    job_embeddings = model.encode(jobs["Skills"].tolist())

    similarity = cosine_similarity(
        resume_embedding,
        job_embeddings
    )[0]

    jobs["Score"] = similarity

    top = jobs.sort_values(
        by="Score",
        ascending=False
    )

    return top.head(5)[["Job Title", "Company"]].to_dict(
        orient="records"
    )
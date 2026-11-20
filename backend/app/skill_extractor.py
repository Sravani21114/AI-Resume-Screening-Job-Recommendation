import spacy

nlp = spacy.load("en_core_web_sm")

SKILLS = [

    "python",
    "java",
    "c++",
    "sql",
    "tensorflow",
    "pytorch",
    "machine learning",
    "deep learning",
    "nlp",
    "fastapi",
    "flask",
    "docker",
    "aws",
    "git",
    "react",
    "mongodb",
    "postgresql",
    "opencv",
    "keras",
    "pandas",
    "numpy",
    "scikit-learn"
]


def extract_skills(text):

    text = text.lower()

    found = []

    for skill in SKILLS:

        if skill in text:
            found.append(skill)

    return found
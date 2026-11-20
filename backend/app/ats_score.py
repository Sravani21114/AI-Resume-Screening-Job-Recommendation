REQUIRED_SKILLS = [

    "python",
    "sql",
    "machine learning",
    "fastapi",
    "docker",
    "git",
    "react"
]


def calculate_score(skills):

    matched = 0

    for skill in REQUIRED_SKILLS:

        if skill in skills:
            matched += 1

    score = matched / len(REQUIRED_SKILLS)

    return round(score * 100, 2)
import pdfplumber
import docx
import os


def extract_pdf(path):

    text = ""

    with pdfplumber.open(path) as pdf:

        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text

    return text


def extract_docx(path):

    doc = docx.Document(path)

    return "\n".join([para.text for para in doc.paragraphs])


def extract_text(path):

    extension = os.path.splitext(path)[1]

    if extension == ".pdf":
        return extract_pdf(path)

    if extension == ".docx":
        return extract_docx(path)

    return ""
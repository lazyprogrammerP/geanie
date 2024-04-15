import pdfplumber


def read_pdf(file_path: str) -> str:
    with pdfplumber.open(file_path) as pdf:
        pdf_texts = []

        for page in pdf.pages:
            pdf_texts.append(page.extract_text())

    return "\n".join(pdf_texts)

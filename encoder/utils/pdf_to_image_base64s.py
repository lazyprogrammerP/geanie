import base64
import io

import pdfplumber


def pdf_to_image_base64s(file_path: str) -> list[str]:
    image_base64s = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            image = page.to_image()

            image_bytes = io.BytesIO()
            image.save(image_bytes, format="PNG")

            image_base64 = base64.b64encode(image_bytes.getvalue()).decode("utf-8")
            image_base64s.append(image_base64)

    return image_base64s

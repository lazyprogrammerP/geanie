from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
import os

# Utils
from utils.image_to_base64 import image_to_base64
from utils.ocr import batch_ocr
from utils.pdf_to_image_base64s import pdf_to_image_base64s
from utils.read_pdf import read_pdf

load_dotenv()
PORT = int(os.getenv("PORT", 8000))

app = FastAPI()


@app.post("/pdf-to-text")
async def pdf_to_text(file: UploadFile = File(...)):
    contents = read_pdf(file.file)

    if not contents:
        image_base64s = pdf_to_image_base64s(file.file)

        image_contents = await batch_ocr(image_base64s)
        contents = "\n".join(image_contents)

    return {"data": contents}


@app.post("/image-to-text")
async def image_to_text(file: UploadFile = File(...)):
    image_base64 = image_to_base64(file.file.read())

    image_contents = await batch_ocr([image_base64])
    contents = "\n".join(image_contents)

    return {"data": contents}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
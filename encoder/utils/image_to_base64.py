import base64
import io

from PIL import Image


def image_to_base64(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    image_bytes = io.BytesIO()

    image.save(image_bytes, format="PNG")
    image_base64 = base64.b64encode(image_bytes.getvalue()).decode("utf-8")

    return image_base64

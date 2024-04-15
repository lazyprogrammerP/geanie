import asyncio

from lib.openai_client import async_openai_client


async def ocr(image_base64: str, semaphore: asyncio.Semaphore) -> str:
    async with semaphore:
        ocr_result = await async_openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """Perform OCR on the provided image and extract all visible textual data exactly as it appears in the image. No need to describe the image, just extract the text.""",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_base64}",
                                "detail": "high",
                            },
                        }
                    ],
                },
            ],
            max_tokens=2048,
        )

        return ocr_result.choices[0].message.content


async def batch_ocr(image_base64s: list[str]) -> list[str]:
    semaphore = asyncio.Semaphore(5)

    return await asyncio.gather(
        *[ocr(image_base64, semaphore) for image_base64 in image_base64s]
    )

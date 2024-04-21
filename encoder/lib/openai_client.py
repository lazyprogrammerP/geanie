from dotenv import load_dotenv
from openai import AsyncOpenAI, OpenAI

load_dotenv()

openai_client = OpenAI()
async_openai_client = AsyncOpenAI()

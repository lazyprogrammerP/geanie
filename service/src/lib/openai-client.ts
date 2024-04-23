import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openAIClient = new OpenAI();

export default openAIClient;

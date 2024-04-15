import axios from "axios";

const ENCODER_SERVICE_URL = process.env.ENCODER_SERVICE_URL || `http://127.0.0.1:8000`;

const encoderService = axios.create({
  baseURL: ENCODER_SERVICE_URL,
});

// TODO: add authentication headers
export default encoderService;

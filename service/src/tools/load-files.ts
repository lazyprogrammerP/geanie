import FormData from "form-data";
import fs from "fs";
import mammoth from "mammoth";
import encoderService from "../lib/encoder-service";

export default class FileLoader {
  constructor() {}

  loadPDF = async (filePath: string, file: Express.Multer.File): Promise<string> => {
    const fileBuffer = fs.readFileSync(filePath);

    const fd = new FormData();
    fd.append("file", fileBuffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const loadPDFResponse = await encoderService.request({
      method: "POST",
      url: "/pdf-to-text",
      data: fd,
      headers: {
        ...fd.getHeaders(),
      },
    });

    return loadPDFResponse.data.data;
  };

  loadDOCX = async (filePath: string): Promise<string> => {
    const contents = await mammoth.extractRawText({ path: filePath });
    return contents.value;
  };

  loadTXT = (filePath: string): string => {
    const contents = fs.readFileSync(filePath, "utf-8");
    return contents;
  };

  loadImage = async (filePath: string, file: Express.Multer.File): Promise<string> => {
    const fileBuffer = fs.readFileSync(filePath);

    const fd = new FormData();
    fd.append("file", fileBuffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const loadImageResponse = await encoderService.request({
      method: "POST",
      url: "/image-to-text",
      data: fd,
      headers: {
        ...fd.getHeaders(),
      },
    });

    return loadImageResponse.data.data;
  };
}

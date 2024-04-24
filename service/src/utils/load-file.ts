import path from "path";
import { TEMP_DIR } from "../constants";
import FileLoader from "../tools/file-loader";

export default async function loadFile(file: Express.Multer.File): Promise<string> {
  const filePath = path.join(TEMP_DIR, file.filename);
  const extension = path.extname(file.originalname);

  const fileLoader = new FileLoader();

  let contents = "";
  switch (extension.toLowerCase()) {
    case ".pdf":
      contents = await fileLoader.loadPDF(filePath, file);
      break;
    case ".docx":
      contents = await fileLoader.loadDOCX(filePath);
      break;
    case ".txt":
      contents = fileLoader.loadTXT(filePath);
      break;
    case ".jpeg":
    case ".jpg":
    case ".png":
      contents = await fileLoader.loadImage(filePath, file);
      break;
    default:
      throw new Error("Invalid file extension");
  }

  return contents;
}

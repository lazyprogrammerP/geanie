import os from "os";

export type ResponseStatus = "success" | "error";

export const TEMP_DIR = os.tmpdir();

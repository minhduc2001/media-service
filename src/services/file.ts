import * as fs from "fs";
import * as path from "path";
export const removeFile = (filename: string) => {
  const link = path.join(process.cwd(), "uploads", filename);
  fs.unlink(link, (error) => {
    if (error) {
      console.error(error.message);
    }
  });
};

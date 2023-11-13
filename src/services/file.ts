import * as fs from "fs";

export const removeFile = (link: string) => {
  fs.unlink(link, (error) => {
    if (error) {
      console.error(error.message);
    }
  });
};

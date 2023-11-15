import chokidar from "chokidar";
import * as path from "path";
import { readdirSync, statSync } from "fs";

function isAllowedFile(filePath: string): boolean {
  return filePath.match(/\.(ts|m3u8)$/i) !== null;
}

function countFilesInDirectory(folderPath: string) {
  const files = readdirSync(folderPath);

  let fileCount = 0;

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileStats = statSync(filePath);

    if (fileStats.isFile()) {
      if (isAllowedFile(filePath)) fileCount += 1;
    } else if (fileStats.isDirectory()) {
      fileCount += countFilesInDirectory(filePath);
    }
  });

  return fileCount;
}

function startWatching(uploadDirectory: string) {
  const files = countFilesInDirectory(uploadDirectory);

  const watcher = chokidar.watch(uploadDirectory, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  });

  let fileWatcher = 0;
  watcher.on("add", (filePath) => {
    if (isAllowedFile(filePath)) {
      fileWatcher++;
      console.log(filePath);

      if (fileWatcher == files) {
        console.log("done", fileWatcher);
        watcher.close();
      }
    }
  });
}

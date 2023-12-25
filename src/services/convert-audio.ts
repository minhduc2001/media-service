import * as path from "path";

const MAXIMUM_BITRATE_128K = 128 * 10 ** 3; // 128 Kbps
const MAXIMUM_BITRATE_256K = 256 * 10 ** 3; // 256 Kbps
const MAXIMUM_BITRATE_320K = 320 * 10 ** 3; // 320 Kbps

type EncodeAudioByBitrate = {
  inputPath: string;
  outputSegmentPath: string;
  outputPath: string;
  bitrate: {
    low: number;
    medium: number;
    high: number;
    original: number;
  };
};

const getBitrate = async (filePath: string) => {
  const { $ } = await import("zx");
  const slash = (await import("slash")).default;

  const { stdout } = await $`ffprobe ${[
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=bit_rate",
    "-of",
    "default=nw=1:nk=1",
    slash(filePath),
  ]}`;

  return Number(stdout.trim());
};

const encodeAudioLow = async ({
  bitrate,
  inputPath,
  outputPath,
  outputSegmentPath,
}: EncodeAudioByBitrate) => {
  const { $ } = await import("zx");
  const slash = (await import("slash")).default;

  const args = [
    "-y",
    "-i",
    slash(inputPath),
    "-c:a:0",
    "aac",
    "-b:a:0",
    `${bitrate.low}`,
    "-var_stream_map",
    "a:0",
    "-master_pl_name",
    "master.m3u8",
    "-f",
    "hls",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    slash(outputSegmentPath),
    slash(outputPath),
  ];

  await $`ffmpeg ${args}`;
  return true;
};

const encodeAudioMedium = async ({
  bitrate,
  inputPath,
  outputPath,
  outputSegmentPath,
}: EncodeAudioByBitrate) => {
  const { $ } = await import("zx");
  const slash = (await import("slash")).default;

  const args = [
    "-y",
    "-i",
    slash(inputPath),
    "-c:a:1",
    "aac",
    "-b:a:1",
    `${bitrate.medium}`,
    "-var_stream_map",
    "a:1",
    "-master_pl_name",
    "master.m3u8",
    "-f",
    "hls",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    slash(outputSegmentPath),
    slash(outputPath),
  ];

  await $`ffmpeg ${args}`;
  return true;
};

const encodeAudioHigh = async ({
  bitrate,
  inputPath,
  outputPath,
  outputSegmentPath,
}: EncodeAudioByBitrate) => {
  const { $ } = await import("zx");
  const slash = (await import("slash")).default;

  const args = [
    "-y",
    "-i",
    slash(inputPath),
    "-c:a:2",
    "aac",
    "-b:a:2",
    `${bitrate.high}`,
    "-var_stream_map",
    "a:2",
    "-master_pl_name",
    "master.m3u8",
    "-f",
    "hls",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    slash(outputSegmentPath),
    slash(outputPath),
  ];

  await $`ffmpeg ${args}`;
  return true;
};

const encodeAudioOriginal = async ({
  bitrate,
  inputPath,
  outputPath,
  outputSegmentPath,
}: EncodeAudioByBitrate) => {
  const { $ } = await import("zx");
  const slash = (await import("slash")).default;

  const args = [
    "-y",
    "-i",
    slash(inputPath),
    "-c:a:3",
    "aac",
    "-b:a:3",
    `${bitrate.original}`,
    "-var_stream_map",
    "a:3",
    "-master_pl_name",
    "master.m3u8",
    "-f",
    "hls",
    "-hls_time",
    "10",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    slash(outputSegmentPath),
    slash(outputPath),
  ];

  await $`ffmpeg ${args}`;
  return true;
};

export const encodeAudioHLSWithMultipleStreams = async (filename: string) => {
  const inputPath = path.join(process.cwd(), "uploads", filename);
  const [bitrate] = await Promise.all([getBitrate(inputPath)]);

  const prefix_folder = inputPath.split("/").at(-1)?.split(".").at(0) || "";
  const parent_folder = path.join(inputPath, "..");
  const outputSegmentPath = path.join(
    parent_folder,
    prefix_folder,
    "a%v/fileSequence%d.ts"
  );
  const outputPath = path.join(
    parent_folder,
    prefix_folder,
    "a%v/prog_index.m3u8"
  );

  const bitrate128 =
    bitrate > MAXIMUM_BITRATE_128K ? MAXIMUM_BITRATE_128K : bitrate;
  const bitrate256 =
    bitrate > MAXIMUM_BITRATE_256K ? MAXIMUM_BITRATE_256K : bitrate;
  const bitrate320 =
    bitrate > MAXIMUM_BITRATE_320K ? MAXIMUM_BITRATE_320K : bitrate;

  await encodeAudioLow({
    bitrate: {
      low: bitrate128,
      medium: bitrate256,
      high: bitrate320,
      original: bitrate,
    },
    inputPath,
    outputPath,
    outputSegmentPath,
  });

  if (bitrate > bitrate128) {
    await encodeAudioMedium({
      bitrate: {
        low: bitrate128,
        medium: bitrate256,
        high: bitrate320,
        original: bitrate,
      },
      inputPath,
      outputPath,
      outputSegmentPath,
    });
  }

  if (bitrate > bitrate256) {
    await encodeAudioHigh({
      bitrate: {
        low: bitrate128,
        medium: bitrate256,
        high: bitrate320,
        original: bitrate,
      },
      inputPath,
      outputPath,
      outputSegmentPath,
    });
  } else {
    await encodeAudioOriginal({
      bitrate: {
        low: bitrate128,
        medium: bitrate256,
        high: bitrate320,
        original: bitrate,
      },
      inputPath,
      outputPath,
      outputSegmentPath,
    });
  }

  return true;
};

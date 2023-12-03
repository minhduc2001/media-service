import * as path from "path";

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
    "-f",
    "hls",
    "-hls_time",
    "6",
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
    "-c:a:0",
    "aac",
    "-b:a:0",
    `${bitrate.medium}`,
    "-var_stream_map",
    "a:0",
    "-f",
    "hls",
    "-hls_time",
    "6",
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
    "-c:a:0",
    "aac",
    "-b:a:0",
    `${bitrate.high}`,
    "-var_stream_map",
    "a:0",
    "-f",
    "hls",
    "-hls_time",
    "6",
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
    "-c:a:0",
    "aac",
    "-b:a:0",
    `${bitrate.original}`,
    "-var_stream_map",
    "a:0",
    "-f",
    "hls",
    "-hls_time",
    "6",
    "-hls_list_size",
    "0",
    "-hls_segment_filename",
    slash(outputSegmentPath),
    slash(outputPath),
  ];

  await $`ffmpeg ${args}`;
  return true;
};

export const encodeAudioHLSWithMultipleStreams = async (inputPath: string) => {
  const [bitrate] = await Promise.all([getBitrate(inputPath)]);
  const parent_folder = path.join(inputPath, "..");
  const outputSegmentPath = path.join(parent_folder, "a%v/fileSequence%d.ts");
  const outputPath = path.join(parent_folder, "a%v/prog_index.m3u8");
  const bitrateLow = Math.min(bitrate, 128 * 1000); // 128 kbps
  const bitrateMedium = Math.min(bitrate, 192 * 1000); // 192 kbps
  const bitrateHigh = Math.min(bitrate, 256 * 1000); // 256 kbps

  await encodeAudioMedium({
    bitrate: {
      low: bitrateLow,
      medium: bitrateMedium,
      high: bitrateHigh,
      original: bitrate,
    },
    inputPath,
    outputPath,
    outputSegmentPath,
  });

  return true;
};

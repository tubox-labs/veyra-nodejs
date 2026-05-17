import Veyra from "@tubox/veyra-sdk";
import { readFile } from "node:fs/promises";

const client = new Veyra();

const audioBuffer = await readFile("speech.mp3");
const result = await client.audio.transcriptions.create({
  model: "whisper-1",
  file: { name: "speech.mp3", data: audioBuffer, type: "audio/mpeg" },
  language: "en",
  responseFormat: "json",
});

console.log(result.text);

import { config, higgsfield } from "@higgsfield/client/v2";

// Cheapest models: Soul 2 @ $0.003/img, Wan 3.0 @ $0.020/s
config({
  credentials: process.env.HF_CREDENTIALS,
});

async function generateImage() {
  console.log("Generating image via Soul 2 ($0.003/img)...");
  const result = await higgsfield.subscribe(
    "higgsfield-ai/soul/v2/standard",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        resolution: "720p",
        aspect_ratio: "16:9",
        enhance_prompt: true,
        batch_size: 1,
      },
      withPolling: true,
    },
  );

  if (result.status === "completed") {
    const url = result.images?.[0]?.url ?? (result as any).image?.url;
    url ? console.log("Image URL:", url) : console.log("Completed:", JSON.stringify(result, null, 2));
  } else {
    console.error("Image generation failed:", result.status, (result as any).error ?? "");
    process.exit(1);
  }
}

async function generateVideo() {
  console.log("Generating video via Wan 3.0 ($0.020/s)...");
  const result = await higgsfield.subscribe(
    "alibaba/wan-3.0/text-to-video",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
        generate_audio: true,
      },
      withPolling: true,
    },
  );

  if (result.status === "completed") {
    const url = result.video?.url ?? (result as any).videos?.[0]?.url;
    url ? console.log("Video URL:", url) : console.log("Completed:", JSON.stringify(result, null, 2));
  } else {
    console.error("Video generation failed:", result.status, (result as any).error ?? "");
    process.exit(1);
  }
}

const mode = process.argv[2] ?? "video";
if (mode === "image") generateImage().catch(console.error);
else generateVideo().catch(console.error);

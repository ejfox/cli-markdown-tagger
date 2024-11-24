#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const matter = require("gray-matter");
const OpenAI = require("openai");
require("dotenv").config();

const argv = yargs
  .option("file", {
    alias: "f",
    description: "Path to the markdown file",
    type: "string",
    demandOption: true,
  })
  .option("model", {
    alias: "m",
    description: "OpenAI model to use",
    type: "string",
    default: "gpt-3.5-turbo",
  })
  .help()
  .alias("help", "h").argv;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Choose the appropriate API key and base URL
const apiKey = OPENAI_API_KEY || OPENROUTER_API_KEY;
const baseURL = OPENAI_API_KEY ? undefined : OPENROUTER_BASE_URL;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
  defaultHeaders: OPENAI_API_KEY
    ? {}
    : {
        "HTTP-Referer": "https://github.com/OpenRouterTeam/openrouter-examples",
      },
});

async function generateSummary(content, model) {
  const prompt = `
Given the following weekly note content:

${content}

Generate a one-sentence summary in the style of Victorian-era chapter summaries, starting with 'In which the author', and capturing the essence of the week's activities. Do not use the word "delves" or the phrase "embarks on creative endeavors". Return only the summary, without quotation marks.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    const summary = completion.choices[0].message.content.trim();
    return summary.replace(/^"|"$/g, ""); // Remove any leading/trailing quotes
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return null;
  }
}

async function processFile(filePath, model) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const summary = await generateSummary(content, model);

  if (summary) {
    data.dek = summary;
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedContent);

    console.log(`Added summary to ${filePath}: ${summary}`);
  } else {
    console.log("Failed to generate summary.");
  }
}

async function main() {
  const filePath = path.resolve(argv.file);
  const model = argv.model;

  await processFile(filePath, model);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

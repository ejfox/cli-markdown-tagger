#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const matter = require('gray-matter');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const argv = yargs
  .option('file', {
    alias: 'f',
    description: 'Path to the markdown file',
    type: 'string',
    demandOption: true
  })
  .option('tags-url', {
    alias: 'u',
    description: 'URL of the JSON file containing tags',
    type: 'string',
    default: 'https://ejfox.com/tags.json'
  })
  .option('model', {
    alias: 'm',
    description: 'OpenRouter model to use',
    type: 'string',
    default: 'openai/gpt-3.5-turbo'
  })
  .help()
  .alias('help', 'h')
  .argv;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/OpenRouterTeam/openrouter-examples",
  },
});

async function fetchTags(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    process.exit(1);
  }
}

async function updateTags(content, existingTags, tagList, model) {
  const prompt = `
Given the following content:

${content}

And the following list of potential tags:
${tagList.join(', ')}

Suggest 1-8 applicable tags from the list. Return only the tags, separated by commas.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    const suggestedTags = completion.choices[0].message.content.split(',').map(tag => tag.trim());
    const validSuggestedTags = suggestedTags.filter(tag => tagList.includes(tag));

    return [...new Set([...existingTags, ...validSuggestedTags])];
  } catch (error) {
    console.error('Error suggesting tags:', error.message);
    return existingTags;
  }
}

async function processFile(filePath, tagList, model) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const existingTags = data.tags || [];
  const newTags = await updateTags(content, existingTags, tagList, model);

  data.tags = newTags;

  const updatedContent = matter.stringify(content, data);
  fs.writeFileSync(filePath, updatedContent);

  console.log(`Updated tags for ${filePath}: ${newTags.join(', ')}`);
}

async function main() {
  const filePath = path.resolve(argv.file);
  const tagList = await fetchTags(argv.tagsUrl);
  const model = argv.model;

  await processFile(filePath, tagList, model);
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
# Markdown Tag Updater CLI Tool

This CLI tool automatically updates tags in the frontmatter of markdown files using AI-powered suggestions. It fetches a list of allowed tags from a specified URL and uses the OpenRouter API to suggest relevant tags based on the content of the markdown file.

<img width="842" alt="Screenshot 2024-09-19 at 5 17 38 PM" src="https://github.com/user-attachments/assets/e9651286-e7bd-4edc-9245-900bb176283d">


## Features

- Fetches allowed tags from a specified URL
- Uses AI (via OpenRouter API) to suggest relevant tags based on file content
- Updates markdown frontmatter with suggested tags
- Supports custom OpenRouter models
- Preserves existing tags

## Prerequisites

- Node.js (v12 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone this repository or download the script:

   ```
   git clone https://github.com/yourusername/markdown-tag-updater.git
   cd markdown-tag-updater
   ```

2. Install the required dependencies:

   ```
   npm install yargs gray-matter axios openai dotenv
   ```

3. Create a `.env` file in the project root and add your OpenRouter API key:

   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

## Usage

Basic usage:

```
node markdown-tag-updater.js -f path/to/your/markdown/file.md
```

Specify a custom tags URL:

```
node markdown-tag-updater.js -f path/to/your/markdown/file.md -u https://example.com/custom-tags.json
```

Use a different OpenRouter model:

```
node markdown-tag-updater.js -f path/to/your/markdown/file.md -m anthropic/claude-2
```

### Options

- `-f, --file`: Path to the markdown file (required)
- `-u, --tags-url`: URL of the JSON file containing tags (default: https://ejfox.com/tags.json)
- `-m, --model`: OpenRouter model to use (default: openai/gpt-3.5-turbo)
- `-h, --help`: Show help information

## How it Works

1. The tool reads the specified markdown file.
2. It fetches the list of allowed tags from the specified URL.
3. The content of the markdown file is sent to the OpenRouter API along with the list of allowed tags.
4. The API suggests relevant tags based on the content.
5. The tool updates the frontmatter of the markdown file with the suggested tags, preserving any existing tags.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

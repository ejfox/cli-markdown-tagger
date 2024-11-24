#!/bin/bash

# Path to the Obsidian vault directory
VAULT_PATH="/Users/ejfox/Library/Mobile Documents/iCloud~md~obsidian/Documents/ejfox/video-scripts"

# Run cli-markdown-tagger for every markdown file in the vault
find "$VAULT_PATH" -name "*.md" | while read -r file; do
  echo "Processing $file"
  node index.js -f "$file"
done


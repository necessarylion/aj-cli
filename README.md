# aj-cli

A personal CLI toolbox built with Bun and Commander. Requires [Claude Code](https://claude.ai/claude-code) for AI-powered commands.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/necessarylion/aj-cli/main/install.sh | bash
```

## Commands

### `aj translate <text>`

Translate text to English using Claude.

```bash
aj translate "こんにちは世界"
```

### `aj commit-msg`

Generate a commit message from staged changes using Claude. Prompts for confirmation before committing.

```bash
git add .
aj commit-msg
```

### `aj killport <port>`

Kill the process running on a given port. Works on macOS and Linux.

```bash
aj killport 3000
```

## Development

```bash
bun install
bun run src/index.ts translate "hello"
```

## Build

```bash
bun run build
```

This produces a standalone binary at `bin/aj` that can run without Bun or Node.js installed.

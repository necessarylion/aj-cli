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

### `aj rewrite <text> [tone]`

Rewrite text in a given tone using Claude. Supports `fri` (friendly) or `pro` (professional, default).

```bash
aj rewrite "fix the bug asap" fri
aj rewrite "fix the bug asap" pro
```

### `aj commit-msg`

Generate a commit message from staged changes using Claude. Prompts with three options: commit, cancel, or enter a custom message.

```bash
git add .
aj commit-msg
```

### `aj docme <file>`

Add documentation comments (JSDoc, docstrings, etc.) to a file using Claude.

```bash
aj docme src/utils.ts
```

### `aj killport <port>`

Kill the process running on a given port. Works on macOS and Linux.

```bash
aj killport 3000
```

### `aj portwho <port>`

Show detailed info about the process running on a given port.

```bash
aj portwho 3000
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

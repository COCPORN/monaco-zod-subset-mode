# monaco-zod-subset-mode

A custom language definition and mode for the Monaco Editor that enables syntax highlighting, validation, and autocompletion for a subset of Zod schemas.

## Features

- Syntax highlighting for Zod types and methods
- Validation against disallowed constructs (e.g., `.refine()`, variables)
- Autocompletion for common Zod methods

## Getting Started

1. Install dependencies: `pnpm install`
2. Build the project: `pnpm build && pnpm bundle`
3. To test the editor, run a local web server from the project root (e.g., `python -m http.server`) and open `example/index.html` in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

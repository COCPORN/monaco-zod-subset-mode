# monaco-zod-subset-mode — Product Requirements Document

## 🧠 Overview

`monaco-zod-subset-mode` is a custom language definition and mode for the Monaco Editor that enables **syntax highlighting, validation, and autocompletion** for the Zod subset supported by `zod-subset-parser`.

It allows developers, end users, or AI agents to safely write Zod-style schema strings in a controlled environment, with:
- Real-time feedback
- Linting for unsupported constructs
- Optional autocomplete for Zod methods

This project will serve as the **editor-level companion** to `zod-subset-parser`, enabling code playgrounds, form schema editors, or LLM interfaces that generate/edit validation logic visually or textually.

---

## 🎯 Goals

- Enable **syntax highlighting and validation** of a restricted Zod subset
- Prevent or warn about unsupported patterns (e.g., `.refine()`, variables, side effects)
- Provide **autocomplete and method hints** for allowed Zod functions
- Integrate cleanly into existing Monaco setups (via `monaco.languages.register`)
- Be fully compatible with `zod-subset-parser` to ensure runtime parity

---

## 🧩 Supported Syntax Features

Match the feature set of `zod-subset-parser`, including:

### Types:
- `z.string()`
- `z.number()`
- `z.boolean()`
- `z.literal(...)`
- `z.enum([...])`
- `z.array(...)`
- `z.object({ ... })`
- `z.union([ ... ])`
- `z.tuple([ ... ])`

### Method Chains:
- `.min()`, `.max()`, `.int()`, `.optional()`, `.nullable()`, etc.
- Support for nested chaining (e.g., `z.string().min(1).max(100)`)

---

## 🛑 Disallowed Constructs (should lint or flag)

- `.refine(...)`
- `.transform(...)`
- `z.lazy(...)`
- Any use of external variables or identifiers
- Function expressions or callbacks
- `const`/`let`/`import`/`require` — i.e., anything not part of a pure schema expression

---

## ✅ Core Features

### 1. Syntax Highlighting
- Define a custom Monaco language (e.g. `zod-subset`)
- Tokenize common Zod types and methods
- Highlight string/number literals and object shape keys

### 2. Live Validation
- Hook into Monaco's diagnostic API to:
  - Warn on disallowed constructs
  - Flag unknown or misspelled method calls
  - Optionally reference `zod-subset-parser` for real parse results

### 3. Autocompletion (stretch goal)
- Provide completion items for valid Zod methods:
  - `string()`, `number()`, `object({...})`, `min(n)`, `max(n)`, etc.
- Optionally infer chaining context (e.g. suggest `.min()` after `z.string()`)

---

## 🧱 Technical Requirements

- Built with TypeScript
- Designed to be embedded into any Monaco instance (e.g., VS Code web, React Monaco wrapper)
- No runtime eval or unsafe parsing
- Diagnostics must be generated from:
  - AST analysis (e.g., using Acorn, Esprima, or similar)
  - Or, optionally, from a call to `zod-subset-parser` itself in background

---

## 📚 Example Integration

```ts
import * as monaco from 'monaco-editor';
import { registerZodSubsetLanguage } from 'monaco-zod-subset-mode';

registerZodSubsetLanguage(monaco);

monaco.editor.create(document.getElementById('editor'), {
  language: 'zod-subset',
  value: `z.object({ name: z.string().min(1) })`,
});
```

---

## 📦 Deliverables

- NPM package: `monaco-zod-subset-mode`
- TypeScript types
- Monaco language definition (monaco.languages.register)
- Tokenizer and simple grammar
- Syntax validator and linting provider
- README with integration steps

---

## 🔭 Future Extensions

- Integration with zod-subset-parser for live validation
- JSON AST output from editor
- Real-time preview of parsed schema (type/form)
- UI wrapper (React/Svelte/Vue)
- Support for schema editing workflows (AI copilots, low-code tools)
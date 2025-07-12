import * as monaco from 'monaco-editor';
import * as acorn from 'acorn';

/**
 * Registers the Zod subset language with Monaco.
 * @param monacoInstance The Monaco editor instance.
 */
export function registerZodSubsetLanguage(monacoInstance: typeof monaco) {
  const languageId = 'zod-subset';

  monacoInstance.languages.register({ id: languageId });

  // Register a tokens provider for the language
  monacoInstance.languages.setMonarchTokensProvider(languageId, {
    keywords: [
      'z', 'string', 'number', 'boolean', 'literal', 'enum', 'array', 'object', 'union', 'tuple'
    ],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/\.[a-zA-Z_]\w*/, 'keyword.control'],
        [/".*?"/, 'string'],
        [/\d+/, 'number'],
        [/\/\//, 'comment'],
      ]
    }
  });

  // Register a completion item provider for the language
  monacoInstance.languages.registerCompletionItemProvider(languageId, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      const suggestions = [
        ...[
          'string', 'number', 'boolean', 'literal', 'enum', 'array', 'object', 'union', 'tuple'
        ].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range
        })),
        ...[
          'min', 'max', 'int', 'optional', 'nullable', 'email'
        ].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: `${keyword}()`,
          range: range
        }))
      ];
      return { suggestions: suggestions };
    }
  });

  // Listen for model content changes and validate the code
  monacoInstance.editor.onDidCreateModel(model => {
    if (model.getLanguageId() === languageId) {
      const validateModel = () => {
        const markers = validate(model.getValue());
        monacoInstance.editor.setModelMarkers(model, languageId, markers);
      };
      let validationHandle: number;
      model.onDidChangeContent(() => {
        window.clearTimeout(validationHandle);
        validationHandle = window.setTimeout(validateModel, 500);
      });
      validateModel();
    }
  });
}

/**
 * Validates the given code and returns an array of markers.
 * @param code The code to validate.
 * @returns An array of markers.
 */
export function validate(code: string): monaco.editor.IMarkerData[] {
  const markers: monaco.editor.IMarkerData[] = [];
  try {
    const ast = acorn.parse(code, { ecmaVersion: 'latest', locations: true });
    walk(ast, {
      VariableDeclaration(node: acorn.Node) {
        const varNode = node as any;
        markers.push({
          message: 'Variables are not allowed.',
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: varNode.loc.start.line,
          startColumn: varNode.loc.start.column + 1,
          endLineNumber: varNode.loc.end.line,
          endColumn: varNode.loc.end.column + 1,
        });
      },
      ImportDeclaration(node: acorn.Node) {
        const importNode = node as any;
        markers.push({
          message: 'Imports are not allowed.',
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: importNode.loc.start.line,
          startColumn: importNode.loc.start.column + 1,
          endLineNumber: importNode.loc.end.line,
          endColumn: importNode.loc.end.column + 1,
        });
      },
      CallExpression(node: acorn.Node) {
        const callNode = node as any;
        if (callNode.callee.name === 'require') {
          markers.push({
            message: 'Require is not allowed.',
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: callNode.loc.start.line,
            startColumn: callNode.loc.start.column + 1,
            endLineNumber: callNode.loc.end.line,
            endColumn: callNode.loc.end.column + 1,
          });
        }
        if (callNode.callee.property && ['refine', 'transform', 'lazy'].includes(callNode.callee.property.name)) {
          markers.push({
            message: `Method ".${callNode.callee.property.name}" is not allowed.`,
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: callNode.loc.start.line,
            startColumn: callNode.loc.start.column + 1,
            endLineNumber: callNode.loc.end.line,
            endColumn: callNode.loc.end.column + 1,
          });
        }
      }
    });
  } catch (e: any) {
    markers.push({
      message: e.message,
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: e.loc.line,
      startColumn: e.loc.column + 1,
      endLineNumber: e.loc.line,
      endColumn: e.loc.column + 2,
    });
  }
  return markers;
}

/**
 * Walks the AST and calls the visitors for each node.
 * @param node The AST node to walk.
 * @param visitors The visitors to call.
 */
function walk(node: acorn.Node, visitors: { [type: string]: (node: acorn.Node) => void }) {
  if (visitors[node.type]) {
    visitors[node.type](node);
  }

  for (const key in node) {
    if (key === 'type' || key === 'loc') continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const subChild of child) {
        if (subChild && typeof subChild.type === 'string') {
          walk(subChild, visitors);
        }
      }
    } else if (child && typeof child.type === 'string') {
      walk(child, visitors);
    }
  }
}

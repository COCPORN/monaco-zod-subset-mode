# Publishing to NPM

This document outlines the steps to publish the `monaco-zod-subset-mode` package to the NPM registry.

## 1. Prepare for Publishing

Before you can publish, you need to configure the project to build the necessary module formats that NPM packages typically provide.

### Update `rollup.config.js`

Modify your `rollup.config.js` to output both CommonJS (CJS) and ES Module (ESM) formats. This ensures your package can be used by a wide range of projects and bundlers.

### Update `package.json`

Your `package.json` needs to be updated to tell NPM where to find these new build files. You'll also want to add a `files` array to specify exactly which files are included in the published package.

## 2. Publishing Process

Once your project is configured, the publishing process is straightforward.

1.  **Login to NPM:**
    ```bash
    npm login
    ```
    Enter your NPM username and password when prompted.

2.  **Update the Version:**
    Before publishing, it's a good practice to update the version number in `package.json`. You can do this manually or use the `npm version` command:
    ```bash
    # For a patch release (e.g., 1.0.0 -> 1.0.1)
    npm version patch

    # For a minor release (e.g., 1.0.1 -> 1.1.0)
    npm version minor

    # For a major release (e.g., 1.1.0 -> 2.0.0)
    npm version major
    ```

3.  **Publish the Package:**
    ```bash
    npm publish
    ```

    If your package name is scoped (e.g., `@username/monaco-zod-subset-mode`), you will need to publish with the `--access public` flag the first time:
    ```bash
    npm publish --access public
    ```

That's it! Your package is now available on the NPM registry.

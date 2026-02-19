# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Linkify is an [Obsidian](https://obsidian.md) plugin that converts text matching configurable regular expressions into clickable links, without modifying the underlying `.md` files.

## Commands

```bash
npm run dev      # watch mode (esbuild with inline sourcemaps)
npm run build    # type-check + production bundle (no sourcemaps)
npm run version  # bump version in manifest.json and versions.json
```

Linting: `npx eslint main.ts`
Formatting: `npx prettier --write main.ts`

## Architecture

The entire plugin lives in a single file: `main.ts`. There are no subdirectories of source code.

**Key types:**
- `LinkifyRule` — a `{ regexp, link, cssclass }` triple stored in settings
- `LinkifySettings` — wraps `rules: LinkifyRule[]`, persisted via Obsidian's `loadData`/`saveData`
- `LinkifyViewPlugin` — a CodeMirror 6 `ViewPlugin` created per-rule for Live Preview mode

**How linking works — two separate code paths:**

1. **Live Preview (CodeMirror 6):** `createViewPlugin()` wraps each rule in a `MatchDecorator` that applies a `cm-link linkified` mark decoration. All resulting `ViewPlugin` instances are stored in `this.viewPlugins[]` and registered via `registerEditorExtension`. A DOM click listener on `document` detects clicks on `cm-link linkified` spans and calls `matchRule()` to resolve the URL, then opens it (supports both `window.open()` for external URLs and `app.workspace.openLinkText()` for `[[wikilink]]` patterns).

2. **Reading mode (HTML post-processor):** `markdownPostProcessor()` walks text nodes in the rendered HTML using a `TreeWalker`, and for each match calls `linkifyHtml()` to replace text nodes with `<a>` elements.

**Settings UI** (`LinkifySettingTab`): Inline settings tab with a row per rule (regexp, link, CSS class, delete button). Changes are saved on `blur`. The tab's `hide()` hook calls `refreshExtensions()` to rebuild and register the CodeMirror view plugins whenever the settings panel is closed.

**Import/export:** Rules can be exported as `linkify-rules.json` or imported from a JSON file (accepts either a `{ rules: [...] }` object or a bare array).

**Build output:** esbuild bundles `main.ts` → `main.js` (CJS, ES2016 target). The `obsidian` and all `@codemirror/*` packages are marked external since Obsidian provides them at runtime.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog for Emanuele Stoppa (maintainer of Biome) built with Astro, featuring:
- Minimalist design with mobile-first approach and bottom navigation bar
- Dark mode support with theme switching (auto/light/dark)
- Blog system with MDX support and Open Graph image generation
- TypeScript and Tailwind CSS v4 for styling

## Development Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Type-check with Astro, then build for production
- `npm run preview` - Preview production build locally
- `npm run fix` - Format and lint code with Biome (uses tabs, double quotes)
- `npm run astro` - Run Astro CLI commands directly

## Code Quality & Tooling

The project uses Biome (not ESLint/Prettier) for all linting and formatting:
- **Formatting**: Tab indentation, double quotes for JavaScript
- **Rules**: Recommended rules enabled
- **Astro files**: Some rules disabled (useConst, useImportType, noUnusedVariables/Imports)
- Run `npm run fix` to auto-fix issues before committing

## Architecture

### Content Collections

Blog posts are in `src/content/blog/` as Markdown/MDX files with frontmatter:
- Required: `title`, `description`, `pubDate`, `slug`
- Optional: `heroImage`, `heroAltImage`, `draft` (boolean)
- Draft posts are filtered from production builds

Projects are in `src/content/projects/` with similar structure.

### Dynamic Open Graph Images

OG images are generated dynamically via `src/pages/og/[...route].png.ts`:
- Uses Satori to convert HTML to PNG
- Routes: `home`, `blog`, `projects`, and `blog/{slug}`
- Fetches Inter font from Vercel playground
- Dark gradient background with custom styling
- Images referenced in Layout.astro meta tags

### Styling Architecture

- **Tailwind v4**: Using `@tailwindcss/vite` plugin (not traditional PostCSS setup)
- **Dark mode**: Implemented via `.dark` class on `<html>` element
  - Theme persistence via localStorage
  - Inline script in Layout.astro prevents FOUC
  - ThemeSwitch component for user control
- **Global styles**: `src/styles/globals.css` with custom utilities and prose styles
- **Typography**: Monospace font stack throughout, custom heading/link/code styling

### Layout & Navigation

- **Layout.astro**: Main layout with sticky header, mobile bottom tab bar, footer
- **Theme initialization**: Inline script runs before body to prevent flash
- **Mobile navigation**: BottomTabBar component for small screens (<640px)
- **Social links**: GitHub, LinkedIn, Bluesky in footer

### Key Configuration

- **Site URL**: `https://ematipico.xyz` (set in astro.config.mjs)
- **Syntax highlighting**: Dracula theme for code blocks
- **TypeScript**: Strict config extending Astro's strict preset
- **JSX**: Configured for React (jsx: "react-jsx", jsxImportSource: "react")

## Social Links

- GitHub: https://github.com/ematipico
- LinkedIn: https://linkedin.com/in/emanuelestoppa
- Bluesky: https://bsky.app/profile/ematipico.xyz
- Twitter: @ematipico

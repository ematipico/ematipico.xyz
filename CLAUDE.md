# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website and blog for Emanuele Stoppa built with Astro, featuring:
- Minimalist design with mobile-first approach
- Blog system using Astro's content collections
- Social media links (GitHub, LinkedIn)
- TypeScript and Tailwind CSS for styling

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Architecture

### Directory Structure
- `src/pages/` - Route pages (index.astro, blog/)
- `src/layouts/` - Shared layouts (Layout.astro)
- `src/content/` - Content collections (blog posts)
- `src/components/` - Reusable components
- `public/` - Static assets

### Content Collections
Blog posts are managed through Astro's content collections:
- Location: `src/content/blog/`
- Schema: title, description, pubDate, optional heroImage
- Format: Markdown with frontmatter

### Styling
- Tailwind CSS for utility-first styling
- Custom prose styles for blog content
- Mobile-first responsive design
- Color scheme: primarily black/white with subtle blue accents

## Key Features

- **Homepage**: Hero section with social links, recent posts, about section
- **Blog**: Full blog system with listing and individual post pages
- **Responsive Design**: Mobile-first approach with clean typography
- **Performance**: Minimal JavaScript, optimized for speed

## Social Links
- GitHub: https://github.com/ematipico
- LinkedIn: https://linkedin.com/in/emanuelestoppa
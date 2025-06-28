# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a prototyping project for developing clean, simple web components using Lit with TypeScript and Storybook. The project prioritizes simplicity and minimal changes to achieve results. PROTOTYPING, PROTOTYPING, PROTOTYPING! We must always do the simplest possible thing to achieve any given goal. 

**Key Principle**: Always do the simplest thing, make minimal changes, keep simplicity and clean code first.

## Architecture

- **Framework**: Lit 3.3.0 for web components
- **Build Tool**: Vite 6.3.5 with library mode configuration
- **Documentation**: Storybook 9.0.11 with web-components-vite framework
- **Language**: TypeScript 5.8.3 with strict configuration
- **Styling**: Plain CSS scoped inside components (no external CSS frameworks)

## Commands

### Development
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Build
- `vite build` - Build the library (configured for ES modules, externalizes Lit)

## Configuration Details

### TypeScript
- Target ES2020 with strict mode enabled
- Experimental decorators enabled for Lit components
- `useDefineForClassFields: false` for proper Lit property behavior
- Includes both `src/` and `stories/` directories

### Vite
- Configured for library mode with `src/index.ts` as entry point
- Outputs ES modules only
- Externalizes Lit dependencies to avoid bundling

### Storybook
- Uses web-components-vite framework
- Stories located in `stories/` directory
- Includes docs addon for component documentation
- Configured to find stories in `*.stories.ts` files

## Development Guidelines

When creating new components:
1. Use Lit's `@customElement` decorator
2. Keep CSS scoped within the component using Lit's `css` template literal
3. Follow the existing story structure in `stories/` directory
4. Maintain the minimal, clean approach established in the project
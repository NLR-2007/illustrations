# Contributing to ExplainDraw

Thank you for your interest in contributing! We welcome contributions to help improve layout calculations, visual router logic, documentation, and image generation providers.

## How to Contribute

1. **Fork the Repository**: Create your own copy of the repository.
2. **Setup Workspace**: Run `npm install` to install dependencies.
3. **Write Tests**: Ensure any bug fixes or features include Vitest coverage in the `tests/` directory.
4. **Run Verification**:
   ```bash
   npm run build
   npm test
   ```
5. **Submit PR**: Open a Pull Request with a clear explanation of changes.

## Development Rules
- Keep the color accent config in `src/theme/colors.ts` central.
- Never write flat/rasterized diagram images. Keep them editable in PPTX.
- Respect Mascot visual guidelines in [MASCOT_BIBLE.md](docs/MASCOT_BIBLE.md).

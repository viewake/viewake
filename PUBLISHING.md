# Publishing Viewake

## Before publishing

1. Confirm that `viewake`, `viewake-react`, and `viewake-vue` are available to
   the npm account that will publish them.
2. Use the same version in all three package manifests.
3. Run the complete verification:

   ```bash
   npm ci
   npm run check
   ```

4. Inspect exactly what npm will receive:

   ```bash
   npm publish --dry-run --workspace=viewake
   npm publish --dry-run --workspace=viewake-react
   npm publish --dry-run --workspace=viewake-vue
   ```

Each package runs its build automatically during `prepack`, so stale `dist`
files cannot be published accidentally.

## Publish order

Publish the core first because both adapters declare it as a peer dependency:

```bash
npm publish --workspace=viewake
npm publish --workspace=viewake-react
npm publish --workspace=viewake-vue
```

For a prerelease, use a prerelease version and a non-latest tag:

```bash
npm publish --workspace=viewake --tag next
```

Never publish the private `viewake-workspace` root package.

## After publishing

Install the published versions in a new empty project and verify:

- `import { init } from "viewake"`
- `import "viewake/styles.css"`
- the CDN global `Viewake.init()`
- the React component
- the Vue directive
- TypeScript declarations and SSR imports

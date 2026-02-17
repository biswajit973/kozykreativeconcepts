# Single Point Frontend (Angular)

## Requirements
- Node.js `22.x` (recommended)
- npm `10+`

## Install
From the `spangular` folder:

```bash
npm ci
```

## Run Locally
```bash
npm start
```

App runs on: `http://localhost:4200/`

## Build
```bash
npm run build -- --configuration production
```

Build output:
- `dist/spangular/browser`

## Netlify Deployment
This project already includes:
- `netlify.toml`
- `public/_redirects`

### Recommended (Git-based deploy)
1. Push this `spangular` project to GitHub/GitLab/Bitbucket.
2. In Netlify, click **Add new site** -> **Import an existing project**.
3. If asked, use:
   - Build command: `npm ci && npm run build -- --configuration production && cp public/_redirects dist/spangular/browser/_redirects`
   - Publish directory: `dist/spangular/browser`
   - Node version: `22`
4. Deploy.

### Manual deploy (drag and drop)
1. Run production build locally.
2. Ensure `_redirects` exists in `dist/spangular/browser`.
3. Drag `dist/spangular/browser` into Netlify deploy.

## Sharing With Other Developers (Drive/Mail)
Send the full `spangular` folder (zip), including:
- `src/`
- `public/`
- `package.json`
- `package-lock.json`
- `angular.json`
- `tsconfig*.json`
- `netlify.toml`

Do not send:
- `node_modules/`
- `dist/`

After receiving, they only need:
```bash
npm ci
npm start
```

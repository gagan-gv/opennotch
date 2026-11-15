# OpenNotch UI 🦦

The modern web landing page and interactive simulator for [OpenNotch](https://github.com/gagan-gv/open-notch), the fluid dynamic notch overlay for Linux desktops.

Built with **Vue 3**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## Development

```bash
# Install dependencies
npm install

# Start local development server with hot-reload
npm run dev

# Run TypeScript check and production build
npm run build

# Preview production build locally
npm run preview
```

---

## Release Checklist (Updating Website for New Versions)

When a new version of OpenNotch is released (e.g. `v0.2.0` -> `v0.3.0`), update the download links and version badges in this repository:

### 1. One-Line Version Replacement
You can update all version occurrences across the codebase with a single command:

```bash
# Syntax: sed -i 's/<OLD_VERSION>/<NEW_VERSION>/g' src/App.vue package.json
sed -i 's/0\.2\.0/0.3.0/g' src/App.vue package.json
```

### 2. Manual Checklist (Locations in `src/App.vue`)
If updating manually, the version string appears in:
1. **Navbar Version Badge**: `<span ...>v0.2.0</span>`
2. **Navbar Download Button**: `href="https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb"`
3. **Hero Announcement Pill**: `href=".../releases/tag/v0.2.0"` and `OpenNotch v0.2.0 is out!`
4. **Hero CTA Download Button**: `href=".../releases/download/v0.2.0/..."` and `Download .deb (v0.2.0)`
5. **Hero Terminal Command**: `sudo apt install ./open-notch_0.2.0_amd64.deb`
6. **Install Section (Debian tab)**:
   ```bash
   wget https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb
   sudo apt install ./open-notch_0.2.0_amd64.deb
   ```
7. **`package.json`**: `"version": "0.2.0"`

### 3. Verify & Commit
```bash
# Verify TypeScript and build
npm run build

# Commit and push
git add src/App.vue package.json
git commit -m "chore(release): update download links for v0.3.0"
git push origin master
```

---

## License

MIT License © 2026 Gagan Chordia

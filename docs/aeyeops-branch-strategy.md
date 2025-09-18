# AeyeOps Branch Strategy

This document describes how we maintain our fork of `coleam00/archon` while also
carrying long-lived AeyeOps customisations.

## Remotes

- `upstream` → `https://github.com/coleam00/archon.git`
- `origin`   → `https://github.com/AeyeOps/archon.git`

`upstream` is read-only. All of our work is pushed to `origin`.

## Branches

### `main`

- Linear history that tracks `upstream/main`.
- Protected: merge via PR only.
- Used for improvements we might upstream.
- Sync regularly with:
  ```bash
  ../scripts/sync-upstream.sh        # from outer repo
  ```

### `aeyeops/custom-main`

- Long-lived branch containing AeyeOps-specific deltas that will not be
  proposed upstream.
- Feature work intended only for our deployment is done on branches that fork
  from `aeyeops/custom-main` (e.g. `custom/ingest-pdf`), then merged back via PR.
- Deployments should target this branch.

To keep `custom-main` current after `main` moves forward:

```bash
git checkout aeyeops/custom-main
git pull origin aeyeops/custom-main
git merge origin/main            # resolve conflicts once here
git push origin aeyeops/custom-main
```

## Typical Workflow

1. **Upstreamable work**
   ```bash
   git checkout main
   git checkout -b feature/<name>
   # ...changes & commits...
   git push -u origin feature/<name>
   # open PR into origin/main
   ```
2. **Custom work**
   ```bash
   git checkout aeyeops/custom-main
   git checkout -b custom/<name>
   # ...changes & commits...
   git push -u origin custom/<name>
   # open PR into origin:aeyeops/custom-main
   ```
3. **Upstream sync**
   ```bash
   scripts/sync-main.sh               # updates local main + pushes to origin
   scripts/update-custom.sh           # merges origin/main into custom branch
   ```

Keeping `main` rebased makes eventual upstream PRs painless while
`aeyeops/custom-main` carries the long-running AeyeOps overlay.

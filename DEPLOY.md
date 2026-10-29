# Putting Eli Check online at eli-check.nl

Eli Check is one small Python web service (OpenFisca rules + the questionnaire), packaged as a Docker image.
The recommended host is **Render** in Frankfurt (EU data stays in the EU, free HTTPS, deploys on every push).
Any other Docker host works too — see the end.

## 1. Put the code on GitHub

```bash
gh repo create eli-check --public --source . --push
```

Public is recommended: the code is licensed AGPL-3.0 (like OpenFisca itself), which means people who use the
website must be able to get its source code. A public repository plus a "Source code" link in the footer covers that.

## 2. Create the service on Render

1. Sign up at [render.com](https://render.com) with your GitHub account.
2. **New → Blueprint**, pick the `eli-check` repository. Render reads `render.yaml` and creates the
   `eli-check` web service (Docker, Frankfurt, free plan).
3. Wait for the first deploy, then open the `https://eli-check.onrender.com` address Render shows you.

Free plan: the service sleeps after 15 minutes without visitors, and the first visit after that takes
about a minute. For a public launch, switch the service to the **Starter** plan (about $7/month) so it is always on.

## 3. Connect eli-check.nl

1. In Render: service → **Settings → Custom Domains**. `eli-check.nl` and `www.eli-check.nl` are already listed
   from `render.yaml`; Render shows the exact DNS records to add.
2. At the company where you registered eli-check.nl, open the DNS settings and add those records
   (usually an **A record** for `eli-check.nl` and a **CNAME** for `www`). Remove any default "parking" records.
3. Back in Render, click **Verify**. HTTPS certificates are issued automatically; DNS can take up to a few hours.

## 4. Updating

Every push to the `main` branch redeploys automatically. GitHub Actions runs the rules tests on every push
(`.github/workflows/test.yml`); check they're green before relying on a deploy.

Yearly upkeep (new amounts every 1 January, some on 1 July and 1 August/September) is described in the README.

## Other hosts

The `Dockerfile` runs anywhere that runs containers (Fly.io in Amsterdam, Railway, Scaleway, a VPS):

```bash
docker build -t eli-check .
docker run -p 8000:8000 eli-check        # http://localhost:8000
```

The container listens on `$PORT` (default 8000). `WEB_CONCURRENCY` sets the number of workers (default 2;
each needs about 150 MB of memory).

## Privacy checklist

- The app stores nothing and logs no requests (no access log in the container).
- Your host may still keep its own request logs — Render keeps them for a limited time; mention this in a
  short privacy statement on the site if you add one.

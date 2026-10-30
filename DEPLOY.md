# Putting Eli Check online at eli-check.nl

Eli Check runs on our own Linux server with Docker: the app container (OpenFisca rules + the questionnaire)
behind [Caddy](https://caddyserver.com), which serves `eli-check.nl` and gets HTTPS certificates automatically.
Everything needed is in [`deploy/`](deploy/).

## 1. DNS

At the registrar of eli-check.nl, remove the parking records and add:

| Type | Name | Value |
|---|---|---|
| A | `@` | the server's public IPv4 address |
| CNAME | `www` | `eli-check.nl` |

Caddy can only get certificates once these resolve, so do this first. Check with
`nslookup eli-check.nl` — it should return the server's address.

## 2. First install on the server

The server needs Docker with the compose plugin, and ports 80 and 443 open to the internet.

```bash
git clone https://github.com/appearance-benjamin/eli-check.git ~/eli-check
cd ~/eli-check/deploy
chmod +x update.sh
./update.sh
```

`update.sh` pulls the latest code, builds the app image, starts the app and Caddy, and removes the old image.
Open https://eli-check.nl — the first visit can take a few seconds while Caddy requests the certificate.

## 3. Updating

Push to `main`, wait for the GitHub Actions tests to pass (`.github/workflows/test.yml` runs the rules tests
and builds and smoke-tests the Docker image), then on the server:

```bash
~/eli-check/deploy/update.sh
```

Yearly upkeep (new amounts every 1 January, some on 1 July and 1 August/September) is described in the README.

## Useful commands (in `~/eli-check/deploy`)

```bash
docker compose ps                 # is it running?
docker compose logs -f caddy      # certificate problems
docker compose logs -f app        # app errors
docker compose down               # stop (certificates are kept in the caddy_data volume)
```

## Running it without the proxy

The `Dockerfile` runs anywhere that runs containers:

```bash
docker build -t eli-check .
docker run -p 8000:8000 eli-check        # http://localhost:8000
```

The container listens on `$PORT` (default 8000). `WEB_CONCURRENCY` sets the number of workers (default 2;
each needs about 150 MB of memory).

## Privacy checklist

- The app stores nothing, and neither the app nor Caddy writes an access log, so visitors' IP addresses
  are not kept.
- The server's own firewall or provider may log traffic; mention this in a short privacy statement on the
  site if you add one.

FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

COPY pyproject.toml README.md ./
COPY openfisca_nl ./openfisca_nl
RUN pip install . && rm -rf openfisca_nl

COPY server.py ./
COPY web ./web

RUN useradd --create-home --uid 10001 app
USER app

EXPOSE 8000

# --preload loads the rules once and shares them between workers. No access log: we don't keep visitors' IPs.
CMD ["sh", "-c", "exec gunicorn server:app --bind 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY:-2} --preload --timeout 60"]

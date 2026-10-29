"""Run Eli Check: OpenFisca Web API under /api, the questionnaire under /.

    python server.py            # http://127.0.0.1:5000
    gunicorn server:app         # production (Linux)
"""

import os
from pathlib import Path

from flask import Flask, send_from_directory
from openfisca_web_api.app import create_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

from openfisca_nl import CountryTaxBenefitSystem

WEB_DIR = Path(__file__).parent / "web"

api = create_app(CountryTaxBenefitSystem())

site = Flask(__name__, static_folder=None)


@site.route("/")
@site.route("/<path:path>")
def static_files(path="index.html"):
    return send_from_directory(WEB_DIR, path)


app = DispatcherMiddleware(site, {"/api": api})


if __name__ == "__main__":
    from werkzeug.serving import run_simple

    port = int(os.environ.get("PORT", "5000"))
    run_simple("127.0.0.1", port, app, use_reloader=True)

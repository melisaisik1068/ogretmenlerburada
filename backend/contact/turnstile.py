import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings


TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


def is_turnstile_enabled() -> bool:
    return bool(getattr(settings, "TURNSTILE_SECRET_KEY", "") or "")


def verify_turnstile(token: str, remoteip: str | None = None) -> bool:
    secret = (getattr(settings, "TURNSTILE_SECRET_KEY", "") or "").strip()
    if not secret:
        return True

    token = (token or "").strip()
    if not token:
        return False

    payload = {"secret": secret, "response": token}
    if remoteip:
        payload["remoteip"] = remoteip

    data = urlencode(payload).encode("utf-8")
    req = Request(TURNSTILE_VERIFY_URL, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("Accept", "application/json")

    try:
        with urlopen(req, timeout=4) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            parsed = json.loads(raw or "{}")
            return bool(parsed.get("success") is True)
    except Exception:
        return False


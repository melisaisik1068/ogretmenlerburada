"""İyzico checkout için ortak alıcı adresi ve public API kök URL."""

from django.conf import settings


def public_api_root() -> str:
    return (getattr(settings, "API_PUBLIC_URL", None) or "").strip().rstrip("/")


def buyer_payload_from_user(user) -> dict:
    gsm = getattr(settings, "IYZICO_PLACEHOLDER_GSM", "+905551112233")
    ident = getattr(settings, "IYZICO_PLACEHOLDER_IDENTITY", "11111111111")
    name = (user.first_name or user.username or "User")[:40]
    surname = (user.last_name or ".")[:40]
    email = (user.email or f"user{user.pk}@placeholder.local")[:120]
    ip = "85.34.78.112"
    uid = str(user.pk)[:40]
    return {
        "id": f"OB{uid}",
        "name": name,
        "surname": surname,
        "gsmNumber": gsm[:20],
        "email": email,
        "identityNumber": ident[:20],
        "lastLoginDate": "2020-01-01 12:00:00",
        "registrationDate": "2020-01-01 12:00:00",
        "registrationAddress": "Türkiye",
        "city": "Istanbul",
        "country": "Turkey",
        "zipCode": "34000",
        "ip": ip,
    }


def billing_address_simple(contact_name: str) -> dict:
    return {
        "contactName": contact_name[:90],
        "city": "Istanbul",
        "country": "Turkey",
        "address": "ÖğretmenAğı digital",
        "zipCode": "34000",
    }

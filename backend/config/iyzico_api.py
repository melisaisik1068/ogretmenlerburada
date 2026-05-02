"""İyzico CheckoutForm başlatma / sonucu okuma."""

from __future__ import annotations

import json
from decimal import Decimal

from django.conf import settings


def iyzico_configured() -> bool:
    return bool(settings.IYZICO_API_KEY and settings.IYZICO_SECRET_KEY)


def _options() -> dict:
    return {
        "api_key": settings.IYZICO_API_KEY,
        "secret_key": settings.IYZICO_SECRET_KEY,
        "base_url": settings.IYZICO_BASE_URL,
    }


def _price_str(amount: Decimal | float | int) -> str:
    d = Decimal(str(amount)).quantize(Decimal("0.01"))
    return format(d, "f")


def _parse_sdk_response(raw) -> dict:
    if hasattr(raw, "read"):
        body = raw.read()
        text = body.decode("utf-8") if isinstance(body, (bytes, bytearray)) else str(body)
        return json.loads(text)
    if isinstance(raw, (bytes, bytearray)):
        return json.loads(raw.decode("utf-8"))
    if isinstance(raw, str):
        return json.loads(raw)
    return dict(raw)


def checkout_form_initialize(
    *,
    locale: str,
    conversation_id: str,
    price_try,
    basket_id: str,
    callback_url_full: str,
    buyer: dict,
    billing_address: dict,
    basket_items: list,
) -> dict:
    """İyzico CheckoutForm başlatır; başarılı yanıtta token / paymentPageUrl döner."""

    import iyzipay

    price_dec = Decimal(str(price_try)).quantize(Decimal("0.01"))
    paid = format(price_dec, "f")

    request = {
        "locale": locale,
        "conversationId": conversation_id,
        "price": paid,
        "paidPrice": paid,
        "currency": "TRY",
        "basketId": basket_id,
        "paymentGroup": "PRODUCT",
        "callbackUrl": callback_url_full,
        "buyer": buyer,
        "shippingAddress": billing_address,
        "billingAddress": billing_address,
        "basketItems": basket_items,
    }

    raw = iyzipay.CheckoutFormInitialize().create(request, _options())
    return _parse_sdk_response(raw)


def checkout_form_retrieve(*, locale: str, conversation_id: str, token: str) -> dict:
    import iyzipay

    request = {"locale": locale, "conversationId": conversation_id, "token": token}
    raw = iyzipay.CheckoutForm().retrieve(request, _options())
    return _parse_sdk_response(raw)

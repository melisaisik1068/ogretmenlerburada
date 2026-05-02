from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Material, MaterialAccess, Order, OrderItem, SellerEarning, SellerPayout


@admin.register(Material)
class MaterialAdmin(ModelAdmin):
    list_display = ["id", "title", "type", "price_try", "is_published", "seller", "created_at"]
    list_filter = ["type", "is_published"]
    search_fields = ["title", "description", "seller__username"]
    raw_id_fields = ["seller"]


@admin.register(MaterialAccess)
class MaterialAccessAdmin(ModelAdmin):
    list_display = ["id", "material", "user", "granted_at"]
    search_fields = ["material__title", "user__username"]
    raw_id_fields = ["material", "user"]


class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ["material"]


@admin.register(SellerPayout)
class SellerPayoutAdmin(ModelAdmin):
    change_list_template = "admin/marketplace/sellerpayout/changelist.html"
    list_display = ["id", "seller", "total_net_try", "paid_at", "reference_note"]
    raw_id_fields = ["seller"]


@admin.register(SellerEarning)
class SellerEarningAdmin(ModelAdmin):
    change_list_template = "admin/marketplace/sellerearning/changelist.html"
    list_display = ["id", "seller", "material", "gross_try", "commission_try", "net_try", "payout_id", "created_at"]
    list_filter = ["payout"]
    raw_id_fields = ["order", "seller", "material", "payout"]
    search_fields = ["seller__username", "material__title"]


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ["id", "buyer", "status", "total_try", "provider", "provider_payment_id", "created_at"]
    list_filter = ["status", "provider"]
    search_fields = ["buyer__username", "provider_payment_id"]
    raw_id_fields = ["buyer"]
    inlines = [OrderItemInline]

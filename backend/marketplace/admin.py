from django.contrib import admin

from .models import Material, MaterialAccess, Order, OrderItem


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "type", "price_try", "is_published", "seller", "created_at"]
    list_filter = ["type", "is_published"]
    search_fields = ["title", "description", "seller__username"]
    raw_id_fields = ["seller"]


@admin.register(MaterialAccess)
class MaterialAccessAdmin(admin.ModelAdmin):
    list_display = ["id", "material", "user", "granted_at"]
    search_fields = ["material__title", "user__username"]
    raw_id_fields = ["material", "user"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ["material"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "buyer", "status", "total_try", "provider", "provider_payment_id", "created_at"]
    list_filter = ["status", "provider"]
    search_fields = ["buyer__username", "provider_payment_id"]
    raw_id_fields = ["buyer"]
    inlines = [OrderItemInline]

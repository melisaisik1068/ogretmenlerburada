from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import Material, MaterialAccess, Order, OrderItem


class MaterialSerializer(serializers.ModelSerializer):
    seller = UserPublicSerializer(read_only=True)
    file = serializers.SerializerMethodField()
    can_download = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = ["id", "seller", "title", "description", "type", "file", "can_download", "price_try", "is_published", "created_at"]
        read_only_fields = ["id", "seller", "created_at"]

    def get_file(self, obj: Material):
        # Never leak direct storage URLs; use the protected download endpoint.
        return ""

    def get_can_download(self, obj: Material) -> bool:
        request = self.context.get("request")
        if request is None:
            return False
        u = getattr(request, "user", None)
        if not getattr(u, "is_authenticated", False):
            return False
        if obj.seller_id == getattr(u, "id", None):
            return True
        if obj.price_try <= 0:
            return True
        return MaterialAccess.objects.filter(material=obj, user=u).exists()


class MaterialAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialAccess
        fields = ["id", "material", "granted_at"]
        read_only_fields = ["id", "granted_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    material = MaterialSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["material", "unit_price_try"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "total_try", "provider", "created_at", "items"]


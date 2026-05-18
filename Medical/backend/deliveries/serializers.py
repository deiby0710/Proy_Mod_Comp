from collections import defaultdict
from django.db import transaction
from rest_framework import serializers
from patients.serializers import PatientSerializer
from products.models import Product
from .models import Delivery, DeliveryItem


class DeliveryItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = DeliveryItem
        fields = [
            'id',
            'product_id',
            'product',
            'product_name',
            'generic_name',
            'price',
            'pharmaceutic_form',
            'final_date',
            'cum',
            'prescribed_quantity',
            'dispensed_quantity',
        ]
        read_only_fields = [
            'id',
            'product',
            'product_name',
            'generic_name',
            'price',
            'pharmaceutic_form',
            'final_date',
            'cum',
        ]


class DeliverySerializer(serializers.ModelSerializer):
    items = DeliveryItemSerializer(many=True)
    patient_detail = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Delivery
        fields = [
            'id',
            'registration_date',
            'patient',
            'patient_detail',
            'note',
            'items',
            'created_at',
        ]
        read_only_fields = ['id', 'patient_detail', 'created_at']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Debe agregar al menos un medicamento a la entrega.')

        for item in value:
            if item['prescribed_quantity'] <= 0:
                raise serializers.ValidationError('La cantidad prescrita debe ser mayor a cero.')
            if item['dispensed_quantity'] <= 0:
                raise serializers.ValidationError('La cantidad dispensada debe ser mayor a cero.')

        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        with transaction.atomic():
            requested_by_product = defaultdict(int)
            for item in items_data:
                requested_by_product[item['product_id']] += item['dispensed_quantity']

            products = {
                product.id: product
                for product in Product.objects.select_for_update().filter(id__in=requested_by_product.keys())
            }

            missing_products = set(requested_by_product.keys()) - set(products.keys())
            if missing_products:
                raise serializers.ValidationError({'items': 'Uno o mas medicamentos no existen en el stock.'})

            for product_id, requested_quantity in requested_by_product.items():
                product = products[product_id]
                if product.quantity < requested_quantity:
                    raise serializers.ValidationError({
                        'stock': f'No tenemos las suficientes cantidades en el stock para {product.comercial_name}. Disponible: {product.quantity}.'
                    })

            delivery = Delivery.objects.create(**validated_data)

            for item in items_data:
                product = products[item['product_id']]
                DeliveryItem.objects.create(
                    delivery=delivery,
                    product=product,
                    product_name=product.comercial_name,
                    generic_name=product.generic_name,
                    price=product.price,
                    pharmaceutic_form=product.pharmaceutic_form,
                    final_date=product.final_date,
                    cum=product.cum,
                    prescribed_quantity=item['prescribed_quantity'],
                    dispensed_quantity=item['dispensed_quantity'],
                )
                product.quantity -= item['dispensed_quantity']
                product.save(update_fields=['quantity'])

            return delivery

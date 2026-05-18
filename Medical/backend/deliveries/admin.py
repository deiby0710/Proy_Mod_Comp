from django.contrib import admin
from .models import Delivery, DeliveryItem


class DeliveryItemInline(admin.TabularInline):
    model = DeliveryItem
    extra = 0
    readonly_fields = (
        'product_name',
        'generic_name',
        'price',
        'pharmaceutic_form',
        'final_date',
        'cum',
    )


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'registration_date', 'patient', 'created_at')
    search_fields = ('patient__identification', 'patient__patient_name')
    inlines = [DeliveryItemInline]


admin.site.register(DeliveryItem)

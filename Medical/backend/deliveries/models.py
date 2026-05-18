from django.db import models
from patients.models import Patient
from products.models import Product


class Delivery(models.Model):
    registration_date = models.DateField()
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='deliveries')
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Entrega {self.id} - {self.patient.patient_name}'


class DeliveryItem(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='delivery_items')
    product_name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pharmaceutic_form = models.CharField(max_length=100)
    final_date = models.DateField()
    cum = models.CharField(max_length=100)
    prescribed_quantity = models.PositiveIntegerField()
    dispensed_quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.product_name} x {self.dispensed_quantity}'

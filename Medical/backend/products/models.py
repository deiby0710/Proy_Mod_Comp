from django.db import models

# Create your models here.
class Product(models.Model):
    # Django crea automaticamente un id, por eso no tenemos id
    comercial_name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    lote = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    description = models.TextField()
    pharmaceutic_form = models.CharField(max_length=100)
    cum = models.CharField(max_length=100)
    final_date = models.DateField()

    def __str__(self):
        return self.comercial_name
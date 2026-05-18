# Generated manually for the deliveries module.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('patients', '0001_initial'),
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registration_date', models.DateField()),
                ('note', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='deliveries', to='patients.patient')),
            ],
        ),
        migrations.CreateModel(
            name='DeliveryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=255)),
                ('generic_name', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('pharmaceutic_form', models.CharField(max_length=100)),
                ('final_date', models.DateField()),
                ('cum', models.CharField(max_length=100)),
                ('prescribed_quantity', models.PositiveIntegerField()),
                ('dispensed_quantity', models.PositiveIntegerField()),
                ('delivery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='deliveries.delivery')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='delivery_items', to='products.product')),
            ],
        ),
    ]

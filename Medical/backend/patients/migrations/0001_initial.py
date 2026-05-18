# Generated manually for the patients module.

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identification', models.CharField(max_length=30, unique=True)),
                ('id_type', models.CharField(choices=[('CC', 'CC'), ('TI', 'TI'), ('AS', 'AS'), ('CE', 'CE'), ('CN', 'CN'), ('MS', 'MS'), ('NI', 'NI'), ('PA', 'PA'), ('PE', 'PE'), ('PT', 'PT'), ('RC', 'RC'), ('SC', 'SC')], max_length=2)),
                ('patient_name', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20)),
                ('birth_date', models.DateField()),
                ('eps', models.CharField(choices=[('EMSSANAR EPS SAS', 'EMSSANAR EPS SAS'), ('MALLAMAS EPS', 'MALLAMAS EPS'), ('SANITAS EPS', 'SANITAS EPS'), ('ASMET SALUD EPS', 'ASMET SALUD EPS'), ('SOS SALUD', 'SOS SALUD')], max_length=100)),
            ],
        ),
    ]

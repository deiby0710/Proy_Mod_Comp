from django.db import models


class Patient(models.Model):
    ID_TYPE_CHOICES = [
        ('CC', 'CC'),
        ('TI', 'TI'),
        ('AS', 'AS'),
        ('CE', 'CE'),
        ('CN', 'CN'),
        ('MS', 'MS'),
        ('NI', 'NI'),
        ('PA', 'PA'),
        ('PE', 'PE'),
        ('PT', 'PT'),
        ('RC', 'RC'),
        ('SC', 'SC'),
    ]

    EPS_CHOICES = [
        ('EMSSANAR EPS SAS', 'EMSSANAR EPS SAS'),
        ('MALLAMAS EPS', 'MALLAMAS EPS'),
        ('SANITAS EPS', 'SANITAS EPS'),
        ('ASMET SALUD EPS', 'ASMET SALUD EPS'),
        ('SOS SALUD', 'SOS SALUD'),
    ]

    identification = models.CharField(max_length=30, unique=True)
    id_type = models.CharField(max_length=2, choices=ID_TYPE_CHOICES)
    patient_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    birth_date = models.DateField()
    eps = models.CharField(max_length=100, choices=EPS_CHOICES)

    def __str__(self):
        return f'{self.identification} - {self.patient_name}'

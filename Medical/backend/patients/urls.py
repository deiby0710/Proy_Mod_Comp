from django.urls import path
from . import views


urlpatterns = [
    path('', views.patient_list),
    path('identification/<str:identification>/', views.patient_by_identification),
    path('<int:id>/', views.patient_detail),
]

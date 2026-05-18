from django.urls import path
from . import views


urlpatterns = [
    path('', views.delivery_list),
    path('<int:id>/', views.delivery_detail),
]

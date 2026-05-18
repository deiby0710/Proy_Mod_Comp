from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Delivery
from .serializers import DeliverySerializer


@api_view(['GET', 'POST'])
def delivery_list(request):
    if request.method == 'GET':
        deliveries = Delivery.objects.select_related('patient').prefetch_related('items').order_by('-registration_date', '-id')
        serializer = DeliverySerializer(deliveries, many=True)
        return Response(serializer.data)

    serializer = DeliverySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def delivery_detail(request, id):
    try:
        delivery = Delivery.objects.select_related('patient').prefetch_related('items').get(id=id)
    except Delivery.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DeliverySerializer(delivery)
    return Response(serializer.data)

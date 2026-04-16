FROM python:3.13-slim

# 🔒 Evitar correr como root
RUN useradd -m appuser

WORKDIR /app

# Copiar solo dependencias primero (mejor cache)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código necesario
COPY . .

# Cambiar propietario
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
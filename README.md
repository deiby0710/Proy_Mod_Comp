# Medical

Aplicacion web para administrar productos medicos y/o farmaceuticos. El proyecto esta dividido en un backend con Django REST Framework, una base de datos PostgreSQL y un frontend en Angular.

## Tecnologias

- Python 3.13
- Django 6.0.4
- Django REST Framework
- PostgreSQL 17
- Angular 21
- Angular Material
- Docker y Docker Compose

## Estructura del proyecto

```text
.
├── backend/              # Configuracion principal de Django
├── products/             # App Django para el CRUD de productos
├── frontend/             # Aplicacion Angular
├── docker-compose.yml    # Servicios de PostgreSQL y backend
├── manage.py             # Comandos de administracion de Django
└── .env.example          # Variables de entorno de ejemplo
```

## Requisitos

Para ejecutar con Docker:

- Docker
- Docker Compose

Para ejecutar manualmente:

- Python 3.13
- PostgreSQL
- Node.js
- npm

## Configuracion

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Variables principales:

```env
SECRET_KEY=change-me
DEBUG=True

DB_NAME=medical_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432

POSTGRES_DB=medical_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

Cuando uses Docker, `DB_HOST` debe ser `db`, porque ese es el nombre del servicio de PostgreSQL en `docker-compose.yml`.

## Ejecucion con Docker

Desde la raiz del proyecto:

```bash
docker compose up --build
```

El backend quedara disponible en:

```text
http://localhost:8000
```

El contenedor del backend ejecuta automaticamente las migraciones antes de iniciar el servidor.

Para detener los servicios:

```bash
docker compose down
```

## Ejecucion manual del backend

Instala las dependencias:

```bash
pip install -r backend/requirements.txt
```

Si ejecutas el backend fuera de Docker, ajusta `DB_HOST` en `.env` para que apunte a tu PostgreSQL local, por ejemplo:

```env
DB_HOST=localhost
```

Aplica migraciones:

```bash
python manage.py migrate
```

Inicia el servidor:

```bash
python manage.py runserver
```

Backend:

```text
http://localhost:8000
```

## Ejecucion del frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:4200
```

El frontend consume el API configurada en:

```ts
http://localhost:8000/api
```

## Endpoints principales

Respuesta base del backend:

```http
GET /
```

Productos:

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/products/` | Lista todos los productos |
| POST | `/api/products/` | Crea un producto |
| GET | `/api/products/<id>/` | Obtiene un producto por id |
| PUT | `/api/products/<id>/` | Actualiza un producto |
| DELETE | `/api/products/<id>/` | Elimina un producto |

Administracion de Django:

```http
GET /admin/
```

## Modelo de producto

Campos principales:

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `comercial_name` | string | Nombre comercial |
| `generic_name` | string | Nombre generico |
| `quantity` | number | Cantidad disponible |
| `lote` | string | Lote del producto |
| `price` | decimal | Precio |
| `description` | string | Descripcion |
| `pharmaceutic_form` | string | Forma farmaceutica |
| `cum` | string | Codigo CUM |
| `final_date` | date | Fecha de vencimiento |

Ejemplo de cuerpo para crear un producto:

```json
{
  "comercial_name": "Acetaminofen MK",
  "generic_name": "Acetaminofen",
  "quantity": 50,
  "lote": "L-2026-01",
  "price": "12500.00",
  "description": "Analgesico y antipiretico",
  "pharmaceutic_form": "Tableta",
  "cum": "123456789",
  "final_date": "2026-12-31"
}
```

## Pruebas

Backend:

```bash
python manage.py test
```

Frontend:

```bash
cd frontend
npm test
```

## Comandos utiles

Crear migraciones despues de modificar modelos:

```bash
python manage.py makemigrations
python manage.py migrate
```

Crear un superusuario para entrar al panel de administracion:

```bash
python manage.py createsuperuser
```

Reconstruir los contenedores:

```bash
docker compose up --build
```

Eliminar contenedores y volumen de PostgreSQL:

```bash
docker compose down -v
```

## Notas

- CORS esta configurado para permitir peticiones desde `http://localhost:4200` y `http://127.0.0.1:4200`.
- La zona horaria del backend es `America/Bogota`.
- El idioma configurado en Django es `es-CO`.
- El archivo `.env` no debe subirse al repositorio; usa `.env.example` como referencia.
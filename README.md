# RedNorte Frontend

Frontend del caso semestral "Servicio publico de Salud RedNorte" para la gestion
de listas de espera hospitalarias.

## Requisitos

- Node.js 20+
- npm 10+
- API Gateway levantado en `http://localhost:8085`

## Instalacion

```bash
npm install
```

## Variables de entorno

1. Copiar archivo de ejemplo:

```bash
cp .env.example .env
```

2. Ajustar, si es necesario:

```env
VITE_API_URL=http://localhost:8085
VITE_ENABLE_DEMO_LOGIN=true
```

`VITE_ENABLE_DEMO_LOGIN=true` permite entrar en modo demo cuando el backend no
esta disponible. Para usar solo backend real, configura:

```env
VITE_ENABLE_DEMO_LOGIN=false
```

## Ejecucion en desarrollo

```bash
npm run dev
```

## Estructura base

```text
src/
  layout/      # Plantillas principales de UI
  pages/       # Vistas por modulo (dashboard, pacientes, citas, profesionales)
  routes/      # Configuracion de rutas
  services/    # Cliente API y servicios REST
```

## Estado actual

- Estructura inicial frontend creada.
- Navegacion base por modulos implementada.
- Cliente API configurado para integrarse con API Gateway.
- Login funcional con persistencia de token en navegador.
- Rutas protegidas para modulos internos (`/app/*`).
- Modulo Pacientes con CRUD visual y fallback mock sin backend.
- Modulo Profesionales con CRUD visual alineado al backend.
- Modulo Citas con CRUD visual y campos compatibles con microservicio.

Los siguientes commits implementaran autenticacion y CRUDs de cada modulo.

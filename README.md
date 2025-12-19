# SmartConfig

Solución completa para el configurador de robots industriales **SmartConfig**. El repositorio contiene:

- **smartconfig-backend**: backend en **Strapi v5** que expone el catálogo y las relaciones de compatibilidad.
- **smartconfig-frontend**: frontend en **React + TypeScript + Vite** que consume la API de Strapi.

## Requisitos

- Node.js **>= 18** y **<= 22** (definido en `smartconfig-backend/package.json`).
- npm **>= 6**.

## Estructura del repositorio

```
smartconfig-backend/   # API REST Strapi v5
smartconfig-frontend/  # UI React + Vite
```

## Puesta en marcha rápida

### 1) Backend (Strapi)

```bash
cd smartconfig-backend
npm install
npm run develop
```

El servidor levanta por defecto en `http://localhost:1337`.

#### Variables de entorno principales

Strapi tiene valores por defecto en configuración, pero **se recomienda** definir un `.env` con:

```env
APP_KEYS=clave1,clave2,clave3
ADMIN_JWT_SECRET=secreto-admin
API_TOKEN_SALT=sal-token-api
TRANSFER_TOKEN_SALT=sal-token-transfer
ENCRYPTION_KEY=clave-cifrado
```

#### Base de datos

Por defecto se usa **SQLite** en `.tmp/data.db`. Para cambiar de motor o ruta usa:

```env
DATABASE_CLIENT=sqlite|postgres|mysql
DATABASE_FILENAME=.tmp/data.db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

#### Comandos útiles (backend)

- `npm run develop` / `npm run dev`: desarrollo con recarga.
- `npm run start`: modo producción.
- `npm run build`: compila el panel de administración.
- `npm test`: ejecuta la suite de tests.

### 2) Frontend (React + Vite)

```bash
cd smartconfig-frontend
npm install
npm run dev
```

El frontend levanta por defecto en `http://localhost:3001` (configurado en `vite.config.ts`).

#### Variables de entorno (frontend)

Crea un `.env` en `smartconfig-frontend`:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_API_TOKEN=
```

- `VITE_STRAPI_URL` es **obligatoria**.
- `VITE_API_TOKEN` es **opcional**; si no se define, el cliente no envía `Authorization`.

## Notas de API

Strapi expone la API REST en `/api/<coleccion>`. Para endpoints de detalle (`/api/<coleccion>/:id`), Strapi v5 usa `documentId` internamente. En tests se obtiene ese valor consultando primero por el UID de cada entidad.

## Scripts del frontend

- `npm run dev`: desarrollo.
- `npm run build`: build de producción.
- `npm run preview`: previsualización del build.
- `npm run lint`: linting ESLint.
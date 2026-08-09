# Pesca Marché

E-commerce de artículos de pesca. Monorepo simple con dos proyectos independientes.

## Estructura

```
pescamarche-site/
├── frontend/   # React + Vite + TypeScript + Redux Toolkit (RTK Query) + styled-components
└── backend/    # NestJS + Mongoose + MongoDB
```

## Frontend

```
cd frontend
npm install
npm run dev
```

- `src/app` — store de Redux
- `src/services/api.ts` — API base de RTK Query
- `src/features/products` — endpoints y tipos de productos (RTK Query)
- `src/pages` — Landing page y página de Productos
- `src/components/layout` — Header, Footer, Layout
- `src/components/product` — componentes de producto (ProductCard)
- `src/styles` — tema y estilos globales de styled-components
- `src/routes` — configuración de React Router

Copiar `.env.example` a `.env` y ajustar `VITE_API_URL` si es necesario.

## Backend

```
cd backend
npm install
npm run start:dev
```

- `src/config` — configuración vía `@nestjs/config`
- `src/modules/products` — módulo, controlador, servicio, schema (Mongoose) y DTOs de productos
- API expuesta bajo el prefijo `/api` (ej: `GET /api/products`)

Copiar `.env.example` a `.env` y ajustar `MONGO_URI` según tu instancia de MongoDB.

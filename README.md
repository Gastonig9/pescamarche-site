# Pescamarche

E-commerce de artículos de pesca. Monorepo simple con tres proyectos independientes.

## Estructura

```
pescamarche-site/
├── frontend/    # React + Vite + TypeScript + Redux Toolkit (RTK Query) + styled-components
├── dashboard/   # React + Vite + TypeScript + Redux Toolkit (RTK Query) + Material UI
└── backend/     # NestJS + Mongoose + MongoDB
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

## Dashboard (panel de gestión)

```
cd dashboard
npm install
npm run dev
```

Corre en `http://localhost:5174` (el frontend usa 5173).

- `src/app` — store de Redux
- `src/services/api.ts` — API base de RTK Query (inyecta el Bearer token)
- `src/features/auth` — login/sesión (JWT en localStorage)
- `src/features/products`, `src/features/orders`, `src/features/users` — endpoints RTK Query
- `src/components/layout/DashboardLayout.tsx` — layout con sidebar (AppBar + Drawer de MUI)
- `src/components/auth/RequireAuth.tsx` — guard de rutas protegidas
- `src/pages` — Login, Inicio, Productos, Pedidos, Usuarios

Requiere que el backend esté corriendo y tener un usuario admin (ver `seed:admin` abajo). Copiar `.env.example` a `.env` y ajustar `VITE_API_URL` si es necesario.

## Backend

```
cd backend
npm install
npm run start:dev
```

- `src/config` — configuración vía `@nestjs/config` (incluye JWT y CORS multi-origen)
- `src/modules/products` — productos (público en GET, protegido admin/staff en escritura)
- `src/modules/users` — maestro de usuarios (admin/staff/customer), protegido solo admin
- `src/modules/auth` — login (JWT) y guards de roles
- `src/modules/orders` — pedidos con estado y envío inline, protegido admin/staff
- API expuesta bajo el prefijo `/api` (ej: `GET /api/products`)

Copiar `.env.example` a `.env` y ajustar `MONGO_URI` según tu instancia de MongoDB.

Para crear el primer usuario administrador (necesario para loguearse en el dashboard):

```
npm run seed:admin
```

Usa las variables `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env` (por defecto `admin@pescamarche.com` / `changeme123`, cambiarlas en producción).

# 🚀 Guía de Setup - Responsividad en Pescamarche

## ✅ Verificación Previa

### Frontend
```
✅ frontend/src/styles/responsive.ts
✅ frontend/src/hooks/useResponsive.ts
✅ frontend/src/components/ui/{Container,Grid,Flex,index}.tsx
✅ frontend/src/components/examples/ResponsiveExample.tsx
```

### Dashboard
```
✅ dashboard/src/theme/muiTheme.ts (actualizado)
✅ dashboard/src/components/layout/DashboardLayout.tsx (actualizado)
```

### Documentación
```
✅ RESPONSIVE_GUIDE.md
✅ RESPONSIVE_CHECKLIST.md
✅ RESPONSIVE_IMPLEMENTATION_SUMMARY.md
```

---

## 🎯 Cómo Empezar

### 1. Frontend - Componentes UI

```typescript
import { Container, Grid, Flex, FlexBetween } from '../components/ui';

// Container - ancho máximo
<Container maxWidth="lg" padding="md">
  Contenido
</Container>

// Grid - columnas responsivas
<Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="16px">
  <Card />
</Grid>

// Flex - flexbox responsivo
<Flex direction="row" justifyContent="space-between" gap="20px">
  <Item />
</Flex>

// Alias útiles
<FlexBetween>
  <h2>Título</h2>
  <Button>Acción</Button>
</FlexBetween>
```

### 2. Frontend - Hooks

```typescript
import { useResponsive } from '../hooks/useResponsive';

const { isMobile, isDesktop, currentBreakpoint } = useResponsive();

if (isMobile) return <MobileView />;
return <DesktopView />;
```

### 3. Frontend - Responsive Helpers

```typescript
import { responsive, media } from '../styles/responsive';
import styled from 'styled-components';

const Card = styled.div`
  ${responsive.padding(8, 16, 24)}
  ${responsive.fontSize(14, 16, 18)}
  
  ${media.md`
    color: red;
  `}
`;
```

### 4. Dashboard - MUI sx prop

```typescript
<Box sx={{
  p: { xs: 1, md: 3 },
  display: { xs: 'block', md: 'flex' },
  gap: { xs: 1, md: 2 },
}}>
  Contenido
</Box>
```

---

## 🧪 Testing Rápido

1. Presiona **F12** (DevTools)
2. Presiona **Ctrl+Shift+M** (Device Toolbar)
3. Prueba: 375px, 768px, 1280px

Checklist:
- [ ] No hay scroll horizontal
- [ ] Texto legible sin zoom
- [ ] Imágenes adaptables
- [ ] Botones tocables (44px)

---

## 📋 Pasos para Migrar Componentes

1. **Identificar:** Qué breakpoints necesita
2. **Implementar:** Usar helpers o componentes UI
3. **Testear:** Todos los tamaños
4. **Documentar:** Cambios realizados

---

## 🐛 Troubleshooting

### Scroll horizontal en móvil
```typescript
overflow-x: hidden;
max-width: 100%;
```

### Texto muy pequeño
```typescript
${responsive.fontSize(14, 16, 18)}
```

### Grid no se adapta
```typescript
<div style={{ minWidth: 0 }}>
  {/* minWidth: 0 permite que se adapte */}
</div>
```

---

## 📚 Recursos

- **RESPONSIVE_GUIDE.md** - Documentación completa
- **ResponsiveExample.tsx** - Ejemplos prácticos
- **RESPONSIVE_CHECKLIST.md** - Guía de verificación

---

**¡Listo para empezar!** 🎉

Última actualización: 2026-08-19

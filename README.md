# AutoLearn Studio — Noa Motors Academy

Prototipo de portfolio: plataforma de formación asistida por IA para una red de concesionarios ficticia (Noa Motors). Construido para demostrar producto, UX y diseño de sistema en un contexto B2B SaaS.

Módulos: Dashboard, Cursos, Crear Curso, AI Review Studio, Empleados, Analíticas y Caso de Estudio / Product Story.

## Arquitectura

Sitio 100% estático (React + Vite + TypeScript, sin backend). Todo el contenido es mock data. Las funciones de "IA" (generación de curso y simulador de objeciones con cliente virtual) se simulan en el cliente en `src/lib/mockAI.ts`, con una latencia artificial vía `setTimeout` para conservar la sensación de procesamiento real. No hay llamadas de red ni claves de API involucradas.

## Correr en local

**Requisitos:** Node.js 18+

```
npm install
npm run dev
```

## Build de producción

```
npm run build
npm run start   # vista previa del build (vite preview)
```

El resultado (`dist/`) es un sitio estático desplegable en cualquier hosting (Vercel, Netlify, GitHub Pages, etc.) sin configuración adicional.

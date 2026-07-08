# AutoLearn Studio — Noa Motors Academy

Prototipo de portfolio: plataforma de formación asistida por IA para una red de concesionarios ficticia (Noa Motors). Construido para demostrar producto, UX y diseño de sistema en un contexto B2B SaaS.

Módulos: Consola, Cursos, Diseñar Curso, Auditoría IA, Empleados, Analíticas y Caso de Estudio.

## Arquitectura

Sitio 100% estático (React + Vite + TypeScript, sin backend). Todo el contenido usa datos simulados. Las funciones de "IA" son una simulación de prototipo: generación de curso, análisis de archivos y simulador de objeciones se resuelven en el cliente desde `src/lib/mockAI.ts`, con latencia artificial vía `setTimeout` para representar el procesamiento de una plataforma real. No hay llamadas de red, claves de API, login ni base de datos.

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

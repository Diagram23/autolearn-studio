import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Lightbulb,
  Layers,
  Users,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Inbox,
  Palette,
  Component,
  MonitorSmartphone,
  Wrench,
  GraduationCap,
  Award,
  ChevronRight,
} from "lucide-react";

interface CaseStudyViewProps {
  onExploreProduct: () => void;
}

type StateKey = "empty" | "loading" | "error" | "success" | "permissions";

export default function CaseStudyView({ onExploreProduct }: CaseStudyViewProps) {
  const [activeState, setActiveState] = useState<StateKey>("empty");

  const personas = [
    {
      role: "Directora de Formación",
      icon: ShieldCheck,
      goal: "Convertir manuales técnicos y circulares comerciales en cursos estructurados sin depender de un equipo de e-learning.",
      pain: "Documentación dispersa en PDF, Word y correos; cada nuevo lanzamiento de vehículo exige capacitar a toda la red en días, no semanas.",
      color: "text-red-600 bg-red-50 border-red-100",
    },
    {
      role: "Asesor Comercial de Ventas",
      icon: Users,
      goal: "Dominar argumentario de producto, financiación y objeciones antes de recibir al cliente en sala.",
      pain: "Formación genérica que no refleja los guiones reales de venta ni el catálogo vigente de modelos.",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      role: "Asesor de Servicio y Posventa",
      icon: Wrench,
      goal: "Resolver dudas de garantía y coberturas con precisión para evitar reclamaciones mal gestionadas.",
      pain: "Confusión entre exclusiones de desgaste y fallos cubiertos; alto coste cuando se informa mal a un cliente.",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      role: "Especialista de Taller",
      icon: GraduationCap,
      goal: "Aplicar protocolos de seguridad de alta tensión de forma consistente en todos los talleres de la red.",
      pain: "Procedimientos críticos de seguridad transmitidos de forma verbal u informal entre turnos.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  const flowSteps = [
    {
      title: "Cargar contenido de origen",
      description: "El manager sube manuales, circulares o pega texto directamente. Puede partir de una plantilla técnica ya adaptada a Noa Motors.",
      icon: Layers,
    },
    {
      title: "Generación asistida por IA",
      description: "El motor estructura automáticamente el material en módulos, lecciones y evaluaciones de opción múltiple.",
      icon: BrainCircuit,
    },
    {
      title: "Auditoría y revisión humana",
      description: "Ningún curso llega al catálogo sin supervisión: edición de contenido, checklist de conformidad de marca y normativa.",
      icon: ShieldCheck,
    },
    {
      title: "Publicación y asignación",
      description: "El curso se publica y queda disponible automáticamente para los roles designados (ventas, posventa, taller).",
      icon: CheckCircle2,
    },
    {
      title: "Medición y refuerzo",
      description: "Se hace seguimiento de finalización y notas; los perfiles con bajo desempeño reciben tutorías 1 a 1.",
      icon: BarChart3,
    },
  ];

  const principles = [
    {
      title: "Confianza antes que automatización",
      description: "La IA propone, la persona decide. Cada borrador pasa por una auditoría explícita antes de llegar a un empleado real.",
      icon: ShieldCheck,
    },
    {
      title: "Jerarquía visual clara",
      description: "Tipografía compacta y disciplinada, uso del color limitado a estado (éxito, alerta, pendiente) para que los datos se lean en segundos.",
      icon: Palette,
    },
    {
      title: "Componentes reutilizables",
      description: "Tarjetas, badges de estado, barras de progreso y paneles de vidrio se repiten de forma consistente en todos los módulos.",
      icon: Component,
    },
    {
      title: "Cobertura total de estados",
      description: "Vacío, cargando, error, éxito y sin permisos están diseñados desde el primer momento, no añadidos al final.",
      icon: MonitorSmartphone,
    },
  ];

  const states: Record<StateKey, { label: string; icon: any; render: React.ReactNode }> = {
    empty: {
      label: "Vacío",
      icon: Inbox,
      render: (
        <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Sin borradores pendientes</p>
          <p className="text-xs text-slate-400 mt-1">Los nuevos cursos generados por IA aparecerán aquí.</p>
        </div>
      ),
    },
    loading: {
      label: "Cargando",
      icon: Clock,
      render: (
        <div className="text-center py-8 bg-slate-900 rounded-xl">
          <div className="relative w-10 h-10 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin" />
          </div>
          <p className="text-xs font-bold text-white">Generando plan de estudio con IA...</p>
          <p className="text-[11px] text-slate-400 mt-1">Estructurando módulos y evaluaciones</p>
        </div>
      ),
    },
    error: {
      label: "Error",
      icon: AlertTriangle,
      render: (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex gap-2 items-start">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Error de Configuración</span>
            <p className="mt-0.5 text-rose-700">Por favor, proporcione material de origen o seleccione una plantilla.</p>
          </div>
        </div>
      ),
    },
    success: {
      label: "Éxito",
      icon: CheckCircle2,
      render: (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <span className="text-xs font-black tracking-widest text-emerald-700 block uppercase">Curso publicado</span>
          <p className="text-[11px] text-emerald-600">Disponible de inmediato para los roles asignados.</p>
        </div>
      ),
    },
    permissions: {
      label: "Sin permisos",
      icon: Lock,
      render: (
        <div className="text-center py-8 border border-slate-200 rounded-xl bg-slate-50/70">
          <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Acceso restringido</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Solo perfiles de Dirección de Formación pueden auditar y publicar cursos. Contacte a su responsable para solicitar acceso.
          </p>
        </div>
      ),
    },
  };

  return (
    <div className="space-y-6 animate-fade-in" id="case-study-container">
      {/* Hero */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial-gradient from-red-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="bg-red-600/20 border border-red-500/30 text-red-300 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Case Study de Producto
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">AutoLearn Studio</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Una plataforma de capacitación asistida por IA para grupos de concesionarios, diseñada para transformar
            manuales técnicos, políticas de garantía y guiones comerciales en cursos estructurados, con supervisión
            humana en cada paso. Este prototipo (Noa Motors Academy) es un caso de estudio de diseño de producto
            para SaaS B2B de formación corporativa.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Product Thinking", "B2B SaaS", "AI-assisted workflows", "Design System"].map((tag) => (
              <span key={tag} className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={onExploreProduct}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            Explorar el Producto <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Problem / Opportunity / Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-2">
          <div className="bg-rose-50 text-rose-600 border border-rose-100 w-9 h-9 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">El Problema</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Los grupos de concesionarios generan documentación técnica y comercial constantemente, pero carecen de
            un flujo rápido para convertirla en formación consistente. El resultado: onboarding lento, asesores
            desactualizados y reclamaciones por información incorrecta.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-2">
          <div className="bg-amber-50 text-amber-600 border border-amber-100 w-9 h-9 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">La Oportunidad</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            La IA generativa puede reducir de días a minutos el tiempo de estructurar un curso, siempre que la
            plataforma mantenga un paso de revisión humana claro para proteger la marca y el cumplimiento normativo.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-2">
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 w-9 h-9 rounded-xl flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">La Solución</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            AutoLearn Studio: un flujo de creación asistida, auditoría de conformidad, publicación segmentada por rol
            y analítica de desempeño, todo dentro de una interfaz premium diseñada para managers no técnicos.
          </p>
        </div>
      </div>

      {/* Personas */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-red-600" /> Usuarios y Necesidades
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Cuatro perfiles reales de un concesionario, con objetivos y fricciones distintas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.role} className="border border-slate-100 rounded-xl p-4 space-y-2.5 bg-slate-50/40">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">{p.role}</h4>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-500 leading-relaxed"><strong className="text-slate-700">Objetivo:</strong> {p.goal}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed"><strong className="text-slate-600">Fricción:</strong> {p.pain}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-600" /> Flujo Central del Producto
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">De documento interno a empleado capacitado, en cinco pasos auditables.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-red-600 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-black text-slate-300">0{idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{step.description}</p>
                </div>
                {idx < flowSteps.length - 1 && (
                  <ChevronRight className="hidden md:block w-4 h-4 text-slate-300 absolute -right-3.5 top-1/2 -translate-y-1/2 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Design principles + States gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <Palette className="w-4 h-4 text-red-600" /> Principios de Diseño
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Decisiones que sostienen la consistencia del sistema visual.</p>
          </div>
          <div className="space-y-3">
            {principles.map((pr) => {
              const Icon = pr.icon;
              return (
                <div key={pr.title} className="flex gap-3 items-start">
                  <div className="bg-red-50 text-red-600 border border-red-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{pr.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{pr.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
              <MonitorSmartphone className="w-4 h-4 text-red-600" /> Sistema de Estados de Interfaz
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Cada pantalla del producto se diseñó contemplando estos cinco estados.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/40">
            {(Object.keys(states) as StateKey[]).map((key) => {
              const s = states[key];
              const Icon = s.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveState(key)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeState === key ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-3 h-3" /> {s.label}
                </button>
              );
            })}
          </div>

          <div className="pt-1">{states[activeState].render}</div>
        </div>
      </div>

      {/* Success measures */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-red-600" /> Cómo Mediríamos el Éxito
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Objetivos de producto para una futura fase real, no datos de producción (este prototipo usa datos simulados).
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tiempo de creación</span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Reducir el tiempo de diseñar un curso de días a minutos, sin perder control de calidad.</p>
          </div>
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Finalización y notas</span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Aumentar la tasa de finalización y detectar a tiempo a empleados que necesitan refuerzo.</p>
          </div>
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Conformidad de marca</span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Garantizar que el 100% del contenido publicado pasó por auditoría humana antes de llegar a la red.</p>
          </div>
        </div>
      </div>

      {/* Tech notes */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          <strong className="text-slate-700">Notas técnicas:</strong> prototipo construido en React + Vite + TypeScript
          con Tailwind, usando datos simulados (sin backend real, login ni base de datos). El generador de cursos
          incluye una ruta de respaldo local cuando no hay una clave de API configurada, para que la demo funcione
          de forma autónoma.
        </p>
        <button
          onClick={onExploreProduct}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Consola
        </button>
      </div>
    </div>
  );
}

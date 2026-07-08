import React from "react";
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  BrainCircuit, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Award
} from "lucide-react";
import { Course, Employee, Activity } from "../types";

interface DashboardViewProps {
  courses: Course[];
  employees: Employee[];
  activities: Activity[];
  onNavigate: (view: "dashboard" | "courses" | "create" | "review" | "employees" | "analytics") => void;
  onSelectReviewCourse: (course: Course) => void;
}

export default function DashboardView({
  courses,
  employees,
  activities,
  onNavigate,
  onSelectReviewCourse,
}: DashboardViewProps) {
  // Stats calculations
  const activeCourses = courses.filter((c) => c.status === "Published");
  const pendingReviewCourses = courses.filter((c) => c.status === "Review");
  const totalEmployeesAssigned = employees.length;
  
  const publishedWithRates = courses.filter((c) => c.status === "Published" && c.completionRate > 0);
  const avgCompletionRate = publishedWithRates.length
    ? Math.round(publishedWithRates.reduce((acc, c) => acc + c.completionRate, 0) / publishedWithRates.length)
    : 78;

  const atRiskCount = employees.filter((e) => e.atRisk).length;

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs overflow-hidden relative" id="welcome-banner">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-r from-transparent to-red-50/50 pointer-events-none hidden md:block" />
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 border border-slate-200">
              Panel Administrativo • Noa Motors
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">
            Consola de Capacitación y Gestión de Noa Motors
          </h1>
          <p className="text-slate-500 mt-1.5 text-xs leading-relaxed">
            Gestione, verifique y despliegue el material formativo y técnico diseñado para la red de asesores. Evalúe el conocimiento del catálogo de vehículos, planes de financiación y políticas de garantías para asegurar el máximo cumplimiento de los estándares de excelencia de la marca.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => onNavigate("create")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
              id="btn-create-course-dash"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Asistente de Diseño de Cursos
            </button>
            <button
              onClick={() => onNavigate("courses")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1"
              id="btn-view-courses-dash"
            >
              Ver Base de Cursos <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between" id="kpi-active-courses">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cursos Activos</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeCourses.length}</h3>
            <span className="text-[11px] text-slate-400 mt-0.5 inline-block">Publicados y desplegados</span>
          </div>
          <div className="bg-red-50 p-3 rounded-xl text-red-600 border border-red-100">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between" id="kpi-employees">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asesores Inscritos</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalEmployeesAssigned}</h3>
            <span className="text-[11px] text-slate-400 mt-0.5 inline-block">En {new Set(employees.map(e => e.department)).size} áreas técnicas</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 border border-emerald-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between" id="kpi-completion">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tasa de Finalización</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h3 className="text-2xl font-black text-slate-900">{avgCompletionRate}%</h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2.4%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 inline-block font-medium text-emerald-600">✓ Meta mínima superada</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600 border border-blue-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between" id="kpi-pending">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendientes de Revisión</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h3 className="text-2xl font-black text-slate-900">{pendingReviewCourses.length}</h3>
              {pendingReviewCourses.length > 0 && (
                <span className="animate-pulse flex h-2 w-2 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[11px] text-slate-400 inline-block">Borradores en cola de auditoría</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Reviews & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-main-grid">
        {/* Left Column: Pending Drafts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs" id="pending-reviews-panel">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-950 tracking-tight">Cursos Pendientes de Verificación</h2>
                <p className="text-xs text-slate-400">Examine y apruebe la estructura generada por el asistente antes de publicarla a los asesores.</p>
              </div>
              <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-200">
                {pendingReviewCourses.length} pendientes
              </span>
            </div>

            {pendingReviewCourses.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Sin borradores pendientes</p>
                <p className="text-xs text-slate-400 mt-1">Los nuevos cursos creados mediante el asistente aparecerán en esta sección.</p>
                <button
                  onClick={() => onNavigate("create")}
                  className="mt-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  Diseñar Nuevo Curso
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingReviewCourses.map((course) => (
                  <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-sm">
                          {course.category === "Vehicle Knowledge" ? "Tecnología de Vehículos" :
                           course.category === "Sales" ? "Estrategia de Ventas" :
                           course.category === "Customer Service" ? "Atención al Cliente" :
                           course.category === "Financing" ? "Financiación F&I" :
                           course.category === "Warranty" ? "Garantías Oficiales" : "Taller"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {course.createdAt}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{course.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-md">{course.description || "Curso formativo para personal de Noa Motors."}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Módulos: {course.modules.length} • Evaluaciones: {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSelectReviewCourse(course);
                        onNavigate("review");
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 self-center border border-red-100/50"
                    >
                      Auditar y Publicar <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats: Role Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">Distribución de Plantilla Inscrita</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs font-bold text-slate-500 block">Ventas</span>
                <span className="text-lg font-black text-slate-800 block mt-1">
                  {employees.filter(e => e.role === "Sales Advisor").length}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Asesores Comerciales</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs font-bold text-slate-500 block">Posventa</span>
                <span className="text-lg font-black text-slate-800 block mt-1">
                  {employees.filter(e => e.role === "Service Advisor").length}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Asesores de Servicio</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs font-bold text-slate-500 block">Taller</span>
                <span className="text-lg font-black text-slate-800 block mt-1">
                  {employees.filter(e => e.role === "Workshop Employee").length}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Mecánica y Electricidad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs" id="recent-activity-panel">
            <h2 className="text-sm font-bold text-slate-950 tracking-tight mb-4 pb-2 border-b border-slate-100">Historial de Actividad Reciente</h2>
            
            <div className="space-y-4">
              {activities.map((activity) => {
                return (
                  <div key={activity.id} className="flex gap-3 items-start text-xs">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      activity.status === "success" ? "bg-emerald-500 animate-pulse" :
                      activity.status === "alert" ? "bg-red-500" : "bg-amber-500"
                    }`} />
                    <div className="space-y-0.5 flex-1">
                      <p className="font-bold text-slate-800">
                        {activity.employeeName}{" "}
                        <span className="font-medium text-slate-400 text-[11px] ml-1">
                          ({activity.employeeRole === "Sales Advisor" ? "Asesor Ventas" : activity.employeeRole === "Service Advisor" ? "Asesor Servicio" : "Técnico Taller"})
                        </span>
                      </p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {activity.action}
                      </p>
                      <p className="text-slate-400 text-[11px] italic font-medium">
                        Curso: {activity.courseTitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 self-start mt-0.5">
                      {activity.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training Alerts block */}
          {atRiskCount > 0 && (
            <div className="bg-rose-50 border border-rose-200/60 rounded-2xl p-4 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">Alertas de Desempeño ({atRiskCount})</h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                  Se han identificado colaboradores con promedios de calificación inferiores al 70%. Se recomienda asignar sesiones de coaching personalizadas o reasignar módulos esenciales del catálogo.
                </p>
                <button
                  onClick={() => onNavigate("analytics")}
                  className="mt-2 text-[11px] font-bold text-rose-800 hover:underline flex items-center gap-0.5"
                >
                  Abrir Módulo de Calidad <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

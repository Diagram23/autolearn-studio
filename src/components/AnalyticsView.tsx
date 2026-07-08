import React from "react";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Award, 
  Users, 
  Clock, 
  Briefcase, 
  Mail, 
  RefreshCw,
  Search,
  BookOpen
} from "lucide-react";
import { Employee, Course } from "../types";

interface AnalyticsViewProps {
  employees: Employee[];
  courses: Course[];
  onTriggerCoaching: (employeeName: string, courseTitle: string) => void;
}

// Lightweight inline SVG radial gauge — no chart dependency required.
function RadialGauge({ value, colorClass }: { value: number; colorClass: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90">
      <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-100" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`${colorClass} transition-all duration-700 ease-out`}
      />
    </svg>
  );
}

export default function AnalyticsView({
  employees,
  courses,
  onTriggerCoaching,
}: AnalyticsViewProps) {
  // Aggregate Metrics
  const totalEmployeesCount = employees.length;
  const atRiskCount = employees.filter((e) => e.atRisk).length;
  
  const publishedCourses = courses.filter((c) => c.status === "Published");
  const avgCompletionRate = publishedCourses.length
    ? Math.round(publishedCourses.reduce((acc, c) => acc + c.completionRate, 0) / publishedCourses.length)
    : 81;

  const avgQuizScore = Math.round(employees.reduce((acc, e) => acc + e.averageQuizScore, 0) / totalEmployeesCount);

  // Hardcoded department stats based on employees
  const departmentStats = [
    { name: "Departamento de Ventas", enrolled: 6, completion: 74, color: "bg-red-500" },
    { name: "Asesores de Servicio / Posventa", enrolled: 4, completion: 86, color: "bg-amber-500" },
    { name: "Taller Mecánico y Mantenimiento", enrolled: 5, completion: 94, color: "bg-emerald-500" },
  ];

  // Most Completed Courses
  const topCourses = [...publishedCourses]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  return (
    <div className="space-y-6" id="analytics-container">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Métricas y Cumplimiento Formativo</h1>
        <p className="text-sm text-slate-500">Supervise promedios de calificación, tasas de finalización por departamento y alertas preventivas de capacitación.</p>
      </div>

      {/* Analytics KPI Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="analytics-kpis">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tasa Promedio de Cierre</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900">{avgCompletionRate}%</h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">+1.8%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Meta corporativa: 80%</p>
          </div>
          <RadialGauge value={avgCompletionRate} colorClass="text-emerald-500" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Promedio de Evaluaciones</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-900">{avgQuizScore}%</h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">+3.5%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Umbral exigido: 75%</p>
          </div>
          <RadialGauge value={avgQuizScore} colorClass="text-red-500" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Borradores en Auditoría</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-slate-900">
              {courses.filter(c => c.status === "Review").length}
            </h3>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.5 rounded-sm">Requiere Acción</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cursos generados pendientes de aprobación</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asesores en Rendimiento Bajo</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className={`text-2xl font-black mt-1 ${atRiskCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-900"}`}>
              {atRiskCount}
            </h3>
            {atRiskCount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 rounded-sm border border-rose-100">Bajo Promedio</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Asesores con promedios por debajo del 70%</p>
        </div>
      </div>

      {/* Department Breakdown & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Compliance Bar Graph (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-4" id="dept-compliance">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nivel de Cumplimiento y Cierre por Área</h3>
            <p className="text-xs text-slate-500 mt-0.5">Porcentaje de asimilación del plan de estudios activo en cada área técnica.</p>
          </div>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="text-slate-500 text-xs">
                    Inscritos: {dept.enrolled} • <strong className="text-slate-800">{dept.completion}% completado</strong>
                  </span>
                </div>
                {/* Visual Bar representation */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dept.color} transition-all duration-1000`} 
                    style={{ width: `${dept.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 leading-relaxed border border-slate-100 mt-4">
            💡 <strong>Observación del Auditor:</strong> El equipo de Taller Mecánico ostenta un excelente 94% de conformidad técnica. Los Asesores de Ventas representan la mayor cola de aprendizaje, concentrándose la mayor dificultad en las evaluaciones del catálogo de vehículos eléctricos y planes de financiación flexible.
          </div>
        </div>

        {/* Top Performer courses (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-4" id="top-courses-performance">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cursos con Mayor Tasa de Cierre</h3>
            <p className="text-xs text-slate-500 mt-0.5">Módulos de capacitación con las mejores notas promedio registradas.</p>
          </div>

          <div className="space-y-3.5 pt-1">
            {topCourses.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                  #{idx + 1}
                </span>
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400">Inscritos: {c.enrolledEmployees}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">{c.completionRate}%</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 py-0.5 rounded-sm tracking-widest uppercase border border-emerald-100">Cerrado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Intervention Board */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs" id="risk-intervention-table">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" /> Panel de Seguimiento de Calidad
            </h3>
            <p className="text-xs text-slate-400">Identificación de calificaciones deficientes para coordinar tutorías de refuerzo individuales.</p>
          </div>
          <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase border border-rose-200 self-start sm:self-auto">
            {atRiskCount} Acciones Recomendadas
          </span>
        </div>

        {/* Risk Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-3">Asesor</th>
                <th className="p-3">Departamento</th>
                <th className="p-3">Cursos Completados</th>
                <th className="p-3">Nota Promedio</th>
                <th className="p-3">Estado de Cumplimiento</th>
                <th className="p-3 text-right">Acción de Refuerzo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const isRisk = emp.atRisk;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-2.5">
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-100" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{emp.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {emp.role === "Sales Advisor" ? "Asesor Comercial" : emp.role === "Service Advisor" ? "Asesor de Servicio" : "Técnico de Taller"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-600">
                      {emp.department === "Sales Department" ? "Departamento de Ventas" :
                       emp.department === "Service Lane Department" ? "Servicio / Posventa" : "Taller y Mecánica"}
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{emp.completedCourses} cursos finalizados</td>
                    <td className="p-3">
                      <span className={`font-bold ${isRisk ? "text-rose-600" : "text-emerald-600"}`}>
                        {emp.averageQuizScore}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                        isRisk 
                          ? "bg-rose-50 text-rose-700 border-rose-200" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {isRisk ? "Bajo Promedio" : "Conforme"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isRisk ? (
                        <button
                          onClick={() => onTriggerCoaching(emp.name, "Capacitación de Refuerzo Noa Motors")}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          Asignar Tutoría 1 a 1
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px] font-medium">Conformidad Óptima</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

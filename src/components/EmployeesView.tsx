import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  Briefcase, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Employee } from "../types";

interface EmployeesViewProps {
  employees: Employee[];
  onTriggerCoaching: (employeeName: string, courseTitle: string) => void;
}

export default function EmployeesView({
  employees,
  onTriggerCoaching,
}: EmployeesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  // Calculated Stats
  const totalEmployees = employees.length;
  const averageDealershipScore = Math.round(
    employees.reduce((acc, emp) => acc + emp.averageQuizScore, 0) / totalEmployees
  );
  const atRiskCount = employees.filter((emp) => emp.atRisk).length;
  const compliantCount = totalEmployees - atRiskCount;

  // Filter Employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize department filtering
    let matchesDept = true;
    if (deptFilter !== "All") {
      if (deptFilter === "Sales") {
        matchesDept = emp.department.toLowerCase().includes("sales");
      } else if (deptFilter === "Service lane") {
        matchesDept = emp.department.toLowerCase().includes("service");
      } else if (deptFilter === "Workshop") {
        matchesDept = emp.department.toLowerCase().includes("workshop") || emp.department.toLowerCase().includes("taller");
      }
    }
    
    let matchesRisk = true;
    if (riskFilter === "Risk") matchesRisk = emp.atRisk;
    if (riskFilter === "Compliant") matchesRisk = !emp.atRisk;

    return matchesSearch && matchesDept && matchesRisk;
  });

  const getRoleNameSpanish = (role: string) => {
    switch (role) {
      case "Sales Advisor": return "Asesor Comercial de Ventas";
      case "Service Advisor": return "Asesor de Servicio y Posventa";
      case "Workshop Employee": return "Técnico Especialista de Taller";
      default: return role;
    }
  };

  const getDepartmentNameSpanish = (dept: string) => {
    if (dept.toLowerCase().includes("sales")) return "Departamento de Ventas";
    if (dept.toLowerCase().includes("service")) return "Servicio y Posventa";
    return "Taller Mecánico y Mantenimiento";
  };

  return (
    <div className="space-y-6 animate-fade-in" id="employees-view-container">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plantilla Formativa de Noa Motors</h1>
        <p className="text-sm text-slate-500">
          Supervise el progreso individual del equipo, promedios de calificación y asigne refuerzos personalizados.
        </p>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tamaño del Equipo</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-slate-900">{totalEmployees}</h3>
            <span className="text-xs font-semibold text-slate-500">Asesores Activos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ventas, posventa y taller</p>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nota Promedio</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-slate-900">{averageDealershipScore}%</h3>
            <span className="text-xs font-semibold text-emerald-600">✓ Aprobado General</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calificación de corte: 70%</p>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Conformidad Óptima</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-slate-900">{compliantCount}</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100">Sin Alertas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Aprobación garantizada en auditoría</p>
        </div>

        <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Refuerzos Recomendados</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className={`text-2xl font-black ${atRiskCount > 0 ? "text-rose-600" : "text-slate-900"}`}>{atRiskCount}</h3>
            {atRiskCount > 0 && (
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded border border-rose-100 animate-pulse">Bajo Promedio</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calificación por debajo del 70%</p>
        </div>
      </div>

      {/* Advanced Filter and Search Panel */}
      <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar asesor por nombre, especialidad o puesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs pl-9 pr-4 py-2 border border-slate-200/60 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[11px] uppercase font-bold text-slate-400">Departamento</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-bold focus:outline-hidden pr-2 cursor-pointer"
              >
                <option value="All">Todos</option>
                <option value="Sales">Ventas</option>
                <option value="Service lane">Servicio y Posventa</option>
                <option value="Workshop">Mecánica y Taller</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[11px] uppercase font-bold text-slate-400">Conformidad</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-bold focus:outline-hidden pr-2 cursor-pointer"
              >
                <option value="All">Todos los Estados</option>
                <option value="Risk">Bajo Promedio (Atención)</option>
                <option value="Compliant">Rendimiento Conforme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Grid Layout - Large Module Cards */}
      {filteredEmployees.length === 0 ? (
        <div className="backdrop-blur-md bg-white/75 border border-slate-200/50 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-slate-700">Ningún colaborador coincide con los filtros</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Pruebe a limpiar el buscador o a cambiar las opciones del filtro.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setDeptFilter("All");
              setRiskFilter("All");
            }}
            className="mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="employees-grid">
          {filteredEmployees.map((emp) => {
            const isRisk = emp.atRisk;
            return (
              <div
                key={emp.id}
                className={`backdrop-blur-md bg-white/75 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                  isRisk ? "border-rose-200 ring-1 ring-rose-50" : "border-slate-200/50 hover:border-slate-300"
                }`}
              >
                {/* Accent line */}
                <div className={`h-1 w-full ${isRisk ? "bg-rose-500 animate-pulse" : "bg-slate-200"}`} />

                <div className="p-5 flex-1 space-y-4">
                  {/* Avatar and details */}
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{emp.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{getRoleNameSpanish(emp.role)}</p>
                      <span className="inline-block mt-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                        {getDepartmentNameSpanish(emp.department)}
                      </span>
                    </div>
                  </div>

                  {/* Studies statistics */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-2">
                      <span className="text-[11px] text-slate-400 block font-bold">Completados</span>
                      <strong className="text-xs font-bold text-slate-800 block mt-0.5">
                        {emp.completedCourses} cursos
                      </strong>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-2">
                      <span className="text-[11px] text-slate-400 block font-bold">En Progreso</span>
                      <strong className="text-xs font-bold text-slate-800 block mt-0.5">
                        {emp.ongoingCourses} activos
                      </strong>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Nota Promedio de Test</span>
                      <span className={`font-bold ${isRisk ? "text-rose-600" : "text-emerald-600"}`}>
                        {emp.averageQuizScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          isRisk ? "bg-rose-500" : "bg-emerald-500"
                        }`} 
                        style={{ width: `${emp.averageQuizScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Translucent footer */}
                <div className="bg-slate-50/65 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    {isRisk ? (
                      <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        <AlertTriangle className="w-3 h-3 text-rose-500" /> Nota Deficiente
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Conforme
                      </span>
                    )}
                  </div>

                  {isRisk ? (
                    <button
                      onClick={() => onTriggerCoaching(emp.name, "Capacitación de Refuerzo Noa Motors")}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      Asignar Tutoría
                    </button>
                  ) : (
                    <span className="text-slate-400 italic text-[11px] font-semibold">Conformidad Óptima</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

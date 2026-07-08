import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Trash2, 
  Plus, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Award,
  HelpCircle,
  Shield
} from "lucide-react";
import { Course, CourseCategory, CourseStatus } from "../types";
import { CATEGORIES_LIST } from "../data";

interface CoursesViewProps {
  courses: Course[];
  onDeleteCourse: (id: string) => void;
  onNavigateToCreate: () => void;
  onSelectReviewCourse: (course: Course) => void;
  onNavigate: (view: "dashboard" | "courses" | "create" | "review" | "employees" | "analytics") => void;
}

export default function CoursesView({
  courses,
  onDeleteCourse,
  onNavigateToCreate,
  onSelectReviewCourse,
  onNavigate,
}: CoursesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleCourseExpand = (id: string) => {
    if (expandedCourseId === id) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(id);
    }
  };

  const getCategoryNameSpanish = (cat: string) => {
    switch (cat) {
      case "Sales": return "Ventas y Comercial";
      case "Customer Service": return "Atención al Cliente";
      case "Vehicle Knowledge": return "Tecnología de Vehículos";
      case "Financing": return "Financiación y Métodos de Pago";
      case "Warranty": return "Garantías y Coberturas";
      case "Workshop": return "Protocolo de Taller";
      default: return cat;
    }
  };

  return (
    <div className="space-y-6" id="courses-view-container">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="courses-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Cursos de Formación</h1>
          <p className="text-sm text-slate-500">Diseñe, publique e inspeccione los módulos de capacitación técnica y comercial de Noa Motors.</p>
        </div>
        <button
          onClick={onNavigateToCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto shadow-2xs"
          id="btn-add-course"
        >
          <BrainCircuit className="w-3.5 h-3.5" /> Asistente de Diseño de Cursos
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-4 shadow-xs space-y-3" id="courses-filters">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar curso por título, descripción o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 px-1">Categoría</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-slate-700 focus:outline-hidden pr-2 cursor-pointer font-bold"
              >
                <option value="All">Todas las Categorías</option>
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>{getCategoryNameSpanish(cat)}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 px-1">Estado</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs text-slate-700 focus:outline-hidden pr-2 cursor-pointer font-bold"
              >
                <option value="All">Todos los Estados</option>
                <option value="Draft">Borrador</option>
                <option value="Review">Bajo Auditoría</option>
                <option value="Published">Publicado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid / List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-slate-700">Ningún curso coincide con su búsqueda</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Pruebe a restablecer los filtros de búsqueda o inicie el generador asistido para añadir nuevo contenido técnico.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
            className="mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" id="courses-list-grid">
          {filteredCourses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? "border-red-200 ring-1 ring-red-50 shadow-xs" : "border-slate-200/60 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Main Row */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider ${
                        course.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        course.status === "Review" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {course.status === "Published" ? "Publicado" : course.status === "Review" ? "En Revisión" : "Borrador"}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-sm">
                        {getCategoryNameSpanish(course.category)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Fecha: {course.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 max-w-3xl leading-6">{course.description || "Sin descripción proporcionada."}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[13px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {course.modules.length} módulos ({totalLessons} lecciones)
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Roles Asignados: {course.assignedRoles.map(r => r === "Sales Advisor" ? "Asesor Comercial" : r === "Service Advisor" ? "Asesor Servicio" : "Técnico Taller").join(", ") || "Ninguno"}
                      </span>
                    </div>
                  </div>

                  {/* Completion and Action Elements */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
                    {course.status === "Published" ? (
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs text-slate-400">Progreso promedio</span>
                          <span className="text-xs font-bold text-slate-800">{course.completionRate}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 block">{course.enrolledEmployees} asesores cursando</span>
                      </div>
                    ) : (
                      <div className="text-left md:text-right">
                        {course.status === "Review" ? (
                          <button
                            onClick={() => {
                              onSelectReviewCourse(course);
                              onNavigate("review");
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            Auditar Borrador <Shield className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium">Borrador Interno</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCourseExpand(course.id)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                        title="Ver plan de estudio"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="hover:bg-rose-50 text-slate-400 hover:text-rose-600 p-2 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Eliminar curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Modules Area */}
                {isExpanded && (
                  <div className="bg-slate-50/70 border-t border-slate-100 p-5 rounded-b-2xl space-y-4">
                    <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">Desglose de Unidades Formativas</h4>
                    
                    {course.modules.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Este curso aún no contiene unidades formativas.</p>
                    ) : (
                      <div className="space-y-4">
                        {course.modules.map((mod, idx) => (
                          <div key={mod.id} className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3 shadow-2xs">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-[10px] font-bold text-red-600 uppercase tracking-widest">MÓDULO {idx + 1}</h5>
                                <h4 className="text-sm font-bold text-slate-800">{mod.title}</h4>
                                <p className="text-[13px] text-slate-500 mt-1 leading-5">{mod.description}</p>
                              </div>
                            </div>

                            {/* Lessons List inside Module */}
                            <div className="pl-3 border-l-2 border-red-500 space-y-3">
                              {mod.lessons.map((lesson, lIdx) => (
                                <div key={lesson.id} className="space-y-1">
                                  <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">
                                      {lIdx + 1}
                                    </span>
                                    {lesson.title}
                                  </h5>
                                  <p className="text-[13px] md:text-sm text-slate-600 leading-6 pl-6 whitespace-pre-wrap">
                                    {lesson.content}
                                  </p>
                                  {lesson.quiz && (
                                    <div className="ml-5 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 mt-2">
                                      <p className="text-[13px] font-bold text-slate-700 flex items-center gap-1">
                                        <HelpCircle className="w-3.5 h-3.5 text-red-500" /> Evaluación de Módulo: {lesson.quiz.question}
                                      </p>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                        {lesson.quiz.options.map((opt, oIdx) => (
                                          <div 
                                            key={oIdx} 
                                            className={`text-[13px] leading-5 p-3 rounded-lg border ${
                                              oIdx === lesson.quiz.correctOptionIndex 
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold" 
                                                : "bg-white border-slate-100 text-slate-500"
                                            }`}
                                          >
                                            {oIdx === lesson.quiz.correctOptionIndex ? "✓ Correcta: " : ""}{opt}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

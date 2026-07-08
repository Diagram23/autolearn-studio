import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  Edit3, 
  RefreshCw, 
  AlertCircle, 
  BookOpen, 
  HelpCircle, 
  ChevronRight,
  FileText,
  Bookmark,
  Users,
  CheckCircle2,
  Trash2,
  Save,
  ShieldCheck,
  BrainCircuit,
  Lock,
  Scale
} from "lucide-react";
import { Course, Module, Lesson, Quiz } from "../types";

interface AIReviewViewProps {
  draftCourse: Course | null;
  courses: Course[];
  onUpdateDraftCourse: (course: Course) => void;
  onApproveAndPublish: (course: Course) => void;
  onSelectReviewCourse: (course: Course) => void;
  onRegenerateDraft: () => void;
}

export default function AIReviewView({
  draftCourse,
  courses,
  onUpdateDraftCourse,
  onApproveAndPublish,
  onSelectReviewCourse,
  onRegenerateDraft,
}: AIReviewViewProps) {
  // If there's no active draftCourse in review, let's look for courses with status "Review" or "Draft" in the database
  const reviewableCourses = courses.filter((c) => c.status === "Review" || c.status === "Draft");

  // State for active lesson being edited
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  
  // Form fields for editing
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonContent, setEditLessonContent] = useState("");
  const [editQuizQuestion, setEditQuizQuestion] = useState("");
  const [editQuizOptions, setEditQuizOptions] = useState<string[]>([]);
  const [editQuizCorrectIndex, setEditQuizCorrectIndex] = useState(0);

  // Status flags for modules
  const [approvedModuleIds, setApprovedModuleIds] = useState<Record<string, boolean>>({});

  // Brand & Legal Compliance Auditor checks
  const [compTechMatch, setCompTechMatch] = useState(true);
  const [compLegalFin, setCompLegalFin] = useState(false);
  const [compWarrantyMatch, setCompWarrantyMatch] = useState(true);
  const [compAntiTrust, setCompAntiTrust] = useState(false);
  const [compPrivacyGdpr, setCompPrivacyGdpr] = useState(true);

  useEffect(() => {
    if (draftCourse) {
      const initialApprovals: Record<string, boolean> = {};
      draftCourse.modules.forEach(m => {
        initialApprovals[m.id] = true; // Default approve
      });
      setApprovedModuleIds(initialApprovals);
    }
  }, [draftCourse]);

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

  if (!draftCourse) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/50 p-10 text-center shadow-xs" id="no-review-container">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-md font-bold text-slate-700">Sin Borradores en Auditoría Activa</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
          No se ha seleccionado ningún borrador de curso. Seleccione uno de los borradores pendientes de Noa Motors o diríjase al diseñador para generar uno nuevo.
        </p>

        {reviewableCourses.length > 0 ? (
          <div className="mt-6 max-w-xl mx-auto space-y-2 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Borradores en Cola de Auditoría</span>
            {reviewableCourses.map((c) => (
              <div 
                key={c.id} 
                className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between hover:border-red-200 hover:bg-red-50/10 transition-all cursor-pointer"
                onClick={() => onSelectReviewCourse(c)}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-sm">{getCategoryNameSpanish(c.category)}</span>
                    <span className="text-[11px] text-slate-400 font-medium">Creado: {c.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{c.title}</h4>
                </div>
                <button 
                  className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Auditar Curso <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <button
              onClick={() => onRegenerateDraft()}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Ir al Diseñador de Cursos
            </button>
          </div>
        )}
      </div>
    );
  }

  // Handle Editing
  const startEditingLesson = (moduleId: string, lesson: Lesson) => {
    setEditingModuleId(moduleId);
    setEditingLessonId(lesson.id);
    setEditLessonTitle(lesson.title);
    setEditLessonContent(lesson.content);
    if (lesson.quiz) {
      setEditQuizQuestion(lesson.quiz.question);
      setEditQuizOptions([...lesson.quiz.options]);
      setEditQuizCorrectIndex(lesson.quiz.correctOptionIndex);
    } else {
      setEditQuizQuestion("");
      setEditQuizOptions(["", "", ""]);
      setEditQuizCorrectIndex(0);
    }
  };

  const saveLessonEdits = () => {
    if (!editingModuleId || !editingLessonId) return;

    const updatedModules = draftCourse.modules.map((m) => {
      if (m.id === editingModuleId) {
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id === editingLessonId) {
              return {
                ...l,
                title: editLessonTitle,
                content: editLessonContent,
                quiz: {
                  question: editQuizQuestion,
                  options: editQuizOptions.filter(o => o.trim() !== ""),
                  correctOptionIndex: editQuizCorrectIndex
                }
              };
            }
            return l;
          })
        };
      }
      return m;
    });

    onUpdateDraftCourse({
      ...draftCourse,
      modules: updatedModules
    });

    // Reset edit state
    setEditingModuleId(null);
    setEditingLessonId(null);
  };

  const handleToggleModuleApproval = (modId: string) => {
    setApprovedModuleIds(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const allModulesApproved = draftCourse.modules.length > 0 && 
    draftCourse.modules.every(m => approvedModuleIds[m.id]);

  const allCompliancePassed = compTechMatch && compLegalFin && compWarrantyMatch && compAntiTrust && compPrivacyGdpr;
  const canPublish = allModulesApproved && allCompliancePassed;

  return (
    <div className="space-y-6" id="ai-review-container">
      {/* Draft Info Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="draft-review-header">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-radial-gradient from-red-600/10 to-transparent pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Auditoría de Conformidad y Calidad de Marca
            </span>
            <span className="text-xs text-slate-400 font-medium">Borrador: {draftCourse.createdAt}</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">{draftCourse.title}</h1>
          <p className="text-xs text-slate-300 max-w-2xl">{draftCourse.description || "Revise, verifique y edite el contenido didáctico generado antes de publicarlo en el catálogo oficial de Noa Motors."}</p>
          <div className="flex gap-4 pt-1.5 text-xs text-slate-400 font-semibold">
            <span>Área: <strong className="text-white">{getCategoryNameSpanish(draftCourse.category)}</strong></span>
            <span>Destinatarios: <strong className="text-white">{draftCourse.assignedRoles.map(r => r === "Sales Advisor" ? "Asesor Comercial" : r === "Service Advisor" ? "Asesor Servicio" : "Técnico Taller").join(", ") || "Toda la plantilla"}</strong></span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto relative z-10 border-t border-slate-800 md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
          <button
            onClick={onRegenerateDraft}
            className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Volver a Diseñar
          </button>
          <button
            onClick={() => {
              if (canPublish) {
                onApproveAndPublish(draftCourse);
              }
            }}
            disabled={!canPublish}
            title={!canPublish ? "Complete la aprobación de módulos y la auditoría normativa antes de publicar." : "Publicar curso aprobado"}
            className={`flex-1 md:flex-none text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs ${
              canPublish
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "bg-slate-700 text-slate-300 cursor-not-allowed opacity-70"
            }`}
          >
            <Check className="w-4 h-4" /> {canPublish ? "Aprobar y Publicar" : "Auditoría Incompleta"}
          </button>
        </div>
      </div>

      {/* 2-Column Grid for Modules and Compliance Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="review-grid-layout">
        {/* Left Column: Modules list (8 Cols) */}
        <div className="lg:col-span-8 space-y-6" id="review-modules-list">
          {draftCourse.modules.map((mod, mIdx) => {
            const isApproved = !!approvedModuleIds[mod.id];
            return (
              <div 
                key={mod.id} 
                className={`bg-white rounded-2xl border transition-all ${
                  isApproved ? "border-slate-200/60" : "border-amber-200 shadow-2xs"
                }`}
              >
                {/* Module Header Card */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-t-2xl">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">MÓDULO {mIdx + 1} DE {draftCourse.modules.length}</span>
                    <h3 className="text-xs font-bold text-slate-800">{mod.title}</h3>
                    <p className="text-xs text-slate-500">{mod.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleModuleApproval(mod.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 self-start sm:self-auto flex items-center gap-1 cursor-pointer ${
                      isApproved 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs" 
                        : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> {isApproved ? "Módulo Aprobado" : "Aprobar Módulo"}
                  </button>
                </div>

                {/* Module Lessons Container */}
                <div className="p-5 space-y-5">
                  {mod.lessons.map((lesson, lIdx) => {
                    const isEditing = editingModuleId === mod.id && editingLessonId === lesson.id;

                    return (
                      <div 
                        key={lesson.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          isEditing 
                            ? "bg-slate-50/80 border-red-300 ring-1 ring-red-100" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        {/* Active Edit Form */}
                        {isEditing ? (
                          <div className="space-y-4" id="lesson-edit-form">
                            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Edit3 className="w-4 h-4 text-red-500" /> Modificando Unidad Didáctica {lIdx + 1}
                              </span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => { setEditingModuleId(null); setEditingLessonId(null); }}
                                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={saveLessonEdits}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                  title="Guardar cambios"
                                >
                                  <Save className="w-3.5 h-3.5" /> Guardar Cambios
                                </button>
                              </div>
                            </div>

                            {/* Lesson Title input */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Título de la Lección</label>
                              <input
                                type="text"
                                value={editLessonTitle}
                                onChange={(e) => setEditLessonTitle(e.target.value)}
                                className="w-full bg-white text-xs px-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-red-500"
                              />
                            </div>

                            {/* Lesson Content textarea */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contenido de Estudio Técnico/Comercial</label>
                              <textarea
                                rows={5}
                                value={editLessonContent}
                                onChange={(e) => setEditLessonContent(e.target.value)}
                                className="w-full bg-white text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-red-500 font-mono"
                              />
                            </div>

                            {/* Interactive Quiz Editor */}
                            <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 space-y-3">
                              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5 text-red-500" /> Evaluación del Módulo
                              </h4>
                              
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500">Enunciado de la Pregunta</label>
                                <input
                                  type="text"
                                  value={editQuizQuestion}
                                  onChange={(e) => setEditQuizQuestion(e.target.value)}
                                  className="w-full bg-white text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
                                />
                              </div>

                              {/* Options */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500">Opciones de Respuesta e Indicador de Correcta</label>
                                {editQuizOptions.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="correctOption"
                                      checked={editQuizCorrectIndex === oIdx}
                                      onChange={() => setEditQuizCorrectIndex(oIdx)}
                                      className="cursor-pointer text-red-600 focus:ring-red-500"
                                      title="Marcar como correcta"
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const updated = [...editQuizOptions];
                                        updated[oIdx] = e.target.value;
                                        setEditQuizOptions(updated);
                                      }}
                                      placeholder={`Opción ${oIdx + 1}`}
                                      className="flex-1 bg-white text-xs px-2.5 py-1 border border-slate-200 rounded-md focus:outline-hidden"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Standard Display */
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-2 items-center">
                                <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  {lIdx + 1}
                                </span>
                                <h4 className="text-xs font-bold text-slate-800">{lesson.title}</h4>
                              </div>
                              <button
                                onClick={() => startEditingLesson(mod.id, lesson)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                                title="Editar lección"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed pl-7 whitespace-pre-wrap">{lesson.content}</p>

                            {/* Quiz block display */}
                            {lesson.quiz && (
                              <div className="ml-7 bg-slate-50/50 border border-slate-200/50 rounded-xl p-3 space-y-2">
                                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <HelpCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> Evaluación de Aptitud: {lesson.quiz.question}
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {lesson.quiz.options.map((opt, oIdx) => {
                                    const isCorrect = oIdx === lesson.quiz.correctOptionIndex;
                                    return (
                                      <div 
                                        key={oIdx} 
                                        className={`p-2 rounded border text-xs font-medium ${
                                          isCorrect 
                                            ? "bg-emerald-50 border-emerald-100 text-emerald-800 font-bold" 
                                            : "bg-white border-slate-100 text-slate-500"
                                        }`}
                                      >
                                        {isCorrect ? "✓ " : ""}{opt}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Brand & Legal Compliance Auditor Checklist (4 Cols) */}
        <div className="lg:col-span-4 space-y-6" id="compliance-sidebar">
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="text-red-600 w-5 h-5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Auditoría Normativa</h3>
                <p className="text-[11px] text-slate-400">Verificación obligatoria de marca y legalidad</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Como responsable de formación, debe validar que el borrador del curso de **Noa Motors** respete las directrices comerciales, de posventa y normativas antes de distribuirlo de manera pública.
            </p>

            {/* Checklist Items */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compTechMatch}
                  onChange={() => setCompTechMatch(!compTechMatch)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Veracidad Ficha Técnica</span>
                  <p className="text-[11px] text-slate-500">Datos de autonomía (WLTP), celdas de batería de 800V y CV concuerdan con especificaciones oficiales.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compLegalFin}
                  onChange={() => setCompLegalFin(!compLegalFin)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Transparencia Financiera F&I</span>
                  <p className="text-[11px] text-slate-500">Los ejemplos de cuota mensual y TAE respetan los requisitos de transparencia de consumo.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compWarrantyMatch}
                  onChange={() => setCompWarrantyMatch(!compWarrantyMatch)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Garantía Noa 7-Estrellas</span>
                  <p className="text-[11px] text-slate-500">Se diferencian claramente las coberturas estándar de los consumibles de desgaste (discos, pastillas, neumáticos).</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compAntiTrust}
                  onChange={() => setCompAntiTrust(!compAntiTrust)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Cumplimiento Antimonopolio</span>
                  <p className="text-[11px] text-slate-500">No se induce a pactar márgenes ni precios de venta mínimos con otros distribuidores.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compPrivacyGdpr}
                  onChange={() => setCompPrivacyGdpr(!compPrivacyGdpr)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Protección de Datos (RGPD)</span>
                  <p className="text-[11px] text-slate-500">Los guiones de prospección comercial respetan las directivas de consentimiento y privacidad.</p>
                </div>
              </label>
            </div>

            {/* Compliance Badge Seal */}
            <div className="pt-3 border-t border-slate-100">
              {allCompliancePassed ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 space-y-1 text-center animate-fade-in">
                  <span className="text-xs font-black tracking-widest text-emerald-700 block uppercase">★ CONFORMIDAD DE MARCA CERTIFICADA ★</span>
                  <p className="text-[11px] text-emerald-600 leading-normal">
                    Este curso cumple rigurosamente con los estándares corporativos y regulatorios. Listo para publicación masiva.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 space-y-1 text-center">
                  <span className="text-[11px] font-bold text-amber-700 block uppercase">AUDITORÍA NORMATIVA PENDIENTE</span>
                  <p className="text-[10px] text-amber-600 leading-normal">
                    Revise y tilde los {5 - [compTechMatch, compLegalFin, compWarrantyMatch, compAntiTrust, compPrivacyGdpr].filter(Boolean).length} requerimientos regulatorios y de marca pendientes.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-400">
              <Scale className="w-4 h-4 text-slate-400" />
              <span>Marco Legal Integrado</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Las capacitaciones internas de Noa Motors se auditan periódicamente para garantizar la máxima calificación de calidad en la certificación de red oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

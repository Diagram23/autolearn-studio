import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Award, 
  FileText, 
  Clock, 
  Users,
  Check,
  X,
  Sparkles,
  Shield,
  DollarSign,
  Zap,
  MessageSquare,
  Compass,
  Info,
  Send,
  BrainCircuit,
  RefreshCw
} from "lucide-react";
import { Course, Module, Lesson, Quiz } from "../types";
import { MOCK_VEHICLES, Vehicle } from "../vehicles";
import { mockRoleplayReply, mockRoleplayEvaluate } from "../lib/mockAI";

interface StudentViewProps {
  courses: Course[];
  userRole: "Sales Advisor" | "Service Advisor" | "Workshop Employee";
  userName: string;
  onUpdateCourseProgress: (courseId: string, completionRate: number) => void;
  onQuizCompleted: (employeeName: string, courseTitle: string, passed: boolean, score: number) => void;
}

export default function StudentView({
  courses,
  userRole,
  userName,
  onUpdateCourseProgress,
  onQuizCompleted,
}: StudentViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ mIdx: number; lIdx: number } | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  
  // Tab for Student: either courses syllabus or the interactive Vehicle & Sales catalog
  const [activeSubTab, setActiveSubTab] = useState<"courses" | "catalog" | "financing" | "warranties" | "roleplay">("courses");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // --- IA Roleplay State ---
  const [roleplayStep, setRoleplayStep] = useState<"setup" | "chat" | "evaluation">("setup");
  const [selectedPersonaIdx, setSelectedPersonaIdx] = useState<number>(0);
  const [roleplayDifficulty, setRoleplayDifficulty] = useState<"Normal" | "Experto">("Normal");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; text: string }>>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    tone: string;
    compliance: string;
    strengths: string[];
    weaknesses: string[];
    coaching: string;
  } | null>(null);

  const customerPersonas = [
    {
      id: "p1",
      name: "Marta Gómez",
      avatar: "👩‍💼",
      type: "Compradora Particular",
      difficulty: "Normal",
      avatarBg: "bg-amber-100 text-amber-700",
      description: "Sabor a escepticismo sobre la autonomía del vehículo eléctrico. Viaja con su familia.",
      openingObjection: "Hola. Estoy mirando el Noa Orion EV, pero la verdad es que me da mucho miedo quedarme sin batería a mitad de un viaje con mis hijos. He oído que las autonomías homologadas son una mentira y que los cargadores públicos nunca funcionan.",
      detailedProfile: "Marta Gómez, madre de dos hijos, viaja con frecuencia los fines de semana. Tiene miedo a la 'ansiedad de autonomía' de los coches eléctricos y desconfía de la infraestructura pública.",
      targetProduct: "Noa Orion EV"
    },
    {
      id: "p2",
      name: "Laura Sánchez",
      avatar: "😡",
      type: "Clienta de Posventa Exigente",
      difficulty: "Experto",
      avatarBg: "bg-red-100 text-red-700",
      description: "Reclama desgaste prematuro fuera de garantía. Amenaza con demandas o reseñas negativas.",
      openingObjection: "¡Esto es intolerable! Llevé mi Noa Kronos a cambiar las pastillas y discos de freno con solo 12.000 kilómetros y me quieren cobrar la factura entera. ¡Se supone que tengo la Garantía Corporativa Noa 7-Estrellas! Exijo que se me cubra al 100% o les pondré una demanda judicial y escribiré en todas las redes sociales.",
      detailedProfile: "Laura Sánchez, cliente molesta porque considera que un desgaste a los 12.000 km de frenos se debe a un defecto de fábrica. Quiere que la garantía cubra un consumible exento de garantía estándar.",
      targetProduct: "Servicio de Taller / Garantía 7-Estrellas"
    },
    {
      id: "p3",
      name: "Carlos Méndez",
      avatar: "💼",
      type: "Director de Flotas de Empresa",
      difficulty: "Experto",
      avatarBg: "bg-blue-100 text-blue-700",
      description: "Analiza el Coste Total de Propiedad (TCO) y pide descuentos extremos. Le asusta la depreciación.",
      openingObjection: "Buenas. Estamos evaluando adquirir 5 unidades del Noa Triton Híbrido para nuestros gerentes de ventas. Sin embargo, los tipos de interés de la financiación son muy elevados y la depreciación de los híbridos hoy en día me asusta. ¿Por qué debería elegir el Noa Renting o Noa Way en vez de comprar un diésel convencional?",
      detailedProfile: "Carlos Méndez, financiero y analista de costes. Busca optimización fiscal, reducción del TCO, servicio todo incluido para evitar riesgos de averías y máxima flexibilidad de devolución.",
      targetProduct: "Noa Triton (Híbrido) / Renting"
    }
  ];

  const startRoleplay = () => {
    const persona = customerPersonas[selectedPersonaIdx];
    setChatHistory([
      { role: "model", text: persona.openingObjection }
    ]);
    setRoleplayStep("chat");
    setEvaluationResult(null);
    setCurrentUserMessage("");
  };

  const sendRoleplayMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserMessage.trim() || isGeneratingResponse) return;

    const userMsg = currentUserMessage.trim();
    const updatedHistory = [...chatHistory, { role: "user" as const, text: userMsg }];
    setChatHistory(updatedHistory);
    setCurrentUserMessage("");
    setIsGeneratingResponse(true);

    try {
      // Simulación 100% cliente: sin fetch, sin backend. Ver src/lib/mockAI.ts
      const data = await mockRoleplayReply(updatedHistory);
      if (data && data.reply) {
        setChatHistory([...updatedHistory, { role: "model", text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const evaluateRoleplay = async () => {
    setIsGeneratingResponse(true);
    try {
      // Simulación 100% cliente: sin fetch, sin backend. Ver src/lib/mockAI.ts
      const data = await mockRoleplayEvaluate();
      if (data) {
        setEvaluationResult({
          score: data.score || 80,
          tone: data.tone || "Profesional",
          compliance: data.compliance || "Totalmente Conforme",
          strengths: data.strengths || ["Buena argumentación"],
          weaknesses: data.weaknesses || ["Ninguna"],
          coaching: data.coaching || "Sigue entrenando."
        });
        setRoleplayStep("evaluation");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Filter courses that are published AND match the employee's role
  const assignedCourses = courses.filter(
    (c) => c.status === "Published" && c.assignedRoles.includes(userRole)
  );

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson({ mIdx: 0, lIdx: 0 });
    setQuizSubmitted(false);
    setSelectedOption(null);
    setQuizCorrect(null);
  };

  const handleNextLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    
    const { mIdx, lIdx } = activeLesson;
    const currentModule = selectedCourse.modules[mIdx];
    
    setQuizSubmitted(false);
    setSelectedOption(null);
    setQuizCorrect(null);

    if (lIdx + 1 < currentModule.lessons.length) {
      setActiveLesson({ mIdx, lIdx: lIdx + 1 });
    } else if (mIdx + 1 < selectedCourse.modules.length) {
      setActiveLesson({ mIdx: mIdx + 1, lIdx: 0 });
    } else {
      onUpdateCourseProgress(selectedCourse.id, 100);
      setSelectedCourse(null);
      setActiveLesson(null);
      alert(`Felicidades, ${userName}. ¡Has completado con éxito el curso de capacitación corporativa "${selectedCourse.title}"! Tu progreso ha sido registrado en la base de auditoría.`);
    }
  };

  const handlePrevLesson = () => {
    if (!selectedCourse || !activeLesson) return;
    const { mIdx, lIdx } = activeLesson;
    
    setQuizSubmitted(false);
    setSelectedOption(null);
    setQuizCorrect(null);

    if (lIdx > 0) {
      setActiveLesson({ mIdx, lIdx: lIdx - 1 });
    } else if (mIdx > 0) {
      const prevModule = selectedCourse.modules[mIdx - 1];
      setActiveLesson({ mIdx: mIdx - 1, lIdx: prevModule.lessons.length - 1 });
    }
  };

  const handleSubmitQuiz = (quiz: Quiz) => {
    if (selectedOption === null || !selectedCourse) return;
    
    const isCorrect = selectedOption === quiz.correctOptionIndex;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);

    onQuizCompleted(
      userName,
      selectedCourse.title,
      isCorrect,
      isCorrect ? 100 : 0
    );

    if (activeLesson) {
      const { mIdx, lIdx } = activeLesson;
      let totalLessons = 0;
      let currentLessonIndex = 0;
      selectedCourse.modules.forEach((m, mI) => {
        m.lessons.forEach((l, lI) => {
          totalLessons++;
          if (mI === mIdx && lI === lIdx) {
            currentLessonIndex = totalLessons;
          }
        });
      });
      const compRate = Math.round((currentLessonIndex / totalLessons) * 100);
      onUpdateCourseProgress(selectedCourse.id, compRate);
    }
  };

  return (
    <div className="space-y-6" id="student-view-container">
      
      {/* Student Welcome Banner */}
      {!selectedCourse && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden" id="student-welcome">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-red-600/10 to-transparent pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="bg-red-600/30 border border-red-500/40 text-red-100 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
              Portal del Asesor • Noa Motors
            </span>
            <h1 className="text-xl font-bold tracking-tight">Bienvenido a la Academia Noa Motors, {userName}</h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Estás en el panel de formación integrada. Como <strong>{userRole === "Sales Advisor" ? "Asesor Comercial" : userRole === "Service Advisor" ? "Asesor de Posventa" : "Técnico Especialista de Taller"}</strong>, tienes acceso a tu plan de estudio asignado, al catálogo de vehículos interactivo y a los manuales corporativos de financiación y garantías.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab navigation when not in an active course lesson */}
      {!selectedCourse && (
        <div className="flex border-b border-slate-200/60 pb-px gap-2 scrollbar-none overflow-x-auto">
          <button
            onClick={() => { setActiveSubTab("courses"); setSelectedVehicle(null); }}
            className={`text-xs font-semibold pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "courses"
                ? "border-red-600 text-slate-900 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Plan de Estudio Asignado
          </button>
          <button
            onClick={() => { setActiveSubTab("catalog"); }}
            className={`text-xs font-semibold pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "catalog"
                ? "border-red-600 text-slate-900 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Catálogo de Vehículos Noa Motors
          </button>
          <button
            onClick={() => { setActiveSubTab("financing"); setSelectedVehicle(null); }}
            className={`text-xs font-semibold pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "financing"
                ? "border-red-600 text-slate-900 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Financiación y Métodos de Pago
          </button>
          <button
            onClick={() => { setActiveSubTab("warranties"); setSelectedVehicle(null); }}
            className={`text-xs font-semibold pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "warranties"
                ? "border-red-600 text-slate-900 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Coberturas y Garantía 7-Estrellas
          </button>
          <button
            onClick={() => { setActiveSubTab("roleplay"); setSelectedVehicle(null); }}
            className={`text-xs font-semibold pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "roleplay"
                ? "border-red-600 text-slate-900 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Simulador IA de Objeciones
          </button>
        </div>
      )}

      {/* Main Student Workspace Section */}
      {!selectedCourse ? (
        <div className="space-y-6">
          
          {/* TAB 1: ASSIGNED COURSES */}
          {activeSubTab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Tus Cursos de Capacitación ({assignedCourses.length})</h3>
                <span className="text-[11px] text-slate-400 italic">Auditado para control de conformidad</span>
              </div>
              
              {assignedCourses.length === 0 ? (
                <div className="backdrop-blur-md bg-white/75 rounded-2xl border border-slate-200/50 p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-700">No tienes cursos asignados activos en este momento</p>
                  <p className="text-xs text-slate-400 mt-1">Tu perfil se encuentra en plena conformidad. El Director de Formación te notificará nuevos contenidos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="assigned-courses-grid">
                  {assignedCourses.map((c) => (
                    <div 
                      key={c.id} 
                      className="backdrop-blur-md bg-white/75 rounded-2xl border border-slate-200/50 p-5 hover:border-red-300/60 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                            {c.category === "Vehicle Knowledge" ? "Tecnología de Vehículos" :
                             c.category === "Sales" ? "Estrategia de Ventas" :
                             c.category === "Customer Service" ? "Atención al Cliente" :
                             c.category === "Financing" ? "Financiación F&I" :
                             c.category === "Warranty" ? "Garantías Oficiales" : "Protocolo de Taller"}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Módulos: {c.modules.length}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">{c.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description || "Curso formativo para personal de Noa Motors."}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400 block font-medium">Progreso de estudio</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{c.completionRate}%</span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${c.completionRate}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartCourse(c)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1"
                        >
                          {c.completionRate > 0 ? "Reanudar" : "Comenzar"} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE VEHICLE CATALOG */}
          {activeSubTab === "catalog" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Catálogo Técnico de Modelos Noa Motors</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Estudia a fondo las especificaciones, motores, autonomías y argumentos de venta de cada modelo.</p>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">4 Modelos Activos</span>
              </div>

              {/* Main Catalog Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_VEHICLES.map((vehicle) => {
                  const isSelected = selectedVehicle?.id === vehicle.id;
                  return (
                    <div 
                      key={vehicle.id}
                      className={`backdrop-blur-md bg-white/75 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? "ring-2 ring-red-600 border-red-200" 
                          : "border-slate-200/50 hover:border-slate-300 hover:shadow-xs"
                      }`}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                          {vehicle.type}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm">
                          {vehicle.price}
                        </div>
                      </div>

                      <div className="p-5 flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-800">{vehicle.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-1.5 pl-2.5">
                            <span className="text-[10px] text-slate-400 block font-medium">Motorización</span>
                            <span className="font-semibold text-slate-700">{vehicle.engine}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-1.5 pl-2.5">
                            <span className="text-[10px] text-slate-400 block font-medium">Autonomía / Consumo</span>
                            <span className="font-semibold text-slate-700">{vehicle.rangeOrEfficiency}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Puntos Fuertes de Venta</span>
                          <ul className="text-xs text-slate-600 space-y-1 pl-3.5 list-disc">
                            {vehicle.keySellingPoints.slice(0, 2).map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-50/60 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 italic">Haz clic para ver la guía de objeciones de venta</span>
                        <span className="text-xs font-bold text-red-600 flex items-center gap-0.5">
                          Estudiar detalles <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detail drawer when a vehicle is clicked */}
              {selectedVehicle && (
                <div className="backdrop-blur-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">{selectedVehicle.type}</span>
                      <h3 className="text-md font-extrabold text-slate-900">{selectedVehicle.name} — Ficha de Inducción de Ventas</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedVehicle(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Image & Specs */}
                    <div className="space-y-3 lg:col-span-1">
                      <img 
                        src={selectedVehicle.image} 
                        alt={selectedVehicle.name} 
                        className="w-full h-36 object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                        <h4 className="font-bold text-slate-700">Ficha Técnica</h4>
                        <div className="flex justify-between text-slate-500 py-0.5 border-b border-slate-100">
                          <span>Sist. Eléctrico</span>
                          <span className="font-medium text-slate-700">{selectedVehicle.batteryOrFuel}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 py-0.5 border-b border-slate-100">
                          <span>Propulsor</span>
                          <span className="font-medium text-slate-700">{selectedVehicle.engine}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 py-0.5">
                          <span>Rendimiento</span>
                          <span className="font-medium text-slate-700">{selectedVehicle.rangeOrEfficiency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Argumentos y Puntos clave */}
                    <div className="space-y-3 lg:col-span-1">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Puntos Fuertes para el Argumentario
                      </h4>
                      <div className="space-y-2">
                        {selectedVehicle.keySellingPoints.map((point, idx) => (
                          <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 text-xs text-slate-700 leading-relaxed flex gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Tratamiento de Objeciones y Garantías */}
                    <div className="space-y-3 lg:col-span-1">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-red-500" /> Guía de Objeción Común
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{selectedVehicle.salesObjectionGuide}"
                        </p>
                      </div>

                      <div className="bg-red-50/30 rounded-xl p-4 border border-red-100 space-y-2">
                        <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-red-600" /> Cobertura de Garantía Oficial
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {selectedVehicle.warrantyInfo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCING METHODS MANUAL */}
          {activeSubTab === "financing" && (
            <div className="backdrop-blur-md bg-white/75 rounded-2xl border border-slate-200/50 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Manual Corporativo: Métodos de Pago y Financiación Noa Motors</h3>
                <p className="text-xs text-slate-500">Un asesor comercial de élite debe conocer al detalle las tres modalidades de adquisición financiera para ofrecer la solución óptima a particulares y empresas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Noa Way */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white p-1.5 rounded-lg">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Noa Way (Multi-opción Flexible)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Es la opción favorita del cliente particular moderno. Consiste en pagar una entrada libre y cuotas mensuales muy bajas durante un plazo de 36 o 48 meses. Al finalizar el plazo, el cliente decide de forma garantizada entre tres opciones:
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1.5 pl-3 list-disc">
                    <li><strong>Cambiarlo:</strong> Estrenar un nuevo modelo Noa Motors reajustando su cuota.</li>
                    <li><strong>Quedárselo:</strong> Abonar la última cuota garantizada (VFG) al contado o refinanciarla.</li>
                    <li><strong>Devolverlo:</strong> Entregar el coche sin más cuotas (siempre que cumpla kilometraje y desgaste estándar).</li>
                  </ul>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-red-600 block">Argumento Estrella:</span>
                    <p className="text-[11px] text-slate-600 italic">"No compre la tecnología del mañana hoy, disfrútela y decida a los 3 años si prefiere actualizarse."</p>
                  </div>
                </div>

                {/* Noa Renting */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white p-1.5 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Noa Renting (Todo Incluido)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La modalidad de arrendamiento operativo sin complicaciones, ideal tanto para empresas/autónomos como para particulares que buscan total tranquilidad. Se unifica todo el gasto del vehículo en una sola factura mensual deducible al 100%:
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1.5 pl-3 list-disc">
                    <li>Seguro a todo riesgo sin franquicia.</li>
                    <li>Mantenimiento integral en talleres oficiales Noa Motors.</li>
                    <li>Sustitución de neumáticos y asistencia en carretera 24/7.</li>
                    <li>Impuesto de circulación y tasas de matriculación integrados.</li>
                  </ul>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-red-600 block">Argumento Estrella:</span>
                    <p className="text-[11px] text-slate-600 italic">"Gasto 100% predecible, sin entradas ni sorpresas de mantenimiento, deducible fiscalmente."</p>
                  </div>
                </div>

                {/* Noa Credit */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white p-1.5 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">Noa Credit (Financiación Estándar)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La opción clásica de propiedad para clientes tradicionales que quieren que el coche esté a su nombre desde el primer día. Ofrecemos financiación flexible de hasta 96 meses con las siguientes coberturas opcionales de protección de inversión:
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1.5 pl-3 list-disc">
                    <li><strong>Seguro de Amortización:</strong> Cubre el pago de las cuotas mensuales en caso de desempleo o incapacidad temporal.</li>
                    <li><strong>Seguro de Retorno GAP:</strong> En caso de siniestro total, cubre el 100% de la diferencia entre la indemnización del seguro y la deuda pendiente.</li>
                  </ul>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-red-600 block">Argumento Estrella:</span>
                    <p className="text-[11px] text-slate-600 italic">"Su coche en propiedad absoluta con plazos extendidos y protección integral ante imprevistos."</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: COBERTURAS Y GARANTÍAS */}
          {activeSubTab === "warranties" && (
            <div className="backdrop-blur-md bg-white/75 rounded-2xl border border-slate-200/50 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Garantía Corporativa Noa 7-Estrellas</h3>
                  <p className="text-xs text-slate-500">Un pilar de tranquilidad comercial. Descubra qué cubre y qué excluye el manual oficial de posventa.</p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">7 Años o 150.000 km</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">¿Qué está cubierto al 100%?</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Tren motriz, transmisión y componentes mecánicos</span>
                      <p className="text-slate-600 text-xs leading-relaxed">Bloque motor, culata, turbocompresores, cajas de cambios automáticas/manuales, convertidor de par, diferenciales y juntas homocinéticas.</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Sistemas Eléctricos y Degradación de Batería</span>
                      <p className="text-slate-600 text-xs leading-relaxed">Inversores de alta tensión, cargador a bordo del EV, motor eléctrico síncrono. Cobertura de capacidad de batería de tracción frente a caídas por debajo del 70% de SOH.</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Componentes de Software e Infoentretenimiento</span>
                      <p className="text-slate-600 text-xs leading-relaxed">Unidades lógicas de control del motor (ECU), pantalla táctil central, cuadro de mandos digital y sensores del paquete Active Pilot (primeros 3 años de cobertura total).</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Exclusiones Estrictas (Consumibles de Desgaste)</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50/10 rounded-xl p-3.5 border border-red-100 text-xs space-y-2">
                      <span className="font-bold text-red-900 block">Consumibles exentos de garantía estándar</span>
                      <p className="text-slate-600 text-xs leading-relaxed">Pastillas y discos de freno, embragues de transmisión manual, neumáticos, amortiguadores standard, bujías de encendido térmico, filtros de habitáculo/aceite, fluidos de motor, escobillas limpiaparabrisas y lámparas halógenas convencionales.</p>
                      <div className="bg-white rounded-lg p-2.5 border border-red-200/50 flex gap-2 items-start mt-2">
                        <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[11px] text-red-900 block font-bold">Nota de Posventa para Asesores:</strong>
                          <p className="text-[11px] text-slate-600 leading-normal">
                            Solo se admitirán reclamaciones sobre consumibles de desgaste si se demuestra un fallo de montaje de fábrica en los primeros 3.000 kilómetros o si el cliente ha contratado previamente un contrato de mantenimiento Noa Care.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI ROLEPLAY & OBJECTION SIMULATOR */}
          {activeSubTab === "roleplay" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-600 animate-pulse" /> Simulador IA de Objeciones
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Practica situaciones de venta complejas y gestión de reclamaciones difíciles. La simulación IA evaluará tus respuestas comerciales, tu tono y tu conformidad legal dentro de esta demo.
                  </p>
                </div>
                {roleplayStep !== "setup" && (
                  <button
                    onClick={() => setRoleplayStep("setup")}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shrink-0 self-start md:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Cambiar de Cliente
                  </button>
                )}
              </div>

              {/* STEP 1: SETUP */}
              {roleplayStep === "setup" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  
                  {/* Left columns: Persona selection */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Selecciona el Perfil del Cliente para Iniciar el Juego de Rol</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerPersonas.map((persona, idx) => {
                        const isSelected = selectedPersonaIdx === idx;
                        return (
                          <div
                            key={persona.id}
                            onClick={() => setSelectedPersonaIdx(idx)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                              isSelected
                                ? "border-red-500 bg-red-50/5 ring-1 ring-red-100"
                                : "border-slate-200/60 bg-white/70 hover:border-slate-300"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${persona.avatarBg} font-bold`}>
                                  {persona.avatar}
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  persona.difficulty === "Normal" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                }`}>
                                  {persona.difficulty}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-800">{persona.name}</h5>
                                <span className="text-[11px] text-slate-400 font-medium">{persona.type}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal line-clamp-2">{persona.description}</p>
                            </div>

                            <div className="border-t border-slate-100/70 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                              <span>Vehículo / Producto:</span>
                              <strong className="text-slate-700 font-bold">{persona.targetProduct}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right column: Start panel */}
                  <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 shadow-xs flex flex-col justify-between h-full min-h-[300px]">
                      <div className="space-y-4">
                        <div className="bg-red-600/30 border border-red-500/30 text-red-200 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                          Entrenamiento IA Simulado • Noa Motors
                        </div>
                        <h4 className="text-sm font-bold tracking-tight">Directrices de la Simulación</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          La simulación IA interpretará al cliente seleccionado. Deberás responder a sus dudas aplicando el conocimiento corporativo:
                        </p>
                        <ul className="text-[11px] text-slate-400 space-y-2 pl-3 list-disc">
                          <li>Mantén la máxima cordialidad y empatía de marca.</li>
                          <li>No mientas con cifras técnicas (autonomía WLTP real, desgaste de frenos).</li>
                          <li>Ofrece las soluciones Noa Motors correspondientes (Noa Way, Renting, Garantía 7-Estrellas).</li>
                        </ul>
                      </div>

                      <button
                        onClick={startRoleplay}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        Iniciar Juego de Rol <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: ACTIVE CHAT */}
              {roleplayStep === "chat" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
                  
                  {/* Left panel: Info about customer */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="backdrop-blur-md bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-2xs">
                      <div className="text-center space-y-2">
                        <span className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm ${customerPersonas[selectedPersonaIdx].avatarBg} font-bold`}>
                          {customerPersonas[selectedPersonaIdx].avatar}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{customerPersonas[selectedPersonaIdx].name}</h4>
                          <span className="text-[11px] text-slate-400 font-bold block">{customerPersonas[selectedPersonaIdx].type}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tema del Conflicto</span>
                          <span className="font-bold text-slate-700">{customerPersonas[selectedPersonaIdx].targetProduct}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Perfil Psicológico</span>
                          <p className="text-xs text-slate-600 leading-normal">{customerPersonas[selectedPersonaIdx].detailedProfile}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Progreso de Negociación</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold text-slate-700">Turno {Math.ceil(chatHistory.length / 2)} / 4</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="bg-red-500 h-full rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min((chatHistory.length / 8) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={evaluateRoleplay}
                        disabled={chatHistory.length < 2 || isGeneratingResponse}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Solicitar Auditoría Simulada
                      </button>
                    </div>
                  </div>

                  {/* Right panel: Chat dialogue board */}
                  <div className="lg:col-span-3 flex flex-col h-[500px] backdrop-blur-md bg-white border border-slate-200/60 rounded-2xl shadow-2xs overflow-hidden">
                    
                    {/* Header of Chat */}
                    <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-slate-700">Sesión de Simulación Activa</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Interacción auditada</span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-none">
                      {chatHistory.map((msg, idx) => {
                        const isUser = msg.role === "user";
                        return (
                          <div
                            key={idx}
                            className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                          >
                            <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-3xs ${
                              isUser
                                ? "bg-slate-900 text-white rounded-br-none"
                                : "bg-slate-100 text-slate-800 rounded-bl-none"
                            }`}>
                              <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-50">
                                {isUser ? `Asesor (${userName})` : customerPersonas[selectedPersonaIdx].name}
                              </span>
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}

                      {isGeneratingResponse && (
                        <div className="flex justify-start animate-pulse">
                          <div className="max-w-[80%] rounded-2xl p-4 text-xs bg-slate-50 text-slate-500 rounded-bl-none border border-slate-100 flex items-center gap-2">
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </span>
                            <span>El cliente está pensando su respuesta...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input form footer */}
                    <form onSubmit={sendRoleplayMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2 shrink-0">
                      <input
                        type="text"
                        value={currentUserMessage}
                        onChange={(e) => setCurrentUserMessage(e.target.value)}
                        placeholder={`Escribe tu argumento comercial y responde a ${customerPersonas[selectedPersonaIdx].name}...`}
                        disabled={isGeneratingResponse}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-slate-800 placeholder-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!currentUserMessage.trim() || isGeneratingResponse}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                  </div>
                </div>
              )}

              {/* STEP 3: EVALUATION RESULTS */}
              {roleplayStep === "evaluation" && evaluationResult && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top score block */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-red-600/10 to-transparent pointer-events-none" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center relative z-10">
                      
                      <div className="md:col-span-1 text-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">Puntuación de Desempeño</span>
                        <div className="inline-flex items-baseline gap-1">
                          <span className="text-4xl font-black text-red-500">{evaluationResult.score}</span>
                          <span className="text-lg text-slate-400">/100</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1 font-semibold">Auditoría IA Completada</span>
                      </div>

                      <div className="md:col-span-3 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-red-600/30 border border-red-500/40 text-red-100 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Asesor: {userName}
                          </span>
                          <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Conformidad: {evaluationResult.compliance}
                          </span>
                        </div>
                        <h4 className="text-md font-bold tracking-tight">Análisis de Estilo y Negociación</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <strong>Tono Identificado:</strong> {evaluationResult.tone}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Bento Grid detail strengths, weaknesses, coaching */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Strengths & Areas to Improve */}
                    <div className="space-y-6">
                      
                      <div className="backdrop-blur-md bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Puntos Fuertes del Argumentario
                        </h4>
                        <div className="space-y-3">
                          {evaluationResult.strengths.map((s, idx) => (
                            <div key={idx} className="bg-emerald-50/50 border border-emerald-100/55 rounded-xl p-3 text-xs text-slate-700 leading-relaxed flex gap-2">
                              <span className="text-emerald-600 font-bold shrink-0">•</span>
                              <p>{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="backdrop-blur-md bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-500" /> Áreas de Mejora o Advertencias de Marca
                        </h4>
                        <div className="space-y-3">
                          {evaluationResult.weaknesses.map((w, idx) => (
                            <div key={idx} className="bg-amber-50/30 border border-amber-100/55 rounded-xl p-3 text-xs text-slate-700 leading-relaxed flex gap-2">
                              <span className="text-amber-600 font-bold shrink-0">•</span>
                              <p>{w}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Mentoring & Coaching */}
                    <div className="backdrop-blur-md bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Award className="w-4 h-4 text-red-500" /> Informe Personalizado de Mentoría
                        </h4>
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 text-xs text-slate-700 leading-relaxed space-y-3">
                          <span className="font-bold text-slate-800 block">Consejos del Director de Formación:</span>
                          <p className="whitespace-pre-wrap">{evaluationResult.coaching}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setRoleplayStep("setup")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-all mt-4 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> Realizar Otra Simulación
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        /* ACTIVE STUDY PLANEL (Classroom Mode) */
        <div className="space-y-5" id="active-study-panel">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 py-1.5 px-3 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" /> Volver al Aula de Estudio
          </button>

          {activeLesson && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Study Material Content (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>
                      Módulo {activeLesson.mIdx + 1}: {selectedCourse.modules[activeLesson.mIdx].title}
                    </span>
                    <span>
                      Lección {activeLesson.lIdx + 1} de {selectedCourse.modules[activeLesson.mIdx].lessons.length}
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].title}
                  </h2>
                </div>

                {/* Main Lesson Body Content */}
                <div className="text-xs text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                  {selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].content}
                </div>

                {/* Lesson interactive quiz */}
                {selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz && (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                      <HelpCircle className="w-4 h-4 text-red-600" /> Prueba de Conformidad del Módulo
                    </h3>
                    
                    <p className="text-xs font-bold text-slate-800">
                      {selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz.question}
                    </p>

                    <div className="space-y-2">
                      {selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz.options.map((option, oIdx) => {
                        const isSelected = selectedOption === oIdx;
                        let optionStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-100/50";
                        
                        if (quizSubmitted) {
                          const isCorrectOption = oIdx === selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz.correctOptionIndex;
                          if (isCorrectOption) {
                            optionStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium";
                          } else if (isSelected) {
                            optionStyle = "bg-rose-50 border-rose-300 text-rose-800";
                          } else {
                            optionStyle = "border-slate-100 bg-white text-slate-400 opacity-60";
                          }
                        } else if (isSelected) {
                          optionStyle = "border-red-500 bg-red-50/30 text-red-800 font-medium ring-1 ring-red-100";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedOption(oIdx)}
                            className={`w-full text-left text-xs p-3.5 rounded-xl border transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && oIdx === selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz.correctOptionIndex && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && oIdx !== selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz.correctOptionIndex && (
                              <X className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => handleSubmitQuiz(selectedCourse.modules[activeLesson.mIdx].lessons[activeLesson.lIdx].quiz)}
                        disabled={selectedOption === null}
                        className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                      >
                        Enviar Respuesta y Confirmar Progreso
                      </button>
                    ) : (
                      <div className="flex gap-2 items-center animate-fade-in pt-1">
                        {quizCorrect ? (
                          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/50 p-3 rounded-xl w-full">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> ¡Respuesta correcta! Tu registro de aptitud ha sido enviado al supervisor. Puedes avanzar a la siguiente lección.
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/50 p-3 rounded-xl w-full">
                            Respuesta incorrecta. Por favor, revisa el material de estudio arriba antes de intentar la evaluación nuevamente en tu próximo ciclo.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={handlePrevLesson}
                    disabled={activeLesson.mIdx === 0 && activeLesson.lIdx === 0}
                    className="bg-slate-50 hover:bg-slate-100 disabled:bg-transparent border border-slate-200 disabled:border-slate-100 text-slate-700 disabled:text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Lección Anterior
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={activeLesson.mIdx === selectedCourse.modules.length - 1 && activeLesson.lIdx === selectedCourse.modules[activeLesson.mIdx].lessons.length - 1 && !quizSubmitted}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                  >
                    {activeLesson.mIdx === selectedCourse.modules.length - 1 && activeLesson.lIdx === selectedCourse.modules[activeLesson.mIdx].lessons.length - 1 
                      ? "Finalizar Curso" 
                      : "Siguiente Lección"} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sidebar Navigation (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Temario del Curso</span>
                
                <div className="space-y-4">
                  {selectedCourse.modules.map((m, mIdx) => (
                    <div key={m.id} className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        Módulo {mIdx + 1}: {m.title}
                      </h4>
                      <div className="space-y-1.5 pl-2.5 border-l-2 border-slate-100">
                        {m.lessons.map((l, lIdx) => {
                          const isCurrent = activeLesson.mIdx === mIdx && activeLesson.lIdx === lIdx;
                          return (
                            <button
                              key={l.id}
                              onClick={() => {
                                setActiveLesson({ mIdx, lIdx });
                                setQuizSubmitted(false);
                                setSelectedOption(null);
                                setQuizCorrect(null);
                              }}
                              className={`w-full text-left text-xs px-2 py-1.5 rounded-md block transition-all ${
                                isCurrent 
                                  ? "bg-red-50 text-red-700 font-bold border-l-2 border-red-600" 
                                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              Lección {lIdx + 1}: {l.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

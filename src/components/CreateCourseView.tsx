import React, { useState, useRef } from "react";
import { 
  BrainCircuit, 
  Upload, 
  BookOpen, 
  FileText, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Layers,
  Award,
  Loader2,
  Settings
} from "lucide-react";
import { CourseCategory } from "../types";
import { CATEGORIES_LIST, ROLES_LIST } from "../data";
import { mockGenerateCourse } from "../lib/mockAI";

interface CreateCourseViewProps {
  onCourseGenerated: (courseData: any) => void;
  onNavigate: (view: "dashboard" | "courses" | "create" | "review" | "employees" | "analytics") => void;
}

export default function CreateCourseView({
  onCourseGenerated,
  onNavigate,
}: CreateCourseViewProps) {
  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(1); // 1: Content, 2: AI Draft, 3: Completed
  
  // Form input states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CourseCategory>("Vehicle Knowledge");
  const [assignedRoles, setAssignedRoles] = useState<string[]>(["Sales Advisor"]);
  const [tone, setTone] = useState("Profesional, experto en automoción, persuasivo y comercial");
  const [materials, setMaterials] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);

  // Prototype AI simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick templates in Spanish specific to Noa Motors
  const TEMPLATES = [
    {
      label: "Ficha Técnica Noa EV9 Horizon 2026",
      category: "Vehicle Knowledge" as CourseCategory,
      roles: ["Sales Advisor", "Service Advisor"],
      content: `ESPECIFICACIONES TÉCNICAS: Noa EV9 Horizon SUV Premium 100% Eléctrico.
- Tren motriz: Motores eléctricos duales síncronos de imanes permanentes con potencia combinada de 410 CV. Tracción integral inteligente e-AWD.
- Batería de Tracción: Pack de iones de litio refrigerado por líquido con capacidad neta de 95 kWh.
- Autonomía Homologada: Hasta 600 kilómetros bajo ciclo WLTP combinando trayectos.
- Tecnología de Recarga: Arquitectura de carga ultrarrápida de 800V. Recupera del 10% al 80% en solo 18 minutos usando cargadores de corriente continua (DC).
- Confort Interior: Puesto de conducción digital Dual OLED curvado de 12.3 pulgadas, sistema de conducción asistida Noa Pilot Level 2+, conectividad inalámbrica y actualizaciones OTA.`
    },
    {
      label: "Tratamiento de Objeciones en Recarga Eléctrica",
      category: "Sales" as CourseCategory,
      roles: ["Sales Advisor"],
      content: `MANUAL DE ARGUMENTACIÓN: Objeción por ansiedad de autonomía de vehículos eléctricos.
- Objeción: "No sé si la red pública de cargadores sea suficiente o si me quedaré tirado."
- Argumento 1: Enfoque Noa Motors Charger. Explique que cada compra incluye la instalación subvencionada del cargador doméstico inteligente de 11 kW en su garaje. El 90% de las recargas ocurren durante la noche a un coste insignificante.
- Argumento 2: Planificador de Rutas Noa Connected. Demuestre cómo el navegador integrado calcula las paradas en ruta óptimas en tiempo real de acuerdo a la carga actual de la batería, guiándolo solo a puntos de carga ultrarrápida autorizados.`
    },
    {
      label: "Seguridad de Alta Tensión en Cables Naranjas de Taller",
      category: "Workshop" as CourseCategory,
      roles: ["Workshop Employee"],
      content: `PROTOCOLO DE SEGURIDAD INDUSTRIAL: Mantenimiento y desenergización de vehículos eléctricos en Taller.
- Elemento Crítico: Los cables de color naranja indican alta tensión de hasta 450V DC. Está estrictamente prohibido manipularlos sin equipo dieléctrico.
- Procedimiento Obligatorio: Vista guantes aislantes Clase 0 de hasta 1.000V. Realice el test de inflado previo para verificar la ausencia de microporos.
- Desconexión del Fusible de Seguridad: Antes de trabajar sobre la batería de tracción, extraiga el disyuntor de seguridad de color amarillo localizado bajo la banqueta trasera. Coloque el candado de bloqueo rojo y guarde la llave. Espere exactamente 5 minutos para que se descarguen los condensadores internos.`
    }
  ];

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.label);
    setCategory(tpl.category);
    setAssignedRoles(tpl.roles);
    setMaterials(tpl.content);
    setFileName(null);
    setUploadedFile(null);
  };

  const handleRoleToggle = (role: string) => {
    if (assignedRoles.includes(role)) {
      setAssignedRoles(assignedRoles.filter(r => r !== role));
    } else {
      setAssignedRoles([...assignedRoles, role]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setErrorMsg(null);
    
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    const isText = file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md");

    // Keep file metadata local so the prototype can show an honest upload flow.
    const base64Reader = new FileReader();
    base64Reader.onload = (event) => {
      if (event.target?.result) {
        const resultString = event.target.result as string;
        const commaIndex = resultString.indexOf(",");
        if (commaIndex !== -1) {
          const base64Data = resultString.substring(commaIndex + 1);
          setUploadedFile({
            name: file.name,
            base64: base64Data,
            mimeType: file.type || (isPdf ? "application/pdf" : isImage ? "image/png" : "application/octet-stream")
          });
        }
      }
    };
    base64Reader.readAsDataURL(file);

    if (isText) {
      const textReader = new FileReader();
      textReader.onload = (event) => {
        if (event.target?.result) {
          setMaterials(event.target.result as string);
        }
      };
      textReader.readAsText(file);
    } else if (isPdf) {
      setMaterials(`[Documento PDF de Noa Motors cargado: ${file.name}]\n\nEn esta demo, el archivo se mantiene local y se usa para simular el flujo de análisis de documentos de una plataforma con IA.`);
    } else if (isImage) {
      setMaterials(`[Especificación visual / imagen de red de Noa Motors cargada: ${file.name}]\n\nEn esta demo, la imagen se mantiene local y se usa para simular el flujo de análisis visual asistido por IA.`);
    } else {
      setMaterials(`[Archivo de origen cargado: ${file.name}]\n\nEn esta demo, el archivo se mantiene local y se usa para simular el flujo de análisis asistido por IA.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleGenerateCourse = async () => {
    if (!title.trim()) {
      setErrorMsg("Por favor, introduzca un título para el curso.");
      return;
    }
    if (!materials.trim()) {
      setErrorMsg("Por favor, proporcione material de origen o seleccione una plantilla.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setActiveStep(2);

    setGenerationLogs(["Iniciando simulación de procesamiento de AutoLearn...", "Preparando estructura pedagógica del prototipo..."]);
    
    const logsInterval = setInterval(() => {
      const logOptions = [
        "Analizando el material técnico cargado de Noa Motors...",
        "Estructurando unidades pedagógicas y lecciones comerciales...",
        "Redactando guiones de conversación con clientes reales...",
        "Diseñando preguntas de diagnóstico y resolución de problemas...",
        "Creando pruebas de opción múltiple para auditoría interna...",
        "Validando conformidad técnica y gramatical de la información...",
        "Ensamblando el borrador final para supervisión humana..."
      ];
      const randomLog = logOptions[Math.floor(Math.random() * logOptions.length)];
      setGenerationLogs(prev => [...prev, randomLog]);
    }, 1800);

    try {
      // Simulación 100% cliente: sin fetch, sin backend. Ver src/lib/mockAI.ts
      const generatedData = await mockGenerateCourse(title, category);

      clearInterval(logsInterval);

      const fullyFormedCourse = {
        ...generatedData,
        id: `course-${Date.now()}`,
        status: "Review",
        assignedRoles,
        completionRate: 0,
        enrolledEmployees: 0,
        createdBy: "Director de Formación (Asistencia IA)",
        createdAt: new Date().toISOString().split("T")[0],
        description: `Capacitación integral sobre ${title} estructurada automáticamente a partir de documentación interna. Contiene ${generatedData.modules?.length || 0} unidades didácticas.`
      };

      onCourseGenerated(fullyFormedCourse);
      setActiveStep(3);
    } catch (err: any) {
      clearInterval(logsInterval);
      console.error(err);
      setErrorMsg(err.message || "Se produjo un error al generar el curso. Por favor, verifique el archivo y pruebe de nuevo.");
      setActiveStep(1);
    } finally {
      setIsGenerating(false);
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
    <div className="space-y-6" id="create-course-container">
      {/* Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs flex justify-between items-center overflow-x-auto gap-4" id="stepper">
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            activeStep === 1 ? "bg-red-600 text-white shadow-2xs" : "bg-emerald-100 text-emerald-800"
          }`}>
            {activeStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">1. Configurar y Cargar</span>
            <span className="text-[11px] text-slate-400">Título, roles, manuales</span>
          </div>
        </div>

        <div className="h-0.5 bg-slate-200 flex-1 min-w-[30px]" />

        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            activeStep === 2 ? "bg-red-600 text-white animate-pulse shadow-2xs" : 
            activeStep > 2 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
          }`}>
            {activeStep > 2 ? <Check className="w-4 h-4" /> : "2"}
          </div>
          <div>
            <span className={`text-xs font-bold block ${activeStep === 2 ? "text-red-600" : "text-slate-500"}`}>2. Procesamiento IA</span>
            <span className="text-[11px] text-slate-400">Simulación estructura el temario</span>
          </div>
        </div>

        <div className="h-0.5 bg-slate-200 flex-1 min-w-[30px]" />

        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            activeStep === 3 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
          }`}>
            {activeStep > 2 ? <Check className="w-4 h-4" /> : "3"}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">3. Listo para Auditar</span>
            <span className="text-[11px] text-slate-400">Ajustes finales y publicación</span>
          </div>
        </div>
      </div>

      {/* STEP 1: CONTENT CONFIGURATION */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="step-1-grid">
          {/* Form Area (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="text-red-600 w-5 h-5" /> Parámetros de Curso e Información de Origen
            </h2>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex gap-2 items-start animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error de Configuración</span>
                  <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Course Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Título del Curso Formativo</label>
              <input
                type="text"
                placeholder="Ej. Introducción al Noa EV9 Horizon 2026, Manual de Objeciones de Financiación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>

            {/* Category & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Área Temática / Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CourseCategory)}
                  className="w-full bg-slate-50 text-xs text-slate-700 p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer font-semibold"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>{getCategoryNameSpanish(cat)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Estilo Formativo de la IA</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Ej. Comercial estructurado, guía técnica paso a paso para mecánicos"
                  className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            {/* Target Audience Roles */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Destinatarios Oficiales del Curso</label>
              <div className="flex flex-wrap gap-2">
                {ROLES_LIST.map((role) => {
                  const isChecked = assignedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                        isChecked 
                          ? "bg-red-50 border-red-200 text-red-700 shadow-2xs" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{role === "Sales Advisor" ? "Asesor Comercial" : role === "Service Advisor" ? "Asesor de Servicio" : "Técnico Especialista de Taller"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Documentación Técnica de Origen</label>
              <p className="text-xs text-slate-400">Arrastre manuales de servicio, circulares comerciales o pegue directamente los apuntes de la fábrica.</p>
              
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? "border-red-500 bg-red-50/20" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".txt,.md,.doc,.docx,.pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  {fileName ? `Archivo seleccionado: ${fileName}` : "Suelte el archivo aquí o haga clic para examinar el sistema"}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Soporta manuales PDF, imágenes de producto (PNG/JPG), circulares de Word o texto plano (máx. 10MB)</p>
              </div>

              {/* Text Area */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">O pegue el texto manualmente</span>
                  {materials.length > 0 && (
                    <button 
                      onClick={() => { setMaterials(""); setFileName(null); setUploadedFile(null); }}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      Limpiar Contenido
                    </button>
                  )}
                </div>
                <textarea
                  rows={6}
                  placeholder="Pegue aquí el texto de las especificaciones, objeciones o circulares internas..."
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                <span className="text-[11px] text-slate-400 block text-right">{materials.length} caracteres redactados</span>
              </div>
            </div>

            {/* AI Generation trigger */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateCourse}
                disabled={isGenerating}
                className="bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" /> Generar Plan de Estudio con IA
              </button>
            </div>
          </div>

          {/* Quick Start Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
                <Info className="w-4 h-4 text-slate-400" />
                <span>Cómo opera la plataforma</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Suba circulares técnicas o directrices de marca. En este prototipo, AutoLearn simula cómo un motor de IA sintetizaría la información y la convertiría en 3 unidades formativas lógicas.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cada módulo resultante cuenta con un bloque educativo estructurado, guiones argumentativos enfocados a ventas o resolución de problemas, y pruebas didácticas integradas de opción múltiple.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-xs space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase block tracking-wider">Plantillas Técnicas Oficiales</span>
              <p className="text-xs text-slate-500">¿No cuenta con un archivo a mano? Cargue al instante una de nuestras plantillas piloto de Noa Motors:</p>
              
              <div className="space-y-2 pt-1">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-red-50/30 hover:border-red-200 transition-all text-xs group cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 group-hover:text-red-700">{tpl.label}</span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md font-medium">{getCategoryNameSpanish(tpl.category)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.content}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AI DRAFT GENERATING LOADING SCREEN */}
      {activeStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center shadow-xs space-y-6" id="generating-loading-screen">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-red-50 border-t-red-600 animate-spin" />
            <BrainCircuit className="w-6 h-6 text-red-600 absolute inset-0 m-auto" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">AutoLearn IA está redactando el temario...</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              El prototipo está simulando la síntesis de fichas técnicas, evaluaciones de módulo y guías de ventas. Este proceso toma entre 5 y 8 segundos para representar un flujo real de IA.
            </p>
          </div>

          {/* Logs */}
          <div className="max-w-xl mx-auto bg-slate-900 rounded-xl p-4 text-left font-mono text-[11px] text-slate-300 space-y-1 overflow-y-auto max-h-[180px] shadow-inner border border-slate-800">
            {generationLogs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-red-500 shrink-0">➜</span>
                <span className="text-slate-200">{log}</span>
              </div>
            ))}
            <div className="flex gap-1.5 items-center text-slate-400 animate-pulse mt-1">
              <Loader2 className="w-3 h-3 animate-spin text-red-500" />
              <span>Procesando modelos de conformidad...</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">Simulación de Inteligencia de Noa Motors</p>
        </div>
      )}

      {/* STEP 3: GENERATION COMPLETED STATE */}
      {activeStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-10 text-center shadow-xs space-y-5" id="generation-completed-screen">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
            <Check className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">¡Borrador generado correctamente!</h2>
            <p className="text-xs text-slate-500">
              El plan de estudios generado por el asistente ha sido cargado con éxito. Puede examinarlo, modificar su texto, corregir preguntas o publicarlo directamente en la pestaña de Auditoría.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setActiveStep(1)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Crear Otro Curso
            </button>
            <button
              onClick={() => onNavigate("review")}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              Abrir Revisión IA <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

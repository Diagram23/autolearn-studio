import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, 
  Users, 
  BrainCircuit, 
  TrendingUp, 
  Plus, 
  Wrench, 
  GraduationCap, 
  Clock, 
  Layers,
  Award,
  ChevronRight,
  Shield,
  Briefcase,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Course, Employee, Activity } from "./types";
import { MOCK_COURSES, MOCK_EMPLOYEES, MOCK_ACTIVITIES } from "./data";
import DashboardView from "./components/DashboardView";
import CoursesView from "./components/CoursesView";
import CreateCourseView from "./components/CreateCourseView";
import AIReviewView from "./components/AIReviewView";
import AnalyticsView from "./components/AnalyticsView";
import EmployeesView from "./components/EmployeesView";
import StudentView from "./components/StudentView";
import CaseStudyView from "./components/CaseStudyView";

export default function App() {
  // Global States
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  
  const [activeView, setActiveView] = useState<"dashboard" | "courses" | "create" | "review" | "employees" | "analytics" | "case-study">("dashboard");
  const [preCaseStudyView, setPreCaseStudyView] = useState<"dashboard" | "courses" | "create" | "review" | "employees" | "analytics">("dashboard");
  const [draftCourse, setDraftCourse] = useState<Course | null>(null);

  // Active persona selector state
  const [currentUser, setCurrentUser] = useState<Employee>({
    id: "admin-1",
    name: "Sofía Rivas",
    role: "Directora de Formación",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    completedCourses: 0,
    ongoingCourses: 0,
    averageQuizScore: 95,
    atRisk: false,
    department: "Administración de Personal"
  });

  // Action: Add/Update Generated Course Draft
  const handleCourseGenerated = (generatedCourse: Course) => {
    setDraftCourse(generatedCourse);
    // Add to courses database as "Review" state
    setCourses((prev) => [generatedCourse, ...prev]);
  };

  // Action: Update Active draftCourse during live edit reviews
  const handleUpdateDraftCourse = (updatedCourse: Course) => {
    setDraftCourse(updatedCourse);
    setCourses((prev) => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  // Action: Approve & Publish Draft Course
  const handleApproveAndPublish = (courseToPublish: Course) => {
    const published: Course = {
      ...courseToPublish,
      status: "Published",
      completionRate: 75,
      enrolledEmployees: 12
    };

    setCourses((prev) => prev.map(c => c.id === courseToPublish.id ? published : c));
    if (draftCourse?.id === courseToPublish.id) {
      setDraftCourse(published);
    }

    // Add activity log
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      employeeName: currentUser.name,
      employeeRole: currentUser.role,
      action: "Aprobó y publicó curso oficial",
      courseTitle: courseToPublish.title,
      timestamp: "Hace un momento",
      status: "success"
    };
    setActivities((prev) => [newActivity, ...prev]);

    alert(`🚀 ¡El curso "${courseToPublish.title}" se ha publicado con éxito en el catálogo oficial de Noa Motors!`);
    setActiveView("courses");
  };

  // Action: Delete Course
  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (draftCourse?.id === id) {
      setDraftCourse(null);
    }
  };

  // Action: Trigger 1-on-1 coaching alert
  const handleTriggerCoaching = (employeeName: string, courseTitle: string) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      employeeName: "Dirección de Formación",
      employeeRole: "Admin",
      action: `Coordinación de tutoría presencial asignada para ${employeeName}`,
      courseTitle: courseTitle,
      timestamp: "Hace un momento",
      status: "pending"
    };
    setActivities((prev) => [newActivity, ...prev]);
    alert(`🎯 Plan de tutoría presencial asignado a ${employeeName} para el módulo "${courseTitle}".`);
  };

  // Action: Student quiz completed (passed/failed)
  const handleQuizCompleted = (
    employeeName: string,
    courseTitle: string,
    passed: boolean,
    score: number
  ) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      employeeName,
      employeeRole: currentUser.role,
      action: passed 
        ? `Aprobó evaluación de módulo formativo con ${score}%` 
        : `Realizó intento de evaluación (Requiere repaso formativo)`,
      courseTitle,
      timestamp: "Hace un momento",
      status: passed ? "success" : "alert"
    };

    setActivities((prev) => [newActivity, ...prev]);

    // Update student's local average score & statistics
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.name === employeeName) {
          const newAvg = passed 
            ? Math.round((emp.averageQuizScore + score) / 2) 
            : Math.max(50, emp.averageQuizScore - 10);
          return {
            ...emp,
            averageQuizScore: newAvg,
            completedCourses: passed ? emp.completedCourses + 1 : emp.completedCourses,
            atRisk: newAvg < 70
          };
        }
        return emp;
      })
    );
  };

  // Action: Update course completion percentage
  const handleUpdateCourseProgress = (courseId: string, completionRate: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, completionRate } : c))
    );
  };

  // Switch Active User / Persona Simulation
  const handleUserPersonaSwitch = (userId: string) => {
    if (userId === "admin-1") {
      setCurrentUser({
        id: "admin-1",
        name: "Sofía Rivas",
        role: "Directora de Formación",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        completedCourses: 0,
        ongoingCourses: 0,
        averageQuizScore: 95,
        atRisk: false,
        department: "Administración de Personal"
      });
      setActiveView("dashboard");
    } else {
      const selected = MOCK_EMPLOYEES.find((emp) => emp.id === userId);
      if (selected) {
        setCurrentUser(selected);
      }
    }
  };

  const getRoleLabelSpanish = (role: string) => {
    switch (role) {
      case "Training Manager": return "Directora de Formación";
      case "Sales Advisor": return "Asesor Comercial de Ventas";
      case "Service Advisor": return "Asesor de Servicio y Posventa";
      case "Workshop Employee": return "Especialista de Taller";
      default: return role;
    }
  };

  const isAdmin = currentUser.role === "Training Manager" || currentUser.role === "Directora de Formación";

  // Action: Open the Case Study / Product Story overlay from anywhere, remembering where we came from
  const handleOpenCaseStudy = () => {
    if (activeView !== "case-study") {
      setPreCaseStudyView(activeView as any);
    }
    setActiveView("case-study");
  };

  // Action: Return from the Case Study overlay to the console/dashboard
  const handleExitCaseStudy = () => {
    setActiveView(isAdmin ? preCaseStudyView : "dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-slate-100/60 flex flex-col font-sans" id="applet-shell">
      
      {/* DYNAMIC TOP NAVIGATION BAR - iOS Translucent style */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-slate-200/50 px-6 py-3.5 shrink-0 flex flex-col lg:flex-row items-center justify-between gap-4" id="header">
        
        {/* Left Side Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-red-600 text-white p-2 rounded-xl flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 tracking-wider block">NOA MOTORS ACADEMY</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Portal de Capacitación Corporativa</span>
          </div>
        </div>

        {/* Center Side: Top Navigation Links (Managers/Admins only) */}
        {isAdmin && (
          <nav className="flex flex-wrap items-center justify-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/40 max-w-full overflow-x-auto" id="top-nav-tabs">
            <button
              onClick={() => setActiveView("dashboard")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "dashboard"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="hidden sm:inline">Consola</span>
            </button>
            <button
              onClick={() => setActiveView("courses")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "courses"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="hidden sm:inline">Cursos</span>
            </button>
            <button
              onClick={() => setActiveView("create")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "create"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" /> <span className="hidden sm:inline">Diseñar Curso</span>
            </button>
            <button
              onClick={() => setActiveView("review")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "review"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="hidden sm:inline">Auditoría IA</span>
            </button>
            <button
              onClick={() => setActiveView("employees")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "employees"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="hidden sm:inline">Personal</span>
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeView === "analytics"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="hidden sm:inline">Estadísticas</span>
            </button>
          </nav>
        )}

        {/* Right Side: Demo User Switcher Selector & Active Profile */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenCaseStudy}
            className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
              activeView === "case-study"
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
            id="btn-case-study"
          >
            <Sparkles className="w-3 h-3 text-red-500" /> Caso UX
          </button>

          {!isAdmin && (
            <span className="hidden sm:inline-flex bg-red-50 text-red-600 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-red-200 uppercase tracking-wider">
              Aula Virtual del Asesor
            </span>
          )}

          <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/50 rounded-xl pl-3 pr-2 py-1.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:inline">Simular Rol:</span>
            <select
              value={currentUser.id === "admin-1" ? "admin-1" : currentUser.id}
              onChange={(e) => handleUserPersonaSwitch(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-extrabold focus:outline-hidden cursor-pointer"
              id="role-simulator-dropdown"
            >
              <option value="admin-1">Sofía Rivas (Directora Formación)</option>
              {MOCK_EMPLOYEES.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({getRoleLabelSpanish(emp.role)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border border-slate-200/80 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 block font-semibold mt-1.5 leading-none">{getRoleLabelSpanish(currentUser.role)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* WORKSPACE MAIN BODY CONTAINER - Desktop First Precision */}
      <main className="flex-grow max-w-7xl mx-auto w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8" id="workspace-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeView}-${isAdmin}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {activeView === "case-study" ? (
              <CaseStudyView onExploreProduct={handleExitCaseStudy} />
            ) : isAdmin ? (
              /* Training Manager Views */
              <>
                {activeView === "dashboard" && (
                  <DashboardView
                    courses={courses}
                    employees={employees}
                    activities={activities}
                    onNavigate={(v) => setActiveView(v as any)}
                    onSelectReviewCourse={setDraftCourse}
                  />
                )}

                {activeView === "courses" && (
                  <CoursesView
                    courses={courses}
                    onDeleteCourse={handleDeleteCourse}
                    onNavigateToCreate={() => setActiveView("create")}
                    onSelectReviewCourse={setDraftCourse}
                    onNavigate={(v) => setActiveView(v as any)}
                  />
                )}

                {activeView === "create" && (
                  <CreateCourseView
                    onCourseGenerated={handleCourseGenerated}
                    onNavigate={(v) => setActiveView(v as any)}
                  />
                )}

                {activeView === "review" && (
                  <AIReviewView
                    draftCourse={draftCourse}
                    courses={courses}
                    onUpdateDraftCourse={handleUpdateDraftCourse}
                    onApproveAndPublish={handleApproveAndPublish}
                    onSelectReviewCourse={setDraftCourse}
                    onRegenerateDraft={() => {
                      setDraftCourse(null);
                      setActiveView("create");
                    }}
                  />
                )}

                {activeView === "employees" && (
                  <EmployeesView
                    employees={employees}
                    onTriggerCoaching={handleTriggerCoaching}
                  />
                )}

                {activeView === "analytics" && (
                  <AnalyticsView
                    employees={employees}
                    courses={courses}
                    onTriggerCoaching={handleTriggerCoaching}
                  />
                )}
              </>
            ) : (
              /* Employee/Student Advisor Classroom View */
              <StudentView
                courses={courses}
                userRole={currentUser.role as any}
                userName={currentUser.name}
                onUpdateCourseProgress={handleUpdateCourseProgress}
                onQuizCompleted={handleQuizCompleted}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

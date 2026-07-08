/**
 * Motor de simulación de IA — 100% en el cliente.
 *
 * AutoLearn Studio es un prototipo de portfolio: no existe backend real,
 * clave de API, login ni base de datos.
 *
 * Esta capa simula las respuestas que produciría un flujo de IA real usando
 * promesas con `setTimeout`. Así la demo mantiene un comportamiento creíble
 * sin transmitir archivos ni depender de servicios externos.
 */

export interface GeneratedQuiz {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface GeneratedLesson {
  id: string;
  title: string;
  content: string;
  quiz: GeneratedQuiz;
}

export interface GeneratedModule {
  id: string;
  title: string;
  description: string;
  lessons: GeneratedLesson[];
}

export interface GeneratedCourse {
  title: string;
  category: string;
  modules: GeneratedModule[];
}

/** Simula la latencia de un modelo generativo real. */
function simulateDelay<T>(result: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

/**
 * Genera un curso de ejemplo estructurado en 3 módulos.
 * Contenido determinista para mostrar el resultado esperado de un generador real.
 */
export function generateMockupCourse(title: string, category: string): GeneratedCourse {
  return {
    title: title || "Onboarding del Nuevo Vehículo",
    category: category || "Vehicle Knowledge",
    modules: [
      {
        id: "m1",
        title: "Introducción y Fundamentos",
        description: "Comprensión de los atributos principales del producto, propuesta de valor y mensajes clave para la red comercial.",
        lessons: [
          {
            id: "l1",
            title: "Mecánica Principal y Propuesta de Valor",
            content: "Esta lección resume las especificaciones principales de la gama insignia de Noa Motors. Los equipos de concesionario deben dominar tren motriz, infoentretenimiento, autonomía eléctrica y cobertura de garantía para explicarlos con precisión al cliente. La clave comercial es conectar eficiencia, seguridad y coste total de propiedad con necesidades reales de uso.",
            quiz: {
              question: "¿Cuál es el argumento principal del tren motriz actualizado?",
              options: ["Eficiencia energética líder y rendimiento avanzado de batería", "Dirección mecánica básica como elemento diferencial", "Estética clásica sin mejoras técnicas relevantes"],
              correctOptionIndex: 0
            }
          },
          {
            id: "l2",
            title: "Perfilado de Cliente y Necesidades de Compra",
            content: "Identifique qué valora cada perfil: seguridad, espacio interior, coste de uso, valor residual o experiencia premium. En compradores familiares, priorice asistentes de seguridad y habitabilidad. En perfiles ejecutivos, destaque servicio posventa, garantías ampliadas y tecnología de cabina. En compradores sensibles al precio, convierta la conversación en coste total de propiedad.",
            quiz: {
              question: "¿Qué debe destacarse primero ante un comprador familiar?",
              options: ["Velocidad máxima como dato principal", "Capacidad de carga y sistemas avanzados de seguridad de serie", "Opciones estéticas de llantas personalizadas"],
              correctOptionIndex: 1
            }
          }
        ]
      },
      {
        id: "m2",
        title: "Tácticas Comerciales y Entrega del Vehículo",
        description: "Resolución de objeciones habituales y ejecución del protocolo final de entrega.",
        lessons: [
          {
            id: "l3",
            title: "Gestión de Objeciones de Financiación",
            content: "Explique TAE, renting frente a préstamo tradicional y paquetes de protección como garantía extendida o cobertura de neumáticos. Presente la financiación como una forma de ajustar presupuesto mensual y proteger el activo, evitando que la conversación se centre únicamente en la deuda total.",
            quiz: {
              question: "¿Cuál es la mejor respuesta cuando un cliente objeta el tipo de interés?",
              options: ["Restar importancia a la objeción y decir que las condiciones son inamovibles", "Presentar alternativas promocionales, renting o comparativas con recompra garantizada", "Indicarle que busque financiación por su cuenta sin acompañamiento"],
              correctOptionIndex: 1
            }
          },
          {
            id: "l4",
            title: "Checklist Profesional de Entrega",
            content: "Antes de la salida del cliente, empareje su teléfono, configure la app Noa, active servicios conectados, explique los asistentes de conducción y presente al responsable de posventa. Este cierre convierte la entrega en una experiencia de confianza y mejora la retención futura.",
            quiz: {
              question: "¿Por qué conviene presentar al cliente al responsable de posventa antes de la entrega?",
              options: ["Para reforzar confianza y aumentar la probabilidad de futuras visitas de mantenimiento", "Para alargar innecesariamente el cierre administrativo", "Es un gesto opcional sin impacto comercial"],
              correctOptionIndex: 0
            }
          }
        ]
      },
      {
        id: "m3",
        title: "Posventa, Cuidado y Retención",
        description: "Construcción de relación a largo plazo y retorno del cliente al servicio oficial.",
        lessons: [
          {
            id: "l5",
            title: "Programación de la Primera Visita de Servicio",
            content: "La rentabilidad recurrente de un concesionario se construye en posventa. Fije expectativas claras para la revisión de 8.000 km o 6 meses, explique el valor del mantenimiento preventivo y destaque paquetes incluidos o complementarios cuando correspondan.",
            quiz: {
              question: "¿Cuándo debe programarse la primera revisión de servicio?",
              options: ["Solo cuando aparezca una avería o testigo de emergencia", "A los 8.000 km o 6 meses para revisión preventiva", "Cuando haya vencido por completo la garantía"],
              correctOptionIndex: 1
            }
          },
          {
            id: "l6",
            title: "Calidad Percibida y Encuestas de Satisfacción",
            content: "La satisfacción del cliente impacta directamente en reputación, recompra y estándares de red. Explique de forma transparente la encuesta, pregunte si queda alguna duda sin resolver y cierre la entrega asegurando que el cliente se marcha con una experiencia clara y completa.",
            quiz: {
              question: "¿Cuál es la forma correcta de reforzar una buena valoración de satisfacción?",
              options: ["Presionar al cliente u ofrecer incentivos inapropiados", "Explicar la importancia de la encuesta, resolver dudas y cerrar una experiencia impecable", "No mencionar nunca la encuesta ni comprobar satisfacción"],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  };
}

/**
 * Simula la generación de un curso completo con IA.
 * `delayMs` controla cuánto "procesa" el mock (por defecto entre 4.5s y 6.5s,
 * igual que el rango percibido en la demo original).
 */
export function mockGenerateCourse(title: string, category: string, delayMs?: number): Promise<GeneratedCourse> {
  const ms = delayMs ?? 4500 + Math.random() * 2000;
  return simulateDelay(generateMockupCourse(title, category), ms);
}

/** Respuestas de objeción del "cliente virtual" en el simulador de roleplay. */
const ROLEPLAY_MOCK_RESPONSES = [
  "Entiendo lo que dice sobre la autonomía, pero sigo pensando que para hacer viajes largos de 500km me va a dar ansiedad quedarme sin batería en medio de la autovía.",
  "Pero, ¿qué pasa si la batería se degrada a los 3 años? He oído que cambiar una batería de tracción de 800V cuesta casi tanto como un coche nuevo.",
  "Esa opción del Noa Way suena interesante, pero ¿qué interés TAE tiene la cuota y qué pasa si supero el kilometraje de 15.000 km al año?",
  "Entiendo, pero si los discos de freno se desgastan prematuramente a los 10.000 km, ¿de verdad Noa Motors no lo cubrirá en la Garantía 7-Estrellas?"
];

/**
 * Simula la respuesta del cliente virtual en el chat de roleplay
 * (antes: POST /api/roleplay). Selecciona la réplica según el largo
 * del historial, igual que hacía el servidor.
 */
export function mockRoleplayReply(history: Array<{ role: "user" | "model"; text: string }>): Promise<{ reply: string }> {
  const replyIndex = Math.min(Math.floor(history.length / 2), ROLEPLAY_MOCK_RESPONSES.length - 1);
  return simulateDelay({ reply: ROLEPLAY_MOCK_RESPONSES[replyIndex] }, 1200 + Math.random() * 900);
}

export interface RoleplayEvaluation {
  score: number;
  tone: string;
  compliance: string;
  strengths: string[];
  weaknesses: string[];
  coaching: string;
}

/**
 * Simula la evaluación de desempeño al cerrar el roleplay
 * (antes: POST /api/roleplay-evaluate).
 */
export function mockRoleplayEvaluate(): Promise<RoleplayEvaluation> {
  return simulateDelay(
    {
      score: 85,
      tone: "Profesional, cortés y conforme a las directrices de Noa Motors.",
      compliance: "Totalmente Conforme",
      strengths: [
        "Excelente empatía con el cliente al validar sus temores sobre la autonomía del vehículo eléctrico.",
        "Explicación clara del funcionamiento y ventajas financieras del programa Noa Way."
      ],
      weaknesses: [
        "Se pudo haber detallado un poco más que el desgaste de pastillas de freno es un consumible exento de garantía estándar."
      ],
      coaching: "¡Buen trabajo! Has mantenido un tono impecable. Para la próxima, recuerda mencionar que el mantenimiento preventivo Noa Care evita cualquier tipo de sorpresa con piezas de desgaste."
    },
    1800 + Math.random() * 800
  );
}

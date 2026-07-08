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
    title: title || "New Vehicle Onboarding",
    category: category || "Vehicle Knowledge",
    modules: [
      {
        id: "m1",
        title: "Introduction and Fundamentals",
        description: "Understanding the primary product details and core values.",
        lessons: [
          {
            id: "l1",
            title: "Core Mechanics & Key USP",
            content: "This lesson details the primary specifications of our flagship line. Dealership employees must memorize the powertrain, infotainment, and core warranty aspects to present to clients. Highlighting the balance of efficiency and electric range is key to answering early client inquiries.",
            quiz: {
              question: "What is the primary selling point of the vehicle's updated powertrain?",
              options: ["Class-leading fuel efficiency & hybrid battery performance", "Basic mechanical steering option", "Classic legacy styling only"],
              correctOptionIndex: 0
            }
          },
          {
            id: "l2",
            title: "Customer Persona Profiling",
            content: "Identify what the family/executive buyer values: safety ratings, interior space, resale value. When dealing with luxury buyers, prioritize concierge service benefits, extended warranties, and premium cabin technology. Standard buyers will appreciate cost of ownership analysis.",
            quiz: {
              question: "Which feature should you highlight first for family-oriented buyers?",
              options: ["Maximum speed benchmark", "Cargo capacity and standard active safety suites", "Custom alloy wheels options"],
              correctOptionIndex: 1
            }
          }
        ]
      },
      {
        id: "m2",
        title: "Sales Tactics & Delivery Process",
        description: "Overcoming standard objections and executing the final delivery checklist.",
        lessons: [
          {
            id: "l3",
            title: "Handling Financing Objections",
            content: "Discussing APR, lease versus loan advantages, and presentation of protection packages like extended warranty or tire/wheel care. Frame financing as a monthly budget builder rather than a total debt number to ease tension.",
            quiz: {
              question: "What is the best response when a buyer objects to standard interest rates?",
              options: ["Dismiss the objection or tell them rates are fixed", "Present promotional low-APR financing or lease trade-in comparisons", "Tell them to try another financing bank individually"],
              correctOptionIndex: 1
            }
          },
          {
            id: "l4",
            title: "The Ultimate Vehicle Delivery Checklist",
            content: "Pairing the client's phone via Bluetooth, setting up standard dealership application/subscription services, showing driver assistance toggles, and introducing the client to the service department manager before departure.",
            quiz: {
              question: "Why should you introduce the customer to the service manager before they drive off?",
              options: ["To secure high retention and build trust in future maintenance visits", "To make the final checkout paperwork take longer", "It is an optional social step with no business impact"],
              correctOptionIndex: 0
            }
          }
        ]
      },
      {
        id: "m3",
        title: "Aftersales & Care Retention",
        description: "Nurturing relationships and driving service bay returns.",
        lessons: [
          {
            id: "l5",
            title: "Scheduling the First Service Visit",
            content: "Automotive dealerships build lifetime profits in the service bay. Set expectations for the 5,000-mile or 6-month checkup. Highlight complimentary maintenance packages.",
            quiz: {
              question: "When should the customer schedule their first service checkup?",
              options: ["Only when an emergency or warning light appears", "At 5,000 miles or 6 months for inspection and fluid care", "After the warranty period expires completely"],
              correctOptionIndex: 1
            }
          },
          {
            id: "l6",
            title: "Securing 5-Star CSIs (Customer Satisfaction Index)",
            content: "A perfect CSI score is mandatory for dealership rewards. Explain the survey scale to the buyer clearly, ask if there were any unresolved concerns, and secure commitment to excellent feedback.",
            quiz: {
              question: "What is the correct way to request high CSI ratings from buyers?",
              options: ["Beg them or offer cash bribes directly", "Explain the survey's importance, ask if they have any doubts, and resolve them before delivery", "Do not mention the survey at all"],
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

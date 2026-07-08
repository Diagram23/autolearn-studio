import { Course, Employee, Activity } from "./types";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Inducción al Noa EV9 Horizon SUV",
    category: "Vehicle Knowledge",
    status: "Published",
    assignedRoles: ["Sales Advisor", "Service Advisor"],
    completionRate: 88,
    enrolledEmployees: 18,
    createdBy: "Sara Pineda (Directora de Formación)",
    createdAt: "2026-05-12",
    description: "Detalles completos de producto del nuevo SUV insignia 100% eléctrico de Noa Motors. Autonomía, carga rápida de 800V y asistentes de conducción de última generación.",
    modules: [
      {
        id: "m1",
        title: "Arquitectura de la Batería y Especificaciones Eléctricas",
        description: "Comprensión de los datos técnicos de la batería, métricas de autonomía y tecnologías de refrigeración.",
        lessons: [
          {
            id: "l1",
            title: "Configuración de Celdas y Autonomía de Viaje",
            content: "El Noa EV9 Horizon implementa un inversor de carburo de silicio de 800V junto con un paquete de baterías de iones de litio de níquel-manganeso-cobalto de 100 kWh. Ofrece una autonomía certificada de 520 km en ciclo WLTP. El argumento clave para el cliente es que recupera del 10% al 80% de carga en exactamente 18 minutos usando un cargador rápido de 350 kW en corriente continua (DC). Recuerde que el preacondicionamiento en climas fríos preserva la autonomía cuando la ruta se introduce en el navegador nativo del vehículo.",
            quiz: {
              question: "¿Cuál es la autonomía homologada WLTP y el tiempo de carga del 10% al 80%?",
              options: [
                "520 km de autonomía / 18 minutos con cargador rápido de 350 kW",
                "300 km de autonomía / 45 minutos con cargador doméstico de 50 kW",
                "700 km de autonomía / 5 minutos usando un enchufe convencional"
              ],
              correctOptionIndex: 0
            }
          },
          {
            id: "l2",
            title: "Sistemas Dinámicos de Frenado Regenerativo",
            content: "Explique al cliente el funcionamiento de las levas tras el volante que configuran los cuatro niveles de regeneración: Nivel 0 (Inercia total), Nivel 1 (Frenada suave), Nivel 2 (Frenada moderada) y One-Pedal Drive. Este último aplica hasta 0.25g de fuerza de desaceleración al levantar el pie, recuperando energía cinética directamente para incrementar la autonomía urbana en hasta un 15%. Resalte este beneficio en trayectos diarios de ciudad.",
            quiz: {
              question: "¿Cuánto puede incrementar la autonomía urbana el modo de conducción de pedal único (One-Pedal Drive)?",
              options: [
                "Aproximadamente un 5%",
                "Hasta un 15% gracias a la retención cinética en tráfico urbano",
                "Reduce la autonomía general a cambio de mayor empuje inicial"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      },
      {
        id: "m2",
        title: "Tecnología y Seguridad Activa Inteligente",
        description: "Estudio detallado del hardware de radares, cámaras HD y sistemas inteligentes de guiado asistido.",
        lessons: [
          {
            id: "l3",
            title: "Asistente de Conducción Noa Active Pilot 2.5",
            content: "El Noa EV9 Horizon equipa 6 cámaras de alta definición, 5 radares de largo alcance y 12 sensores ultrasónicos que coordinan una conducción semiautónoma de Nivel 2. Explique de forma clara y tranquila que el vehículo gestiona el control de crucero adaptativo inteligente en atascos, el mantenimiento activo de carril y los adelantamientos automáticos en autovía simplemente pulsando el intermitente lateral.",
            quiz: {
              question: "¿Qué sensores coordinan el paquete de seguridad Noa Active Pilot 2.5?",
              options: [
                "Únicamente la cámara estándar de visión de marcha atrás",
                "6 cámaras HD, 5 sensores de radar y 12 sensores ultrasónicos de proximidad",
                "Localización GPS básica sin necesidad de sensores externos"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Superación de Objeciones sobre Precios y Tasas",
    category: "Sales",
    status: "Published",
    assignedRoles: ["Sales Advisor"],
    completionRate: 74,
    enrolledEmployees: 14,
    createdBy: "Mario Valenzuela (Director General de Ventas)",
    createdAt: "2026-06-01",
    description: "Una guía comercial detallada para afrontar las reticencias de los clientes relativas a las tasas de interés (TAE), tasaciones de intercambio de vehículos y el valor del pago de entrada.",
    modules: [
      {
        id: "m1",
        title: "El Concepto del Coste de Esperar",
        description: "Cómo cambiar la perspectiva del cliente de las tasas mensuales brutas al coste de oportunidad de no adquirir el vehículo ahora.",
        lessons: [
          {
            id: "l1",
            title: "Reencuadrar el Tipo de Interés en Coste Diario",
            content: "Cuando un cliente muestre dudas sobre una tasa de interés comercial, no debata sobre la situación económica general. En su lugar, divida la diferencia de intereses del préstamo en coste equivalente al día. Compare un renting o arrendamiento promocional Noa Way frente a un préstamo tradicional, demostrando que la seguridad de recompra garantizada a los 36 meses minimiza cualquier riesgo patrimonial.",
            quiz: {
              question: "¿Cuál es el objetivo principal de reencuadrar el tipo de interés en costes diarios?",
              options: [
                "Discutir con el cliente la política monetaria de los bancos centrales",
                "Reducir la carga psicológica de la tasa mostrándola como un coste diario muy bajo",
                "Ofrecer descuentos masivos sin autorización del gerente de ventas"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Protocolo de Bienvenida y Demostración de 6 Puntos",
    category: "Customer Service",
    status: "Published",
    assignedRoles: ["Sales Advisor", "Service Advisor"],
    completionRate: 92,
    enrolledEmployees: 22,
    createdBy: "Mario Valenzuela (Director General de Ventas)",
    createdAt: "2026-06-15",
    description: "Formación interactiva sobre conducta en la exposición de Noa Motors, guiones de saludo cordial y ejecución detallada de la demostración estática del vehículo en 6 puntos estratégicos.",
    modules: [
      {
        id: "m1",
        title: "Primeros 10 Segundos y Construcción de Confianza",
        description: "Protocolo lingüístico de baja fricción para abrir un diálogo natural con clientes en sala.",
        lessons: [
          {
            id: "l1",
            title: "La Recepción Cálida y Profesional",
            content: "Nunca inicie la conversación preguntando: '¿Tiene pensado comprar hoy?'. Salude cordialmente con el protocolo corporativo: 'Bienvenido a Noa Motors, mi nombre es [Nombre]. ¿Le apetecería conocer nuestra gama de vehículos híbridos y eléctricos o venía a realizar alguna consulta con nuestro servicio de posventa?'. Esto reduce drásticamente la tensión inicial del cliente y abre un diálogo natural.",
            quiz: {
              question: "¿Cuál es el saludo de bienvenida recomendado para los visitantes de la exposición?",
              options: [
                "¿De cuánto es la cuota mensual máxima que se puede permitir?",
                "'Bienvenido a Noa Motors, ¿desea conocer la gama de vehículos híbridos/eléctricos o venía a realizar alguna consulta con nuestro servicio de posventa?'",
                "Mantener el silencio absoluto y dejar que el cliente camine solo sin interactuar"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "Presentación de Métodos de Pago y Financiación",
    category: "Financing",
    status: "Review",
    assignedRoles: ["Sales Advisor"],
    completionRate: 0,
    enrolledEmployees: 8,
    createdBy: "Sara Pineda (Directora de Formación)",
    createdAt: "2026-06-28",
    description: "Dominio de la oferta comercial de Noa Motors: modalidades Noa Way, Noa Credit, seguros de amortización y productos de protección de inversión.",
    modules: [
      {
        id: "m1",
        title: "Estructuración del Menú de Opciones F&I",
        description: "Presentar las modalidades financieras de forma clara para que el cliente comprenda las ventajas fiscales y de cuota.",
        lessons: [
          {
            id: "l1",
            title: "Contratos de Protección y Servicios Noa Way",
            content: "Presente siempre las opciones financieras como bloques modulares de protección del activo. Divida la oferta en Platino (Financiación Noa Way + Seguro a todo riesgo + Mantenimiento total), Oro (Financiación + Garantía extendida + GAP) y Esencial. Explique con calma que los modernos componentes de infoentretenimiento y software requieren un mantenimiento garantizado para proteger el valor residual del coche.",
            quiz: {
              question: "¿Cómo deben explicarse las ventajas de las coberturas extendidas y financiación?",
              options: [
                "Resaltando que protegen la inversión del cliente ante costes de tecnología futuros y garantizan un valor de recompra seguro",
                "Indicando que el vehículo es propenso a fallar nada más salir de las instalaciones",
                "Diciendo que todas las reparaciones serán gratuitas de por vida sin necesidad de contratar nada adicional"
              ],
              correctOptionIndex: 0
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-5",
    title: "Protocolos de Seguridad de Alto Voltaje en Taller",
    category: "Workshop",
    status: "Published",
    assignedRoles: ["Workshop Employee"],
    completionRate: 95,
    enrolledEmployees: 12,
    createdBy: "Carlos Herranz (Director de Posventa)",
    createdAt: "2026-04-10",
    description: "Instrucciones de seguridad críticas obligatorias para mecánicos y electricistas de taller sobre el manejo de cableado de alta tensión, uso de EPP aislante y descarga segura.",
    modules: [
      {
        id: "m1",
        title: "Aislamiento Eléctrico y Equipos de Protección",
        description: "Procedimientos de seguridad exhaustivos aplicados a sistemas eléctricos de propulsión de alta tensión.",
        lessons: [
          {
            id: "l1",
            title: "El Estándar del Cableado Naranja Noa",
            content: "Cada bucle de alta tensión en los vehículos eléctricos de Noa Motors va enfundado en un tubo corrugado de color naranja intenso. NUNCA manipule ni desconecte un cable naranja sin antes apagar el encendido, guardar la llave inteligente en la caja de seguridad a un mínimo de 15 metros, y retirar el conector amarillo de desconexión manual de servicio bajo el asiento trasero. Verifique siempre con un multímetro aislado que la tensión marca exactamente 0V.",
            quiz: {
              question: "¿Qué protocolo debe seguirse antes de realizar reparaciones en el cableado naranja de alta tensión?",
              options: [
                "Desconectar los bornes de la batería auxiliar con unos alicates metálicos convencionales",
                "Apagar contacto, alejar la llave 15 metros, retirar la desconexión manual de servicio y medir 0V con un multímetro de categoría III/IV aislado",
                "Trabajar con guantes domésticos de goma fina mientras el motor térmico está en ralentí"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-6",
    title: "Políticas de Garantías y Coberturas Noa Motors",
    category: "Warranty",
    status: "Draft",
    assignedRoles: ["Service Advisor", "Workshop Employee"],
    completionRate: 0,
    enrolledEmployees: 0,
    createdBy: "Sara Pineda (Directora de Formación)",
    createdAt: "2026-07-02",
    description: "Comprensión precisa de los límites, plazos de cobertura de la garantía Noa 7-Estrellas, y distinción del desgaste por uso común frente a fallos mecánicos.",
    modules: [
      {
        id: "m1",
        title: "Límites de la Cobertura Noa 7-Estrellas",
        description: "Análisis técnico de los componentes mecánicos, eléctricos e informáticos cubiertos de fábrica frente a exclusiones de desgaste.",
        lessons: [
          {
            id: "l1",
            title: "Exclusiones de Desgaste frente a Defectos Mecánicos",
            content: "Un error habitual en la recepción de taller es admitir elementos de desgaste como fallos de garantía. Pastillas y discos de freno, neumáticos, bujías, filtros, escobillas limpiaparabrisas y fluidos de motor son elementos estrictamente consumibles de desgaste. Solo se cubrirán si el cliente tiene contratado el plan Premium de Mantenimiento de Noa Motors. Los fallos mecánicos internos (ej. caja de cambios, culata o electrónica de infoentretenimiento) sí están cubiertos de serie.",
            quiz: {
              question: "¿Cuál de estos elementos sí está cubierto de forma estándar ante fallos de fabricación?",
              options: [
                "Escobillas de limpiaparabrisas y neumáticos",
                "Rotura interna del convertidor de par de la transmisión o fallos del calculador",
                "Pastillas de freno desgastadas tras realizar 25.000 km de uso común"
              ],
              correctOptionIndex: 1
            }
          }
        ]
      }
    ]
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Alejandro Rivera",
    role: "Sales Advisor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    completedCourses: 3,
    ongoingCourses: 2,
    averageQuizScore: 94,
    atRisk: false,
    department: "Sales"
  },
  {
    id: "emp-2",
    name: "Juan Herrera",
    role: "Sales Advisor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    completedCourses: 2,
    ongoingCourses: 3,
    averageQuizScore: 68,
    atRisk: true,
    department: "Sales"
  },
  {
    id: "emp-3",
    name: "David Cruz",
    role: "Workshop Employee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    completedCourses: 4,
    ongoingCourses: 1,
    averageQuizScore: 96,
    atRisk: false,
    department: "Workshop"
  },
  {
    id: "emp-4",
    name: "Clara Peterson",
    role: "Service Advisor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    completedCourses: 2,
    ongoingCourses: 1,
    averageQuizScore: 82,
    atRisk: false,
    department: "Service lane"
  },
  {
    id: "emp-5",
    name: "Ramón Gallego",
    role: "Workshop Employee",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    completedCourses: 1,
    ongoingCourses: 2,
    averageQuizScore: 59,
    atRisk: true,
    department: "Workshop"
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    employeeName: "Alejandro Rivera",
    employeeRole: "Asesor de Ventas",
    action: "Completó Evaluación: Configuración de Celdas y Autonomía",
    courseTitle: "Inducción al Noa EV9 Horizon SUV",
    timestamp: "Hace 10 minutos",
    status: "success"
  },
  {
    id: "act-2",
    employeeName: "Juan Herrera",
    employeeRole: "Asesor de Ventas",
    action: "Falló Evaluación: Concepto de Coste de Esperar (Intento 1)",
    courseTitle: "Superación de Objeciones sobre Precios y Tasas",
    timestamp: "Hace 45 minutos",
    status: "alert"
  },
  {
    id: "act-3",
    employeeName: "David Cruz",
    employeeRole: "Operario de Taller",
    action: "Completó Curso: Protocolos de Seguridad de Alto Voltaje en Taller",
    courseTitle: "Protocolos de Seguridad de Alto Voltaje en Taller",
    timestamp: "Hace 2 horas",
    status: "success"
  },
  {
    id: "act-4",
    employeeName: "Clara Peterson",
    employeeRole: "Asesora de Servicio",
    action: "Inició Curso: Protocolo de Bienvenida y Demostración",
    courseTitle: "Protocolo de Bienvenida y Demostración de 6 Puntos",
    timestamp: "Hace 4 horas",
    status: "pending"
  }
];

export const CATEGORIES_LIST = [
  "Sales",
  "Customer Service",
  "Vehicle Knowledge",
  "Financing",
  "Warranty",
  "Workshop"
];

export const DEPARTMENTS = ["Sales", "Service lane", "Workshop"];
export const ROLES_LIST = ["Sales Advisor", "Service Advisor", "Workshop Employee"];
export const ROLES_ALL = ["Training Manager", ...ROLES_LIST];

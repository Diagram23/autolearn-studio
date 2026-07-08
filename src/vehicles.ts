export interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: string;
  engine: string;
  rangeOrEfficiency: string;
  batteryOrFuel: string;
  image: string;
  keySellingPoints: string[];
  salesObjectionGuide: string;
  warrantyInfo: string;
}

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "veh-1",
    name: "Noa EV9 Horizon",
    type: "SUV Premium 100% Eléctrico",
    price: "desde 64.900 €",
    engine: "Dual Motor AWD (384 CV)",
    rangeOrEfficiency: "520 km de Autonomía (WLTP)",
    batteryOrFuel: "Batería de 100 kWh (800V DC)",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    keySellingPoints: [
      "Arquitectura de 800V que permite recargar del 10% al 80% en solo 18 minutos.",
      "Habitáculo modular con 3 filas de asientos revestidos en eco-cuero premium.",
      "Asistente de Conducción Active Pilot 2.5 integrado de serie."
    ],
    salesObjectionGuide: "Si el cliente teme por los tiempos de viaje largo, demuéstrele que planificando la ruta en el navegador, la batería se pre-acondiciona automáticamente para cargar a máxima potencia, recuperando 350 km en lo que dura un café.",
    warrantyInfo: "Garantía de Batería Noa de 8 años o 160.000 km, asegurando un mínimo del 75% de estado de salud (SOH)."
  },
  {
    id: "veh-2",
    name: "Noa Nexus Hybrid",
    type: "Sedán Ejecutivo Autorrecargable (MHEV)",
    price: "desde 39.500 €",
    engine: "2.0L Ciclo Atkinson + Motor Eléctrico (197 CV)",
    rangeOrEfficiency: "Consumo medio de 3.8 L/100 km",
    batteryOrFuel: "Autocargable con frenada regenerativa avanzada",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    keySellingPoints: [
      "Etiqueta ECO de la DGT para acceso libre e ilimitado a zonas de bajas emisiones.",
      "Cambio automático e-CVT inteligente optimizado para un confort de marcha sedoso.",
      "Cuadro de mandos digital envolvente con doble pantalla de 12.3 pulgadas."
    ],
    salesObjectionGuide: "Para clientes escépticos de los eléctricos enchufables: Nexus ofrece el refinamiento y ahorro del motor eléctrico pero sin cables, ideal para viajes largos sin depender de cargadores.",
    warrantyInfo: "Garantía Noa 7-Estrellas de 7 años o 150.000 km en todo el tren motriz híbrido."
  },
  {
    id: "veh-3",
    name: "Noa Volt Track",
    type: "Crossover Deportivo Eléctrico",
    price: "desde 48.900 €",
    engine: "Dual Motor Sport AWD (490 CV) - 0 a 100 km/h en 3.7s",
    rangeOrEfficiency: "480 km de Autonomía (WLTP)",
    batteryOrFuel: "Batería de estado semisólido de 84 kWh",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    keySellingPoints: [
      "Aceleración vertiginosa y chasis deportivo afinado en circuito.",
      "Suspensión neumática activa que se adapta a las condiciones del asfalto en milisegundos.",
      "Techo solar panorámico con cristal electrocrómico regulable en opacidad."
    ],
    salesObjectionGuide: "Frente a objeciones sobre deportividad o tacto de pedal: configure el modo Sport Plus durante la prueba y deje que sientan el empuje inmediato del par eléctrico junto con los amortiguadores adaptativos.",
    warrantyInfo: "Garantía Noa 7-Estrellas de 7 años o 150.000 km, incluyendo piezas mecánicas sometidas a alto rendimiento deportivo."
  },
  {
    id: "veh-4",
    name: "Noa Urban Eco",
    type: "Utilitario Eléctrico Urbano",
    price: "desde 24.900 €",
    engine: "Single Motor Delantero (136 CV)",
    rangeOrEfficiency: "310 km de Autonomía Urbana (WLTP)",
    batteryOrFuel: "Batería de fosfato de hierro y litio (LFP) de 42 kWh",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    keySellingPoints: [
      "Excelente radio de giro, ideal para calles estrechas y maniobras rápidas.",
      "Carga completa en toma doméstica en menos de 4 horas mediante cargador integrado de 11 kW.",
      "Pantalla táctil flotante compatible con Apple CarPlay y Android Auto inalámbrico."
    ],
    salesObjectionGuide: "La objeción típica es el precio de compra respecto a un térmico. Demuéstrele al cliente que amortizará la diferencia en menos de 24 meses gracias al nulo gasto de mantenimiento y el ínfimo coste de electricidad nocturna.",
    warrantyInfo: "Batería LFP garantizada por 8 años o 150.000 km, con química altamente estable y segura de más de 3000 ciclos de recarga completa."
  }
];

/**
 * NOTA: este servidor Express NO forma parte del build ni del deploy actual.
 * AutoLearn Studio se migró a un modelo 100% cliente (ver src/lib/mockAI.ts):
 * `npm run build` genera un sitio estático puro, sin backend.
 *
 * Este archivo se conserva solo como referencia de la integración real con
 * Gemini (@google/genai), por si en el futuro se quiere conectar un backend
 * de verdad. No se ejecuta en producción ni se importa desde el frontend.
 */
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API route for generating courses using Gemini API
  app.post("/api/generate-course", async (req, res) => {
    try {
      const { title, category, materials, tone, uploadedFile } = req.body;

      if (!ai) {
        console.warn("GEMINI_API_KEY is not defined. Falling back to mockup generator.");
        return res.json(generateMockupCourse(title, category));
      }

      const prompt = `You are an expert training curriculum designer for a premium car dealership called Noa Motors.
We need to generate a highly professional, enterprise-grade 3-module training course based on the provided material (could be the attached multi-modal file, or the manual notes, or both).

Course Title: ${title}
Category: ${category}
Tone/Style: ${tone || "Professional and highly detailed"}

Manual Dealership Materials:
${materials || "None provided manually. Please analyze the attached document or image to build the entire course."}

Please output a structured JSON response with exactly 3 training modules. Each module must contain:
- id (e.g., "m1", "m2", "m3")
- title
- description
- lessons (an array of exactly 2 lessons, each with id, title, content (detailed training text or script, at least 150 words per lesson, well-structured with sections, key bullet points, and practical advice), and a quick quiz question with a question, array of exactly 3 options, and correctOptionIndex).

Please return only raw JSON strictly matching this structure:
{
  "title": "${title}",
  "category": "${category}",
  "modules": [
    {
      "id": "m1",
      "title": "Module 1 Title",
      "description": "Module 1 Description",
      "lessons": [
        {
          "id": "l1",
          "title": "Lesson 1 Title",
          "content": "Detailed training content with sales strategies, specific car mechanisms, warranty terms or techniques...",
          "quiz": {
            "question": "Quiz question about the content?",
            "options": ["Option A", "Option B", "Option C"],
            "correctOptionIndex": 0
          }
        }
      ]
    }
  ]
}`;

      // Build contents array for multimodal Gemini API call
      let contents: any[] = [];
      if (uploadedFile && uploadedFile.base64 && uploadedFile.mimeType) {
        contents.push({
          inlineData: {
            data: uploadedFile.base64,
            mimeType: uploadedFile.mimeType
          }
        });
      }
      contents.push(prompt);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    lessons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          content: { type: Type.STRING },
                          quiz: {
                            type: Type.OBJECT,
                            properties: {
                              question: { type: Type.STRING },
                              options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                              },
                              correctOptionIndex: { type: Type.INTEGER }
                            },
                            required: ["question", "options", "correctOptionIndex"]
                          }
                        },
                        required: ["id", "title", "content", "quiz"]
                      }
                    }
                  },
                  required: ["id", "title", "description", "lessons"]
                }
              }
            },
            required: ["title", "category", "modules"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content from Gemini.");
      }

      const generatedData = JSON.parse(responseText.trim());
      res.json(generatedData);
    } catch (error: any) {
      console.error("Gemini course generation error:", error);
      res.status(500).json({
        error: "Failed to generate course",
        message: error.message || String(error)
      });
    }
  });

  // API route for Interactive AI Roleplay Client responses
  app.post("/api/roleplay", async (req, res) => {
    try {
      const { customerProfile, vehicleName, history } = req.body;

      if (!ai) {
        // Fallback mockup responses for roleplay when API key is not present
        console.warn("GEMINI_API_KEY is not defined. Falling back to mockup roleplay.");
        const mockResponses = [
          "Entiendo lo que dice sobre la autonomía, pero sigo pensando que para hacer viajes largos de 500km me va a dar ansiedad quedarme sin batería en medio de la autovía.",
          "Pero, ¿qué pasa si la batería se degrada a los 3 años? He oído que cambiar una batería de tracción de 800V cuesta casi tanto como un coche nuevo.",
          "Esa opción del Noa Way suena interesante, pero ¿qué interés TAE tiene la cuota y qué pasa si supero el kilometraje de 15.000 km al año?",
          "Entiendo, pero si los discos de freno se desgastan prematuramente a los 10.000 km, ¿de verdad Noa Motors no lo cubrirá en la Garantía 7-Estrellas?"
        ];
        // Select a reply based on history length
        const replyIndex = Math.min(Math.floor((history || []).length / 2), mockResponses.length - 1);
        return res.json({ reply: mockResponses[replyIndex] });
      }

      const formattedHistory = history.map((h: any) => `${h.role === "user" ? "Asesor" : "Cliente"}: ${h.text}`).join("\n");

      const prompt = `Estás jugando el rol de un cliente en un concesionario oficial de Noa Motors.
Perfil del Cliente:
${customerProfile}

Vehículo o Servicio que están discutiendo:
${vehicleName}

Historial de la conversación:
${formattedHistory}

Por favor, responde al último mensaje del Asesor manteniendo de forma estricta tu personaje, dudas y objeciones realistas.
Sé un poco exigente o escéptico (sobre autonomía, precio, renting o coberturas) pero razonable.
Escribe una respuesta corta y natural de chat (máximo 2 o 3 frases). No te salgas de tu personaje. No agregues formatos complejos ni notas de IA.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ reply: response.text ? response.text.trim() : "..." });
    } catch (error: any) {
      console.error("Gemini roleplay error:", error);
      res.status(500).json({ error: "Failed to process roleplay step" });
    }
  });

  // API route for Interactive AI Roleplay Performance Evaluation
  app.post("/api/roleplay-evaluate", async (req, res) => {
    try {
      const { customerProfile, vehicleName, history } = req.body;

      if (!ai) {
        console.warn("GEMINI_API_KEY is not defined. Falling back to mockup evaluation.");
        return res.json({
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
        });
      }

      const formattedHistory = history.map((h: any) => `${h.role === "user" ? "Asesor" : "Cliente"}: ${h.text}`).join("\n");

      const prompt = `Analiza la siguiente conversación entre un asesor comercial/taller de Noa Motors y un cliente.
Determina su calidad de ventas, veracidad técnica, conformidad legal (especificaciones WLTP, transparencia en financiación F&I y exclusiones de garantía de desgaste).

Perfil del Cliente:
${customerProfile}

Vehículo o Servicio en discusión:
${vehicleName}

Historial de la conversación:
${formattedHistory}

Por favor, proporciona una evaluación estricta, profesional y de alto nivel corporativo.
Debes devolver un formato JSON estricto con los siguientes campos:
- score (número entero de 0 a 100)
- tone (descripción corta del tono del asesor)
- compliance (estado de conformidad legal/marca, ej. "Totalmente Conforme" o "No Conforme por Datos Técnicos Incorrectos")
- strengths (array de strings, máximo 3 puntos fuertes)
- weaknesses (array de strings, máximo 3 puntos débiles o de mejora)
- coaching (consejo detallado de entrenamiento y mentoría para el asesor)

Escribe solo el objeto JSON sin marcas de código markdown, o si pones markdown, que empiece con { y termine con } estrictamente.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              tone: { type: Type.STRING },
              compliance: { type: Type.STRING },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              coaching: { type: Type.STRING }
            },
            required: ["score", "tone", "compliance", "strengths", "weaknesses", "coaching"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text from evaluation.");
      }

      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Gemini evaluation error:", error);
      res.status(500).json({ error: "Failed to evaluate roleplay" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function generateMockupCourse(title: string, category: string) {
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

startServer();

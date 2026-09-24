import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, tone, audience, schoolName, details } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Le sujet de l'annonce est requis." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback clean template if no API key configured
      const fallbackTitle = `Note d'information : ${topic}`;
      const fallbackBody = `Chers parents d'élèves,\n\nNous vous informons par la présente de ce qui suit concernant ${topic}.\n${details ? `\nPrécisions : ${details}\n` : ""}\nL'établissement ${schoolName || "ÉcoleConnect"} reste à votre disposition pour toute précision complémentaire.\n\nCordialement,\nLa Direction et l'équipe pédagogique.`;
      const fallbackSms = `[${schoolName || "ECOLE"}] Info importante : ${topic}. Merci de consulter l'application ÉcoleConnect.`;
      
      return NextResponse.json({
        title: fallbackTitle,
        content: fallbackBody,
        smsVersion: fallbackSms,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Tu es l'assistant de communication officiel d'un établissement scolaire en Afrique de l'Ouest (plateforme ÉcoleConnect).
Rédige une communication claire, bienveillante, professionnelle et compréhensible par tous les parents d'élèves.

Éléments fournis :
- Établissement : ${schoolName || "Groupe Scolaire Horizon"}
- Destinataires : ${audience || "Tous les parents d'élèves"}
- Sujet : ${topic}
- Ton souhaité : ${tone || "Professionnel et bienveillant"}
- Détails complémentaires : ${details || "Aucun"}

Réponds UNIQUEMENT sous forme d'un objet JSON strict avec 3 champs sans markdown ni balises de code :
{
  "title": "Titre percutant et concis (ex: Réunion trimestrielle des parents d'élèves)",
  "content": "Corps du message complet, structuré avec politesse, explications claires et formule de politesse finale.",
  "smsVersion": "Version ultra-concise (max 155 caractères) adaptée pour SMS ou message WhatsApp court avec le nom de l'école."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      // In case JSON parsing is slightly off, clean up markdown fences
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    }
  } catch (error: any) {
    console.error("Gemini announcement generation error:", error);
    return NextResponse.json(
      {
        title: `Communication officielle : Information scolaire`,
        content: `Chers parents d'élèves,\n\nNous vous prions de bien vouloir prendre note de cette communication officielle concernant l'organisation scolaire. Votre collaboration habituelle pour la réussite de nos élèves est vivement appréciée.\n\nLa Direction de l'établissement.`,
        smsVersion: `[Info École] Nouvelle annonce publiée. Merci de consulter l'application ÉcoleConnect.`,
      },
      { status: 200 }
    );
  }
}

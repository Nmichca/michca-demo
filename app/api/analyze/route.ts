import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  const { transcript, mode } = await req.json();
  if (!transcript?.trim()) return NextResponse.json({ error: "Transcript vide" }, { status: 400 });
  const prompts: Record<string, string> = {
    discovery: `Tu es un expert en analyse de discovery commerciale.\nAnalyse ce transcript de réunion client et extrais :\n\n1. **Problème principal** : quel est le pain point central ?\n2. **Contexte** : secteur, taille entreprise, maturité data/IA\n3. **Budget & Timing** : signaux détectés\n4. **Prochaine étape recommandée** : action concrète pour le consultant\n5. **Score d'opportunité** : /10 avec justification\n\nTranscript :\n${transcript}`,
    veille: `Tu es un analyste en intelligence stratégique.\nRésume les points clés de ce document sectoriel :\n\n1. **Tendances majeures** identifiées\n2. **Opportunités** pour un consultant Data/IA indépendant\n3. **Risques ou menaces** à surveiller\n4. **Actions recommandées** dans les 30 prochains jours\n\nDocument :\n${transcript}`,
  };
  const prompt = prompts[mode] ?? prompts.discovery;
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  const content = message.content[0];
  const text = content.type === "text" ? content.text : "";
  return NextResponse.json({ result: text });
}

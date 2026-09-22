import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { transcript, mode } = await req.json();

  if (!transcript?.trim()) {
    return NextResponse.json({ error: "Transcript vide" }, { status: 400 });
  }

  const prompts: Record<string, string> = {
    discovery: `Tu es un expert en analyse de discovery commerciale.
Analyse ce transcript de réunion client et extrais :

1. **Problème principal** : quel est le pain point central ?
2. **Contexte** : secteur, taille entreprise, maturité data/IA
3. **Budget & Timing** : signaux détectés
4. **Prochaine étape recommandée** : action concrète pour le consultant
5. **Score d'opportunité** : /10 avec justification

Transcript :
${transcript}`,
    veille: `Tu es un analyste en intelligence stratégique.
Résume les points clés de ce document sectoriel :

1. **Tendances majeures** identifiées
2. **Opportunités** pour un consultant Data/IA indépendant
3. **Risques ou menaces** à surveiller
4. **Actions recommandées** dans les 30 prochains jours

Document :
${transcript}`,
  };

  const prompt = prompts[mode] ?? prompts.discovery;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "Erreur de réponse";

  return NextResponse.json({ result: text });
}

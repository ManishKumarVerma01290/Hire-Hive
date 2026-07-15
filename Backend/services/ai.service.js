import OpenAI from "openai";

console.log("AI KEY =", process.env.AI_API_KEY);
console.log("BASE URL =", process.env.AI_BASE_URL);

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL,
});

export const analyzeResume = async (resumeText, skills = []) => {
  try {
    const prompt = `
You are an ATS Resume Reviewer.

Resume:
${resumeText}

Skills:
${skills.join(", ")}

Return ONLY valid JSON.

{
  "score":90,
  "analysis":"Your analysis here",
  "suggestedSkills":["Docker","AWS","Redis"]
}
`;

    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    let result = response.choices[0].message.content;

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
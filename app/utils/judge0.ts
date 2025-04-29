// lib/judge0.ts
import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"; // RapidAPI endpoint

const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Key": "3d1c4b2dfemsh47659d7069f3107p124e74jsn427db4f6a294", // <<<<< YOUR KEY
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

export async function executeCode(sourceCode: string, languageId: number) {
  try {
    // Step 1: Submit code
    const { data: submission } = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: sourceCode,
        language_id: languageId,
      },
      { headers }
    );

    // Step 2: Return result
    return submission;
  } catch (error) {
    console.error("Error executing code", error);
    throw error;
  }
}

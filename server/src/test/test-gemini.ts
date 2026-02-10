import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(`AIzaSyCPOZFPYU8qQWqA_BosToTnVI2aVKvn5Nc`);

async function test() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent("Say hello in one word");
  console.log(result.response.text());
}

test();

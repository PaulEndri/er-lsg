import { APIGatewayEvent } from "aws-lambda";
import Client from "./services/client.service";
import fetch from "node-fetch";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const call = async (action, value?) => {
  let base = `https://www.erlsg.net/.netlify/functions/handlePlayerQueue?action=${action}`;

  if (value) {
    base = `${base}&value=value`;
  }

  return await fetch(base, {});
};
export async function handler(event: APIGatewayEvent) {
  const { value, action = "names" } = event.queryStringParameters;

  const nextAction = action === "names" ? "numbers" : action === "numbers" ? "games" : null;
  try {
    const results = await Client.handleNext(value, action as any);
    const nextValue = action === "names" ? results : value;

    if (nextAction) {
      await call(nextAction, nextValue);
    }
  } catch (e) {
    console.warn(e);

    await call(action, value);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: "ok",
  };
}

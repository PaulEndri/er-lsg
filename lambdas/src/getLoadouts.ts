import { APIGatewayEvent } from "aws-lambda";
import mongoose from "mongoose";
import { SavedLoadout } from "./models/loadout.model";

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const generateResponse = (body, status) => {
  console.log("[Real response]", { body, status });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

export async function handler(event: APIGatewayEvent, context) {
  let { userId, loadoutId } = event.queryStringParameters;

  if (!loadoutId && !userId && !context.user) {
    return generateResponse({ message: "Id Must Be Specified" }, 400);
  } else if (!loadoutId && !userId) {
    userId = context.user.id;
  }

  try {
    const query = {
      id: loadoutId || undefined,
      userId: userId || undefined,
    };

    const mongoResults = await SavedLoadout.find(query, [], { lean: true });

    return generateResponse(mongoResults, 200);
  } catch (e) {
    console.warn(e);
    return generateResponse({ message: e.message }, 500);
  }
}

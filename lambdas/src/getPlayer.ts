import { APIGatewayEvent } from "aws-lambda";
import Redis from "./services/redis.service";
import mongoose from "mongoose";
import { Players } from "./models/player.model";

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const generateResponse = (body, status) => {
  console.log("[Real response]", { body, status });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
};

export async function handler(event: APIGatewayEvent) {
  const { name, id } = event.queryStringParameters;

  if (!name && !id) {
    return generateResponse({ message: "Player Name Must Be Specified" }, 400);
  }

  try {
    const results = await Players.findOne({ name }, [], {
      collation: {
        locale: "en",
        strength: 1,
      },
    });
    if (results) {
      return generateResponse(
        {
          data: results,
        },
        200
      );
    } else {
      await Redis.queuePlayer("names", name);
      return generateResponse(
        {
          message:
            "The player in question either doesn't exist, or not in our databases yet. It's most likely they're not in our database yet. In which case they've now been queued up and you should back shortly.",
        },
        404
      );
    }
  } catch (e) {
    console.warn(e);
    return generateResponse({ message: e.message }, 500);
  }
}

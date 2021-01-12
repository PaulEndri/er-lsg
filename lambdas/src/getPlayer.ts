import { APIGatewayEvent } from "aws-lambda";
import Client from "./services/client.service";
import Redis from "./services/redis.service";
import fetch from "node-fetch";
import { Players } from "./models/player.model";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const generateResponse = (body, status) => {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

export async function handler(event: APIGatewayEvent) {
  const { name, id } = event.queryStringParameters;

  if (!name && !id) {
    return generateResponse({ message: "Player Name Must Be Specified" }, 400);
  }

  try {
    const query = {
      name,
    };

    const mongoResults = await Players.findOne(query, null, {
      lean: true,
      collation: {
        locale: "en",
        strength: 2,
      },
    });

    if (mongoResults) {
      await fetch(`/.netlify/functions/handlePlayerName?name=${name}`, {});

      return generateResponse(mongoResults, 200);
    } else {
      const results = await Client.getPlayer(name);

      if (results) {
        return generateResponse(results, 200);
      } else {
        await Redis.queuePlayer("names", name);
        await fetch(`/.netlify/functions/handlePlayerName?name=${name}`, {});

        return generateResponse(
          {
            message:
              "The player in question either doesn't exist, or not in our databases yet. It's most likely they're not in our database yet. In which case they've now been queued up and you should back shortly.",
          },
          404
        );
      }
    }
  } catch (e) {
    console.warn(e);
    return generateResponse({ message: e.message }, 500);
  }
}

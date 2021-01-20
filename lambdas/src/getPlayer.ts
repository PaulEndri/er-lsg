import { APIGatewayEvent } from "aws-lambda";
import Redis from "./services/redis.service";
import mongoose from "mongoose";
import { Player } from "./models/sql.models";

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
    const results = await Player.query()
      .withGraphFetched("[games, seasonRecords, seasonRecords.characterStats]")
      .findOne("name", "like", name);

    if (results) {
      await Redis.queuePlayer("numbers", results.id);
      const basicObject = results.toJSON();
      const seasonRecords = {};
      basicObject?.seasonRecords?.map((record) => {
        if (seasonRecords[record?.seasonId]) {
          seasonRecords[record.seasonId].info.push(record);
        } else {
          seasonRecords[record?.seasonId] = {
            season: record?.seasonId,
            info: [record],
          };
        }
      });
      return generateResponse(
        {
          ...basicObject,
          seasonRecords: Object.values(seasonRecords),
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

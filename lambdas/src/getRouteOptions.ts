import { APIGatewayEvent } from "aws-lambda";
import mongoose from "mongoose";
import { NodeService } from "./services/node.service";
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

export async function handler(event: APIGatewayEvent) {
  try {
    const body = JSON.parse(event.body);
    const { loadout, startingLocation } = body;

    if (!loadout) {
      throw new Error("Loadout must be provided");
    }

    const service = new NodeService(loadout, startingLocation);

    const results = await service.getCompleteItems();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    };
  } catch (e) {
    console.warn(e);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        results: [],
        partial: false,
        message: `Error: ${e.message}`,
      }),
    };
  }
}

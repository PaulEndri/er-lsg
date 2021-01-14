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

export async function handler(event: APIGatewayEvent, context: any) {
  try {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const body = JSON.parse(event.body);
    if (!body.name || !body.userId) {
      throw new Error("User ID or Loadout Name are missing");
    }

    if (context.user.id !== body.userId) {
      throw new Error("Unauthorized");
    }

    let data;
    if (body.id) {
      const existingLoadout = await SavedLoadout.find({ id: body.id });

      if (body.delete === true) {
        data = await existingLoadout.delete();
      } else {
        data = await existingLoadout.update(body);
      }
    } else {
      data = await SavedLoadout.create(body);
    }

    return generateResponse(data, 200);
  } catch (e) {
    console.warn(e);
    return generateResponse({ message: e.message }, 500);
  }
}

import { APIGatewayEvent } from "aws-lambda";
import { EquipmentRates } from "./models/sql.models";

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
  const { characterId } = event.queryStringParameters;

  if (characterId) {
    return generateResponse({ message: "Character Id Must Be Specified" }, 400);
  }

  try {
    const results = await EquipmentRates.query().where("characterNum", "=", +characterId);

    return generateResponse(results, 200);
  } catch (e) {
    console.warn(e);
    return generateResponse({ message: e.message }, 500);
  }
}

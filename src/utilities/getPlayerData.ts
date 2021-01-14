import { IPlayer } from "./player";

const BASE_URL = "/.netlify/functions/getPlayer?name=";

export const getPlayerData = async (
  name: string
): Promise<{ error: boolean; data: IPlayer; message?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}${name}`);
    const result = await response.json();

    if (result.message) {
      throw new Error(result.message);
    }

    return {
      error: false,
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      error: true,
      message: e.message,
      data: null,
    };
  }
};

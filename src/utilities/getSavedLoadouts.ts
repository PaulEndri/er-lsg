import { ISavedLoadout } from "./savedLoadout";

const BASE_URL = "/.netlify/functions/getLoadouts";

export const getSavedLoadout = async (
  userId?: string,
  loadoutId?: string
): Promise<{ error: boolean; data: ISavedLoadout[]; message?: string }> => {
  try {
    const url = BASE_URL + (loadoutId ? `?loadoutId=${loadoutId}` : `?userId=${userId}`);
    const response = await fetch(url);
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

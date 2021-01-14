import { ISavedLoadout } from "./savedLoadout";
const BASE_URL = "/.netlify/functions/saveLoadout";

export const saveUserLoadout = async (
  loadout: ISavedLoadout
): Promise<{ error: boolean; data: ISavedLoadout; message?: string }> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(loadout),
    });
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

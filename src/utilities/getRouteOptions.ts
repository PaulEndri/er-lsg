import { RouteNode } from "erbs-sdk";

const BASE_URL = "/.netlify/functions/getRouteOptions";

export const getRouteOptions = async (
  data: Record<string, number>,
  startingLocation?: number
): Promise<{
  results: { root: RouteNode; routes: RouteNode[] };
  message?: string;
}> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify({
        loadout: data,
        startingLocation,
      }),
    });
    const result = await response.json();

    return result;
  } catch (e) {
    console.error(e);
    return {
      message: e.message,
      results: null,
    };
  }
};

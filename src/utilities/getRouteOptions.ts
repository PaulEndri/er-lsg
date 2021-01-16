import { RouteNode } from "erbs-sdk";

const BASE_URL = "/.netlify/functions/getRouteOptions";

export const getRouteOptions = async (
  data: Record<string, number>,
  startingLocation?: number
): Promise<{
  partial: boolean;
  data: { root: RouteNode; routes: RouteNode[] };
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
      partial: true,
      message: e.message,
      data: null,
    };
  }
};

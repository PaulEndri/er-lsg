import Client from "./client.service";
import { Players } from "../models/player.model";

const PlayerService = {
  getPlayer: async (name: string) => {
    const results = await Players.findOne(
      {
        name,
      },
      [],
      {
        lean: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );

    // huzzah we found a player, we can be done here;
    if (results) {
      return {
        message: "found",
        data: results,
      };
    } else {
      const searchedResults = await Client.getPlayer(name);

      if (searchedResults) {
        return {
          message: "found",
          data: searchedResults,
        };
      }
      return {
        message: "not found",
        data: "User Does Not Exist Yet",
      };
    }
  },
};

export default PlayerService;

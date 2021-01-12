import { ErBsClient } from "erbs-client";
import { IPlayer } from "../types/player";
import { Players } from "../models/player.model";
import Redis from "./redis.service";
import { QueueTypes } from "../types/queueTypes";

class ClientService {
  private client = new ErBsClient();

  async handleNext(value, process: keyof typeof QueueTypes) {
    const count = process === "numbers" ? 2 : 1;
    let res;
    try {
      console.log(`[Handling] val:${value} proc:${process}`);
      await Redis.updateRateLimit(-count);

      switch (process) {
        case "numbers":
          res = await this.processPlayerNumber(+value, true);
          break;
        case "games":
          res = await this.processPlayerGames(+value, true);
        case "names":
          res = await this.processPlayerName(value, true);
          break;
        default:
          throw new Error("Invalid process");
      }

      console.log(`[Processed] ${value}`);
    } catch (e) {
      console.warn(e);
    } finally {
      await Redis.updateRateLimit(count);
    }

    return res;
  }

  public async getPlayer(name: string) {
    const callsLeft = await Redis.getRateLimitBucket();

    if (callsLeft >= 4) {
      await Redis.updateRateLimit(-4);

      const number = await this.processPlayerName(name);
      await this.processPlayerGames(number);

      const record = await this.processPlayerNumber(number);
      await Redis.updateRateLimit(+4);

      return record;
    } else {
      Redis.queuePlayer("names", name);
    }

    return null;
  }

  private async processPlayerGames(id: number, queued = false) {
    if (queued) {
      await Redis.updateRateLimit(-1);
    }
    const matchHistory = await this.client.getGamesForPlayer(id);
    if (queued) {
      await Redis.updateRateLimit(2);
    }

    let player = Players.findOne({ id }, [], { upsert: true });
    const totalMatchHistory = new Set(...(player.matches || []));

    for (const match of matchHistory) {
      console.log(`[Player][${player.id}][Match][${match.gameId}] Processing`);

      totalMatchHistory.add(match.gameId);

      if (match.killerUserNum) {
        console.log(
          `[Player][${player.id}][Match][${match.gameId}] Has Killer: ${match.killerUserNum}`
        );

        const matchKiller = await Players.findOne({
          id: match.killerUserNum,
        });

        if (matchKiller) {
          matchKiller.matches = [...new Set(matchKiller.matches), match.gameId];

          await matchKiller.save();
          console.log(
            `[Player][${player.id}][Match][${match.gameId}][Killer][${match.killerUserNum}] Updated`
          );
        } else {
          const newPlayer = {
            name: match.killDetail,
            id: match.killerUserNum,
            matches: [match.gameId],
            seasonRecords: [],
          };

          await Players.create(newPlayer);
          `[Player][${player.id}][Match][${match.gameId}][Killer][${match.killerUserNum}] Created`;
        }
      }

      console.log(`[Player][${player.id}][Match][${match.gameId}] Processed`);
    }

    player.matchHistory = [...totalMatchHistory];

    await player.save();
  }

  private async processPlayerName(name: string, queued = false) {
    const cachedValue: IPlayer = await Players.findOne({ name }, [], { lean: true });

    if (cachedValue) {
      return cachedValue.id;
    }

    const { userNum } = await this.client.getPlayerNumber(name);

    if (queued && userNum) {
      await Redis.queuePlayer("numbers", userNum);
    }

    return userNum;
  }

  private async processPlayerNumber(id: number, queued = false) {
    const unranked = await this.client.getPlayerRecord(id, 0);
    await new Promise((res) => setTimeout(res, 100));
    const ranked = await this.client.getPlayerRecord(id, 1);
    const lastUpdated = new Date();

    if (queued) {
      await Redis.queuePlayer("games", id);
    }

    const seasonRecords = [
      {
        season: 0,
        lastUpdated,
        info: unranked,
      },
      {
        season: 1,
        lastUpdated,
        info: ranked,
      },
    ];

    const player = {
      name: unranked[0].nickname,
      id,
      matches: [],
      seasonRecords,
    };

    const existingPlayer = await Players.findOne({ id }, [], { upsert: true, new: true });

    if (existingPlayer) {
      player.matches = existingPlayer.matches;
    }

    await Players.findOneAndUpdate({ id }, player, { upsert: true, useFindAndModify: true });

    return player;
  }
}

const Client = new ClientService();

export default Client;

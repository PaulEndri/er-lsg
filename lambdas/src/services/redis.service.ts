import { createClient } from "redis";
import { QueueTypes } from "../types/queueTypes";
import { RedisJsonActions } from "../types/redisJsonActions";
import { RedisKeys } from "../types/redisKeys";

type RedisDocument = {
  [RedisKeys.RATE_LIMIT_KEY]: number;
  [RedisKeys.QUEUED_PLAYER_NAMES_KEY]: string[];
  [RedisKeys.QUEUED_PLAYER_NUMBERS_KEY]: number[];
  [RedisKeys.QUEUED_PLAYER_GAMES_KEY]: number[];
};

class RedisService {
  static DEFAULT_DOCUMENT_NAME = "ERBSLSGAPITHROTTLE";

  private client = createClient({
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_AUTH,
  });
  private loaded = false;
  private lastKnownRateLimit = 0;

  constructor() {
    this.client.once("ready", () => {
      console.log("[Redis] Client Loaded");
      this.loaded = true;

      this.initializeDocument().then(() => console.log("[Doc Loaded]"));
    });
  }

  private async waitForLoad() {
    if (!this.loaded) {
      console.log("[Redis] Client not loaded, waiting");
      return await new Promise<void>((res) =>
        this.client.once("ready", () => {
          res();
        })
      );
    } else {
      return;
    }
  }

  private async initializeDocument() {
    const results = await this.json();

    try {
      const value: RedisDocument = JSON.parse(results);

      this.lastKnownRateLimit = +value[RedisKeys.RATE_LIMIT_KEY];

      return;
    } catch (e) {
      console.warn(e);

      const newDoc = {
        [RedisKeys.RATE_LIMIT_KEY]: +process.env.RATE_LIMIT || 1,
        [RedisKeys.QUEUED_PLAYER_NAMES_KEY]: [],
        [RedisKeys.QUEUED_PLAYER_NUMBERS_KEY]: [],
        [RedisKeys.QUEUED_PLAYER_GAMES_KEY]: [],
      };

      await this.json(newDoc, ".", RedisJsonActions.SET);

      return newDoc[RedisKeys.RATE_LIMIT_KEY];
    }
  }

  private async json<T = string>(
    value?: any,
    key: QueueTypes | RedisKeys.RATE_LIMIT_KEY | "." = ".",
    action: keyof typeof RedisJsonActions = "GET",
    name = RedisService.DEFAULT_DOCUMENT_NAME,
    stringify = true
  ) {
    await this.waitForLoad();

    const command = `JSON.${action}`;
    const args = `${name} ${key}${value ? ` ${stringify ? JSON.stringify(value) : value}` : ""}`;

    return new Promise<T>((res, reject) => {
      this.client.send_command(command, args.split(" "), (e, r) => {
        if (e) {
          return reject(e);
        } else {
          return res(r);
        }
      });
    });
  }

  public async getNextPlayer(action: keyof typeof QueueTypes, value?: number | string) {
    const key = QueueTypes[action];
    let queueString = -1;

    if (value) {
      queueString = +(await this.json(
        value,
        key,
        RedisJsonActions.ARRINDEX,
        RedisService.DEFAULT_DOCUMENT_NAME
      ));
    }

    return await this.json(
      +queueString,
      key,
      RedisJsonActions.ARRPOP,
      RedisService.DEFAULT_DOCUMENT_NAME,
      false
    );
  }

  public async queuePlayer(action: keyof typeof QueueTypes, value: string | number) {
    const key = QueueTypes[action];
    const exists = +(await this.json(value, key, RedisJsonActions.ARRINDEX));

    if (exists === -1) {
      return +(await this.json(value, key, RedisJsonActions.ARRAPPEND));
    }

    return exists;
  }

  public async getRateLimitBucket() {
    return +(await this.json(null, RedisKeys.RATE_LIMIT_KEY));
  }

  public async updateRateLimit(value: number) {
    if (this.lastKnownRateLimit <= 0 && value < 0) {
      throw new Error("Rate Limit is Still in Effect");
    }

    this.lastKnownRateLimit += value;

    await this.json(
      value,
      RedisKeys.RATE_LIMIT_KEY,
      RedisJsonActions.NUMINCRBY,
      RedisService.DEFAULT_DOCUMENT_NAME,
      false
    );

    return this.lastKnownRateLimit;
  }
}

const Redis = new RedisService();

export default Redis;

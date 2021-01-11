import { RedisKeys } from "./redisKeys";

export enum QueueTypes {
  games = RedisKeys.QUEUED_PLAYER_GAMES_KEY,
  numbers = RedisKeys.QUEUED_PLAYER_NUMBERS_KEY,
  names = RedisKeys.QUEUED_PLAYER_NAMES_KEY,
}

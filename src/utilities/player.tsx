import { IUserRecord } from "erbs-client";

export interface IPlayerSeasonRecord {
  season?: number;
  lastUpdated?: Date;
  info?: IUserRecord[];
}

export interface IPlayer {
  name: string;
  id: number;
  seasonRecords?: IPlayerSeasonRecord[];
  matches?: number[];
  lastUpdated?: Date;
}

import { IUserRecord } from "erbs-client";
import { Document } from "mongoose";

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

export interface IPlayerDocument extends Document<IPlayer> {
  name: string;
  id: number;
  seasonRecords?: IPlayerSeasonRecord[];
  matches?: number[];
  lastUpdated?: Date;
}

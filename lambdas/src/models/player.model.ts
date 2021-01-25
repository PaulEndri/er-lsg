import { model, Model, Schema } from "mongoose";
import { IPlayerDocument } from "../types/player";

const PlayerSchema: Schema<IPlayerDocument> = new Schema(
  {
    name: Schema.Types.String,
    id: {
      unique: true,
      type: Schema.Types.Number,
    },
    seasonRecords: [
      {
        lastUpdated: Schema.Types.Date,
        season: Schema.Types.Number,
        info: Schema.Types.Array,
      },
    ],
    matches: Schema.Types.Array,
    lastUpdated: Schema.Types.Date,
  },
  {
    collation: {
      locale: "en",
      strength: 1,
    },
  }
);

export const Players: Model<IPlayerDocument> = model<IPlayerDocument>("Players", PlayerSchema);

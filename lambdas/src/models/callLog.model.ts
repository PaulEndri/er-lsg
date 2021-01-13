import { model, Model, Schema } from "mongoose";
import { IPlayerDocument } from "../types/player";

const PlayerSchema: Schema<IPlayerDocument> = new Schema({
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
});

PlayerSchema.pre("save", function (next) {
  const now = new Date();

  this.lastUpdated = now;

  next();
});

export const Players: Model<IPlayerDocument> = model<IPlayerDocument>("Players", PlayerSchema);

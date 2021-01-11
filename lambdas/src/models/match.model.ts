import { IUserGameHistory } from "erbs-client/dist/interfaces/IUserGameHistory";
import { Document, model, Model, Schema } from "mongoose";

export interface IMatch extends Document {
  id: number;
  seasonId: number;
  gameMode: number;
  version: {
    major: number;
    minor: number;
  };
  data: IUserGameHistory[];
  lastUpdated?: Date;
}

const MatchSchema: Schema<IMatch> = new Schema({
  id: {
    unique: true,
    type: Schema.Types.Number,
  },
  seasonId: Schema.Types.Number,
  gameMode: Schema.Types.Number,
  version: {
    major: Schema.Types.Number,
    minor: Schema.Types.Number,
  },
  data: [],
  lastUpdated: Schema.Types.Date,
});

MatchSchema.pre("save", function (next) {
  const now = new Date();

  this.lastUpdated = now;

  next();
});

export const Matches: Model<IMatch> = model<IMatch>("MatchData", MatchSchema);

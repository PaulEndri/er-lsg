import { IUserGameHistory } from "erbs-client/dist/interfaces/IUserGameHistory";
import { Document, model, Model, Schema } from "mongoose";

export interface IMatch extends Document {
  id: number;
  seasonId?: number;
  gameMode?: number;
  version?: {
    major: number;
    minor: number;
  };
  data: IUserGameHistory[];
  lastUpdated?: Date;
  averageMMR?: number;
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
  averageMMR: Schema.Types.Number,
});

MatchSchema.pre("save", function (next) {
  const now = new Date();

  this.lastUpdated = now;

  if (this.data && this.data.length) {
    if (!this.version) {
      this.version = {
        major: this.data[0].versionMajor,
        minor: this.data[0].versionMinor,
      };
    }

    if (!this.seasonId) {
      this.seasonId = this.data[0].seasonId;
    }

    if (!this.gameMode) {
      this.gameMode = this.data[0].matchingTeamMode;
    }

    this.averageMMR =
      this.data
        .map(({ mmrBefore }) => mmrBefore)
        .reduce((total, current) => (total += current), 0) / this.data.length;
  }

  next();
});
export const Matches: Model<IMatch> = model<IMatch>("MatchData", MatchSchema);

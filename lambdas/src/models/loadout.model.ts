import { Document, model, Model, Schema } from "mongoose";
import { BasicLoadout } from "erbs-sdk/dist/types/loadout";
import { RouteNode } from "erbs-sdk";

export interface ISavedLoadout extends Document {
  name: string;
  id?: string;
  userId: any;
  createdAt?: Date;
  loadout: BasicLoadout;
  routeData: {
    root: RouteNode;
    routes: RouteNode[];
  };
}

const SavedLoadoutSchema: Schema<ISavedLoadout> = new Schema({
  id: {
    unique: true,
    type: Schema.Types.String,
  },
  userId: Schema.Types.Mixed,
  name: Schema.Types.String,
  createdAt: Schema.Types.Date,
  loadout: Schema.Types.Mixed,
  routeData: Schema.Types.Mixed,
});

SavedLoadoutSchema.pre("save", function (next) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});
export const SavedLoadout: Model<ISavedLoadout> = model<ISavedLoadout>(
  "MatchData",
  SavedLoadoutSchema
);

import { Document, model, Model, Schema } from "mongoose";

export interface DataNode extends Document {
  locations: number[];
  itemsCompleted: number[];
  materials: Record<number, number>;
  point: number;
}

const DataNodeSchema: Schema<DataNode> = new Schema({
  locations: [Schema.Types.Number],
  itemsCompleted: [Schema.Types.Number],
  materials: Schema.Types.Mixed,
  point: Schema.Types.Number,
});

export const Nodes: Model<DataNode> = model<DataNode>("processedNodes", DataNodeSchema);

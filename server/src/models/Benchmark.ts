import mongoose, { Document, Schema } from 'mongoose';

export interface IBenchmark extends Document {
  modelHfId: string;
  baseModel: string;
  quantMethod: string;
  bits?: number;
  hardware: string;
  metric: string;
  value: number;
  unit?: string;
  sourceUrl?: string;
  notes?: string;
  runAt: Date;
}

const BenchmarkSchema = new Schema<IBenchmark>(
  {
    modelHfId: { type: String, required: true },
    baseModel: { type: String, required: true },
    quantMethod: { type: String, required: true },
    bits: Number,
    hardware: { type: String, required: true },
    metric: { type: String, required: true },
    value: { type: Number, required: true },
    unit: String,
    sourceUrl: String,
    notes: String,
    runAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BenchmarkSchema.index({ quantMethod: 1, hardware: 1 });
BenchmarkSchema.index({ modelHfId: 1 });

export const Benchmark = mongoose.model<IBenchmark>('Benchmark', BenchmarkSchema);

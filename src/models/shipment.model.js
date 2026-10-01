import mongoose from 'mongoose';

const invoiceFileSchema = new mongoose.Schema(
  {
    originalName: { type: String },
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    storageType: {
      type: String,
      enum: ['local', 's3'],
      default: 'local',
    },
    path: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceValue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    shipmentType: {
      type: String,
      enum: ['Import', 'Export'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Created', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Created',
    },
    description: {
      type: String,
      trim: true,
    },
    invoiceFile: invoiceFileSchema,
  },
  {
    timestamps: true,
  }
);

shipmentSchema.index({ customerId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ shipmentType: 1 });
shipmentSchema.index({ createdAt: -1 });

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;

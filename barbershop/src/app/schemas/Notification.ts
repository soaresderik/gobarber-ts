import { Schema, model, Document } from "mongoose";

interface INotification {
  content: string;
  user: number;
  read: boolean;
}

const NotificationSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    user: {
      type: Number,
      required: true
    },
    read: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

export default model<INotification & Document>(
  "Notification",
  NotificationSchema
);

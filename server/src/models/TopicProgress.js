import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicSlug: {
      type: String,
      required: true,
      trim: true,
    },
    completedLessons: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
      min: 0,
    },
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastLessonId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

topicProgressSchema.index({ userId: 1, topicSlug: 1 }, { unique: true });

export const TopicProgress =
  mongoose.models.TopicProgress || mongoose.model('TopicProgress', topicProgressSchema);

import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema(
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
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    currentFrame: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress =
  mongoose.models.LessonProgress || mongoose.model('LessonProgress', lessonProgressSchema);

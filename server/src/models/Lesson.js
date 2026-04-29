import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedMinutes: {
      type: Number,
      default: 10,
      min: 1,
    },
    visualizationType: {
      type: String,
      default: 'none',
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

lessonSchema.index({ topicId: 1, order: 1 });
lessonSchema.index({ topicId: 1, slug: 1 }, { unique: true });

export const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

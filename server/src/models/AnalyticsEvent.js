import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: [
        'dashboard_viewed',
        'topic_viewed',
        'lesson_opened',
        'trace_library_viewed',
        'sandbox_opened',
        'graph_explorer_opened',
        'practice_list_viewed',
        'practice_problem_opened',
        'quiz_opened',
        'completion_viewed',
      ],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    path: {
      type: String,
      trim: true,
      maxlength: 180,
      required: true,
    },
    context: {
      lessonSlug: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      problemSlug: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      quizId: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      topicSlug: {
        type: String,
        trim: true,
        maxlength: 80,
      },
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

analyticsEventSchema.index({ userId: 1, eventType: 1, occurredAt: -1 });
analyticsEventSchema.index({ occurredAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema);

import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'fill_blank', 'code_output', 'complexity'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const quizSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [quizQuestionSchema],
      default: [],
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

quizSchema.index({ topicId: 1, lessonId: 1 });

export const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

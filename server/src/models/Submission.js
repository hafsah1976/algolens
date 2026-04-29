import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'received',
        'queued',
        'running',
        'accepted',
        'wrong_answer',
        'compilation_error',
        'runtime_error',
        'time_limit_exceeded',
        'judge0_error',
      ],
      default: 'queued',
      index: true,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    runtime: {
      type: Number,
      default: null,
      min: 0,
    },
    memory: {
      type: Number,
      default: null,
      min: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });

export const Submission =
  mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

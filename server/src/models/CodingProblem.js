import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const starterCodeSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expectedOutput: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const codingProblemSchema = new mongoose.Schema(
  {
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
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      trim: true,
    },
    statement: {
      type: String,
      required: true,
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    starterCode: {
      type: [starterCodeSchema],
      default: [],
    },
    testCases: {
      type: [testCaseSchema],
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

codingProblemSchema.index({ topicId: 1, difficulty: 1 });

export const CodingProblem =
  mongoose.models.CodingProblem || mongoose.model('CodingProblem', codingProblemSchema);

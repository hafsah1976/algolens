import mongoose from 'mongoose';

import { loadServerEnv } from '../utils/loadEnv.js';
import {
  initialCodingProblems,
  initialDsaQuizzes,
  initialDsaTopics,
} from '../data/dsaSeedContent.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { Topic } from '../models/Topic.js';

loadServerEnv();

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/algolens';

function getMongoUri() {
  return process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
}

async function findOrCreateTopic(topicSeed) {
  const existingTopic = await Topic.findOne({ slug: topicSeed.slug });

  if (existingTopic) {
    return {
      created: false,
      topic: existingTopic,
    };
  }

  const topic = await Topic.create({
    description: topicSeed.description,
    difficulty: topicSeed.difficulty,
    isPublished: true,
    order: topicSeed.order,
    slug: topicSeed.slug,
    title: topicSeed.title,
  });

  return {
    created: true,
    topic,
  };
}

async function findOrCreateLesson(topic, lessonSeed) {
  const existingLesson = await Lesson.findOne({ slug: lessonSeed.slug });

  if (existingLesson) {
    const shouldSetVisualization =
      lessonSeed.visualizationType &&
      lessonSeed.visualizationType !== 'none' &&
      (!existingLesson.visualizationType || existingLesson.visualizationType === 'none');

    if (shouldSetVisualization) {
      existingLesson.visualizationType = lessonSeed.visualizationType;
      await existingLesson.save();

      return {
        created: false,
        lesson: existingLesson,
        visualizationUpdated: true,
      };
    }

    return {
      created: false,
      lesson: existingLesson,
      visualizationUpdated: false,
    };
  }

  const lesson = await Lesson.create({
    content: lessonSeed.content,
    estimatedMinutes: lessonSeed.estimatedMinutes,
    isPublished: true,
    order: lessonSeed.order,
    slug: lessonSeed.slug,
    summary: lessonSeed.summary,
    title: lessonSeed.title,
    topicId: topic._id,
    visualizationType: lessonSeed.visualizationType,
  });

  return {
    created: true,
    lesson,
    visualizationUpdated: false,
  };
}

async function findOrCreateQuiz(topic, quizSeed) {
  const existingQuiz = await Quiz.findOne({
    title: quizSeed.title,
    topicId: topic._id,
  });

  if (existingQuiz) {
    return {
      created: false,
      quiz: existingQuiz,
    };
  }

  const quiz = await Quiz.create({
    isPublished: true,
    questions: quizSeed.questions,
    title: quizSeed.title,
    topicId: topic._id,
  });

  return {
    created: true,
    quiz,
  };
}

async function findOrCreateCodingProblem(topic, problemSeed) {
  const existingProblem = await CodingProblem.findOne({ slug: problemSeed.slug });

  if (existingProblem) {
    return {
      created: false,
      problem: existingProblem,
    };
  }

  const problem = await CodingProblem.create({
    constraints: problemSeed.constraints,
    difficulty: problemSeed.difficulty,
    examples: problemSeed.examples,
    isPublished: true,
    slug: problemSeed.slug,
    starterCode: problemSeed.starterCode,
    statement: problemSeed.statement,
    testCases: problemSeed.testCases,
    title: problemSeed.title,
    topicId: topic._id,
  });

  return {
    created: true,
    problem,
  };
}

async function seedDsaContent() {
  await mongoose.connect(getMongoUri(), {
    serverSelectionTimeoutMS:
      Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 3000,
  });

  const summary = {
    lessonsCreated: 0,
    lessonsSkipped: 0,
    lessonVisualizationsUpdated: 0,
    problemsCreated: 0,
    problemsSkipped: 0,
    quizzesCreated: 0,
    quizzesSkipped: 0,
    topicsCreated: 0,
    topicsSkipped: 0,
  };

  for (const topicSeed of initialDsaTopics) {
    const topicResult = await findOrCreateTopic(topicSeed);

    if (topicResult.created) {
      summary.topicsCreated += 1;
    } else {
      summary.topicsSkipped += 1;
    }

    for (const lessonSeed of topicSeed.lessons) {
      const lessonResult = await findOrCreateLesson(topicResult.topic, lessonSeed);

      if (lessonResult.created) {
        summary.lessonsCreated += 1;
      } else if (lessonResult.visualizationUpdated) {
        summary.lessonVisualizationsUpdated += 1;
      } else {
        summary.lessonsSkipped += 1;
      }
    }
  }

  for (const quizSeed of initialDsaQuizzes) {
    const topic = await Topic.findOne({ slug: quizSeed.topicSlug });

    if (!topic) {
      console.warn(`Skipping quiz "${quizSeed.title}" because topic "${quizSeed.topicSlug}" is missing.`);
      summary.quizzesSkipped += 1;
      continue;
    }

    const quizResult = await findOrCreateQuiz(topic, quizSeed);

    if (quizResult.created) {
      summary.quizzesCreated += 1;
    } else {
      summary.quizzesSkipped += 1;
    }
  }

  for (const problemSeed of initialCodingProblems) {
    const topic = await Topic.findOne({ slug: problemSeed.topicSlug });

    if (!topic) {
      console.warn(
        `Skipping problem "${problemSeed.title}" because topic "${problemSeed.topicSlug}" is missing.`,
      );
      summary.problemsSkipped += 1;
      continue;
    }

    const problemResult = await findOrCreateCodingProblem(topic, problemSeed);

    if (problemResult.created) {
      summary.problemsCreated += 1;
    } else {
      summary.problemsSkipped += 1;
    }
  }

  return summary;
}

seedDsaContent()
  .then((summary) => {
    console.log('AlgoLens DSA seed complete.');
    console.log(
      `Topics created: ${summary.topicsCreated}; topics already present: ${summary.topicsSkipped}.`,
    );
    console.log(
      `Lessons created: ${summary.lessonsCreated}; lessons already present: ${summary.lessonsSkipped}.`,
    );
    console.log(
      `Lesson visualizations updated: ${summary.lessonVisualizationsUpdated}.`,
    );
    console.log(
      `Quizzes created: ${summary.quizzesCreated}; quizzes already present: ${summary.quizzesSkipped}.`,
    );
    console.log(
      `Problems created: ${summary.problemsCreated}; problems already present: ${summary.problemsSkipped}.`,
    );
  })
  .catch((error) => {
    console.error(`AlgoLens DSA seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

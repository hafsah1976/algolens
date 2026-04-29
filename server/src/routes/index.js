import { Router } from 'express';

import { adminRouter } from './adminRoutes.js';
import { authRouter } from './authRoutes.js';
import { contentRouter } from './contentRoutes.js';
import { dashboardRouter } from './dashboardRoutes.js';
import { healthRouter } from './healthRoutes.js';
import { problemRouter } from './problemRoutes.js';
import { progressRouter } from './progressRoutes.js';
import { quizRouter } from './quizRoutes.js';

export const apiRouter = Router();

apiRouter.use(adminRouter);
apiRouter.use(authRouter);
apiRouter.use(contentRouter);
apiRouter.use(dashboardRouter);
apiRouter.use(healthRouter);
apiRouter.use(problemRouter);
apiRouter.use(progressRouter);
apiRouter.use(quizRouter);

import { loadServerEnv } from './utils/loadEnv.js';
import { createApp } from './app.js';
import { connectToDatabase, getDatabaseStatus } from './db/mongo.js';

loadServerEnv();

const port = Number(process.env.PORT) || 3001;
const app = createApp();

await connectToDatabase();

app.listen(port, () => {
  const database = getDatabaseStatus();
  console.log(`AlgoLens API running at http://127.0.0.1:${port} (db: ${database.state})`);
});

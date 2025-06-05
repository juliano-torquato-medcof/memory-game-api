import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import rankingsRouter from './routes/rankings.routes';
import statsRouter from './routes/stats.routes';
import { connectMongoose } from './config/mongoose';
import { swaggerDefinition } from './swagger';
import { env } from './config/env';
import { loggerMiddleware } from './middleware/logger';

const app = express();

app.use(loggerMiddleware);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
app.use('/rankings', rankingsRouter);
app.use('/stats', statsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

connectMongoose().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on ${env.API_URL}:${env.PORT}`);
    console.log(`API Documentation available at ${env.API_URL}:${env.PORT}/api-docs`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}); 
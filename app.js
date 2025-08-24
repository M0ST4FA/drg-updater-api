import express from 'express';
import morgan from 'morgan';
import metadataRouter from './routes/metadata.js';
import downloadsRouter from './routes/downloads.js';
import errorHandler from './controllers/errors.js';

const app = express();
app.use(morgan('combined'));

app.use(express.static('public', { etag: true }));

app.use('/api/v1/releases', metadataRouter);
app.use('/apks', downloadsRouter);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`APK Update Server is running at http://localhost:${PORT}.`);
});

import express from 'express';
import morgan from 'morgan';
import updatesRouter from './routes/updates.js';
import errorHandler from './controllers/errors.js';
import https from 'node:https';
import fs from 'node:fs';

const app = express();
app.use(morgan('combined'));

app.use(express.static('public', { etag: true }));

app.use('/api', updatesRouter);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.HTTPS !== 'TRUE')
  app.listen(PORT, () => {
    console.log(`APK Update Server is running on port ${PORT} using HTTP`);
  });
else {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };
  https.createServer(options, app).listen(3000, () => {
    console.log(`APK Update Server is running on port ${PORT} using HTTPS`);
  });
}

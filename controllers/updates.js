import fs from 'node:fs/promises';
import path from 'node:path';
import { AppError, catchAsync } from '../utils/AppError.js';
import { createReadStream } from 'node:fs';
import Metadata from '../models/Metadata.js';

// Handlers
const getFileInformation = catchAsync(async function (req, res, next) {
  const version = req.params.version;
  const filePath = path.join(process.cwd(), 'public/apks', version, 'app.apk');

  let fileStats;

  try {
    fileStats = await fs.stat(filePath);
  } catch (error) {
    return next(new AppError('File not found', 400));
  }

  res.file = {
    version,
    path: filePath,
    size: fileStats.size,
  };

  next();
});

const getVersionMetadata = function (req, res, next) {
  const metadata = Metadata.getInstance();

  try {
    const version = res.file.version;
    const versionMetadata = metadata.getVersionMetadata(version);
    res.status(200).json({
      status: 'success',
      data: { versionMetadata },
    });
  } catch (error) {
    next(error);
  }
};

const getLatestVersionMetadata = function (req, res, next) {
  const metadata = Metadata.getInstance();

  try {
    const latestVersionMetadata = metadata.getLatestVersionMetadata();

    res.status(200).json({
      status: 'success',
      data: { latestVersionMetadata },
    });
  } catch (error) {
    next(error);
  }
};

const download = catchAsync(async function (req, res, next) {
  const version = req.params.version;
  const filePath = path.join(process.cwd(), 'public/apks', version, 'app.apk');

  let fileStats;

  try {
    fileStats = await fs.stat(filePath);
  } catch (error) {
    return next(new AppError('File not found', 400));
  }

  res.writeHead(200, {
    'content-type': 'application/vnd.android.package-archive',
    'content-disposition': `attachment; filename="drg-apk-v${version}"`,
    'accept-ranges': 'none',
    'content-length': fileStats.size,
  });

  createReadStream(filePath).pipe(res);
});

export default {
  getFileInformation,
  getVersionMetadata,
  getLatestVersionMetadata,
  download,
};

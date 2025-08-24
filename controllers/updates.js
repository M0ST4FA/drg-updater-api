import fs from 'node:fs/promises';
import path from 'node:path';
import { AppError, catchAsync } from '../utils/AppError.js';
import { createReadStream } from 'node:fs';
import Metadata from '../models/Metadata.js';

const fileInfoCache = new Map();

const getFileInformationCommon = async function (version) {
  const cachedInfo = fileInfoCache.get(version);

  if (cachedInfo) console.log('Cache hit');
  else console.log('Cache miss');

  if (cachedInfo) return cachedInfo;

  const filePath = path.join(process.cwd(), `public/apks/drg-${version}.apk`);

  let fileStats;

  try {
    fileStats = await fs.stat(filePath);
  } catch (error) {
    throw new AppError('File not found', 400);
  }

  const info = {
    version,
    path: filePath,
    size: fileStats.size,
  };

  fileInfoCache.set(version, info);

  return info;
};

// Handlers
const getFileInformation = catchAsync(async function (req, res, next) {
  const version = req.params.version;

  res.file = await getFileInformationCommon(version);

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

const downloadLatest = catchAsync(async function (req, res, next) {
  const metadata = Metadata.getInstance();

  try {
    const latestVersionMetadata = metadata.getLatestVersionMetadata();

    const version = latestVersionMetadata.version;

    console.log(version);

    const fileStats = await getFileInformationCommon(version);

    const filePath = fileStats.path;
    const size = fileStats.size;

    res.writeHead(200, {
      'content-type': 'application/vnd.android.package-archive',
      'content-disposition': `attachment; filename="drg-v${version}"`,
      'accept-ranges': 'none',
      'content-length': size,
    });

    createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
});

const download = function (req, res, next) {
  const filePath = res.file.path;
  const version = res.file.version;
  const size = res.file.size;

  res.writeHead(200, {
    'content-type': 'application/vnd.android.package-archive',
    'content-disposition': `attachment; filename="drg-v${version}"`,
    'accept-ranges': 'none',
    'content-length': size,
  });

  createReadStream(filePath).pipe(res);
};

export default {
  getFileInformation,
  getVersionMetadata,
  getLatestVersionMetadata,
  downloadLatest,
  download,
};

import { Router } from 'express';
import UpdatesController from '../controllers/updates.js';

const router = Router({ mergeParams: true });

router.get('/updates/latest', UpdatesController.getLatestVersionMetadata);
router.get(
  '/updates/:version',
  UpdatesController.getFileInformation,
  UpdatesController.getVersionMetadata,
);

router.get('/updates/downloads/latest', UpdatesController.downloadLatest);
router.get(
  '/updates/downloads/:version',
  UpdatesController.getFileInformation,
  UpdatesController.download,
);

export default router;

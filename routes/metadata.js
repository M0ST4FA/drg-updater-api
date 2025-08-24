import { Router } from 'express';
import UpdatesController from '../controllers/updates.js';

const router = Router({ mergeParams: true });

router.get('/latest', UpdatesController.getLatestVersionMetadata);
router.get(
  '/:version',
  UpdatesController.getFileInformation,
  UpdatesController.getVersionMetadata,
);

export default router;

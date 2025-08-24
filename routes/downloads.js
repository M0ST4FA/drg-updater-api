import { Router } from 'express';
import UpdatesController from '../controllers/updates.js';

const router = Router({ mergeParams: true });

router.get('/latest', UpdatesController.downloadLatest);
router.get(
  '/:version',
  UpdatesController.getFileInformation,
  UpdatesController.download,
);

export default router;

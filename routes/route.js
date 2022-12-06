import express from 'express';

import { addData, aboutPage, homePage, loginPage, mailToOne, modifyPage, updateOrRemoveRecord, logOutUser } from './controller.js';

const router = express.Router();

router.get('/', homePage);
router.post('/', addData);

router.get('/login', loginPage);
router.get('/logout', logOutUser);
router.get('/about', aboutPage);

router.get('/modify/:recordId', modifyPage);
router.post('/modify/:recordId', updateOrRemoveRecord);

router.get('/emailto/:reqId', mailToOne);

export default router;
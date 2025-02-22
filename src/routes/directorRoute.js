const { Router } = require('express');
const { allDirectorsGet, directorGet } = require('../controllers/directorController');

const directorsRouter = Router();

directorsRouter.get('/', allDirectorsGet);
directorsRouter.get('/:director', directorGet);

module.exports = directorsRouter;
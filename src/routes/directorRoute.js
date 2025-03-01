const { Router } = require('express');
const { allDirectorsGet, directorGet, directorFormGet } = require('../controllers/directorController');

const directorsRouter = Router();

directorsRouter.get('/', allDirectorsGet);
directorsRouter.get('/add-director', directorFormGet);
directorsRouter.get('/:director', directorGet);

module.exports = directorsRouter;
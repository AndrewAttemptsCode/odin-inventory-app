const { Router } = require('express');
const { allDirectorsGet, directorGet, directorFormGet, directorFormPost } = require('../controllers/directorController');

const directorsRouter = Router();

directorsRouter.get('/', allDirectorsGet);
directorsRouter.get('/:movie/add-director', directorFormGet);
directorsRouter.post('/:movie/add-director', directorFormPost);
directorsRouter.get('/:director', directorGet);

module.exports = directorsRouter;
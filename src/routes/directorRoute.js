const { Router } = require('express');
const { allDirectorsGet } = require('../controllers/directorController');

const directorsRouter = Router();

directorsRouter.get('/', allDirectorsGet);

module.exports = directorsRouter;
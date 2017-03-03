// require dependincies
var express = require('express');
var router = express.Router();
var projectController = require('./controllers/projectController');

// add routes
router.get('/', projectController.getHomePage);

router.get('/student', projectController.studentfirstpage);

router.post('/',projectController.studentregister);

router.post('/student', projectController.studentlogin);

router.get('/myportfolio',projectController.getMyPortfolio);

router.post('/myportfolio',projectController.createPortfolio);

router.get('/viewmypfolio',projectController.showPortfolio);

router.post('/viewmypfolio',projectController.addWork);

router.get('/client',projectController.clientPage);

router.post('/client',projectController.viewDetailed);





// export router

module.exports = router;

const express = require('express');
const router = express.Router();
const isAuth = require('../../middleware/auth');
const handleMethodRouting = require('../handle-method-routings');
const OwnerController = require('../../controller/OwnerController');

const authenticatedMappings = {
    owner: OwnerController.createOwner
};

router.post('/', isAuth, (req, res) => {
    handleMethodRouting(req, res, authenticatedMappings);
});

module.exports = router;
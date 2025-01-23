const router = require('express').Router();
const { createGroup, getGroupById, getGroups, joinGroup, getGroupMembers } = require('./controllers/groupController');
const { getUserById, getUserByEmail, createUser, getUsersByGroupId, getUsers } = require('./controllers/userController');
const { addExpense, settleUp } = require('./controllers/transactionController');

// User Routes
router.get('/user/getUserById', getUserById);
router.get('/user/getUserByEmail', getUserByEmail);
router.post('/user/createUser', createUser);
router.post('/user/getUsersByGroupId', getUsersByGroupId);
router.get('/user/getUsers', getUsers);

// Group Routes
router.post('/group/create', createGroup);
router.post('/group/getGroupById', getGroupById);
router.get('/group/getGroups', getGroups);
router.post('/group/joinGroup', joinGroup);
router.post('/group/getGroupMembers', getGroupMembers);

// Transaction Routes
router.post('/transaction/addExpense', addExpense);
router.post('/transaction/settleUp', settleUp);

// Echo Route
router.get("/echo/:what", (req, res) => {
    res.json({
        message: `echo: ${req.params.what}`
    });
});

module.exports = router;
/* need /log/ POST to create logs, /log/ GET to search all logs for user
    /log/:id GET to get individual logs for a user, PUT to update an individual log for a user, DELETE to remove an individual log for a user
*/

const router = require("express").Router();
const { LogModel } = require("../models");

router.get('/test', (req, res) => {
    res.send('Hi! You have successfully tested.')
});

module.exports = router;
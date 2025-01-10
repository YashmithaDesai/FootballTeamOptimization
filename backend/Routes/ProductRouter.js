const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.get('/', ensureAuthenticated, (req, res) => {

    console.log('---- logged in user detail ---', req.user);
    res.status(200).json([
        {
            name: " ",
            url: "http://localhost:8501/ "
        },
        {
            name: " "
        }
    ])
});

module.exports = router;
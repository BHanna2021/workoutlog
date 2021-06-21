/*need /user/register and /user/login */

const router = require("express").Router();
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/register", async(req, res) => {

    let { username, passwordhash } = req.body.User;
    try {
        const newUser = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 13),
        });

        let token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: `${username} has been successfully registered.`,
            user: newUser,
            sessionToken: token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: `${username} is already in use.`
            });
        } else {
            res.status(500).json({
                message: `Failed to register ${username}`
            });
        }
    }
});

router.post("/login", async(req, res) => {
    let { username, passwordhash } = req.body.User;

    try {
        const loggedInUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });
        if (loggedInUser) {
            // console.log(passwordhash, loggedInUser.passwordhash);

            let passwordCompare = await bcrypt.compare(passwordhash, loggedInUser.passwordhash);

            if (passwordCompare) {

                let token = jwt.sign({ id: loggedInUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loggedInUser,
                    message: `${username} successfully logged in.`,
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect username or password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        });
    }
})

module.exports = router;
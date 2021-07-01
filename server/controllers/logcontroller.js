const router = require("express").Router();
const { JsonWebTokenError } = require("jsonwebtoken");
const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");
const Log = require("../models/log");

router.post("/", validateJWT, async(req, res) => {
    console.log("Hi Mom!")
    const { description, definition, result } = req.body.Log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    console.log(req.body.Log, req.user)
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get("/", validateJWT, async(req, res) => {
    const { id } = req.user;
    try {
        const entries = await LogModel.findAll({
            where: {
                owner_id: id
            }
        })
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get("/:id", validateJWT, async(req, res) => {
    const logId = req.params.id;
    const ownerId = req.user.id;
    try {
        const results = await LogModel.findAll({
            where: {
                owner_id: ownerId,
                id: logId
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put("/:id", validateJWT, async(req, res) => {
    const { description, definition, result } = req.body.Log;
    const ownerId = req.user.id;
    const logId = req.params.id;

    const query = {
        where: {
            id: logId,
            owner_id: ownerId
        }
    };
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json({
            message: `Log ${logId} has been updated.`
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/:id", validateJWT, async(req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: `Log ${logId} has been removed.` });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
module.exports = router;
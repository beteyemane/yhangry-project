const express = require('express');
const router = express.Router();
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

router.get(process.env.API_URL, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menus');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;

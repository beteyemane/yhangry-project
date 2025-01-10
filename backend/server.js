const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const setMenusRoutes = require('./routes/setMenus');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/set-menus', setMenusRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
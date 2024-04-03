import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './db'

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}...`);
});
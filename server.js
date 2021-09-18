import envVars from 'dotenv';
envVars.config();
import express from 'express';
import conn from './DB/conn.js';
import router from './router/router.js';

const app =express();
conn();



app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
})

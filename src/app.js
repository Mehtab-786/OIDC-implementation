import express from 'express';
import oidcRouter from './routes/oidcRoutes.routes.js'

const app = express();

app.use(express.json())


app.use("/",oidcRouter)

export default app;

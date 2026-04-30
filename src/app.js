import express from 'express';
import path from 'path';
import oidcRouter from '../src/modules/oidc/routes/oidcRoutes.routes.js'
// import {fileURLToPath} from 'url'
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const __dirname = import.meta.dirname;
const app = express();

app.use(express.json())
 app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

app.use("/public", express.static(path.resolve(process.cwd(), "public")));

app.use("/",oidcRouter)

export default app;

import express from 'express';
import 'dotenv/config';
import { entryPoint } from './service/misc/entry-point.ts';

const app = express();
const port = 3000;

app.get('/', entryPoint);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

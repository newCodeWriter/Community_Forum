/** @format */

import express from 'express';
import { router } from './routes/routes.js';

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(port, () => {
	console.log('Express app listening on port ' + port);
});

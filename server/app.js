/** @format */

require("dotenv").config();
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/users");
const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

//connect to Mongodb database
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

const { json, urlencoded } = express;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(join(__dirname, "client/build")));
	app.get("*", (req, res) => {
		res.sendFile(join(__dirname, "client/build", "index.html"));
	});
}

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

app.listen(port, () => {
	console.log(`Express SERVER listening on port ${port} `);
});

module.exports = app;

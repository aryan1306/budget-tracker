import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import { redis } from "./redis";
import { User } from "./entities/user.entity";
import { userRouter } from "./users/controller";

const main = async () => {
	const app = express();
	const RedisStore = connectRedis(session);
	dotenv.config();

	app.use(express.json());
	app.use(
		morgan(":method :url :status :res[content-length] - :response-time ms")
	);
	app.use(cors());
	app.use(helmet());
	app.use(
		session({
			name: "jid",
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				httpOnly: true,
				secure: false,
				maxAge: 1000 * 60 * 60 * 24 * 7,
			},
			saveUninitialized: false,
			secret: "lkajdf#@RFW32S_32",
			resave: false,
		})
	);

	//Routes
	app.use("/api/v1/user", userRouter);

	await createConnection({
		type: "postgres",
		host: "localhost",
		port: 5432,
		username: "aryan",
		password: "aryan",
		database: "budgetTrackerDB",
		synchronize: true,
		logging: true,
		entities: [User],
	});

	app.listen(parseInt(process.env.PORT!), () => {
		console.log(`Server started at ${process.env.PORT}`);
	});
};
main();

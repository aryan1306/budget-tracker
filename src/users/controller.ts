import { verify } from "argon2";
import express, { Request, Response } from "express";
import { loginUserDetails } from "./dto/loginUserDTO";
import { registerUser } from "./dto/registerUserDTO";
import { userSchema } from "./schema";
import { findByEmail, register } from "./service";

export const userRouter = express.Router();

userRouter.post("/register", async (req: Request, res: Response) => {
	try {
		const userDetails: registerUser = req.body;
		const { name, email, password } = userDetails;

		const doesUserExist = await findByEmail(email);

		if (doesUserExist) {
			return res
				.status(400)
				.json({ ok: false, err: "A user with this email already exists" });
		}

		const { error, value } = userSchema.validate({ name, email, password });

		if (typeof error !== "undefined") {
			return res.status(400).json({ ok: false, err: error.message });
		}

		const user = await register(value);

		//@ts-ignore
		req.session.uid = user.id.toString();

		return res.status(201).json({ ok: true, result: user });
	} catch (err) {
		//TODO remove clg in prod
		console.log(err);
		return res.status(500).json({ ok: false, err: err });
	}
});

userRouter.post("/login", async (req: Request, res: Response) => {
	try {
		const userDetails: loginUserDetails = req.body;
		const { email, password } = userDetails;

		const user = await findByEmail(email);
		if (!user) {
			return res.status(400).json({
				ok: false,
				err: "Account with this email does not exist",
			});
		}

		const validPassword = await verify(user.password, password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				err: "Incorrect Password, please try again",
			});
		}

		//@ts-ignore
		req.session.uid = user.id.toString();

		return res.status(200).json({ ok: true, result: user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ ok: false, err: error.message });
	}
});

userRouter.post("/logout", (req: Request, res: Response) => {
	req.session.destroy((err) => {
		return res.status(400).json({ ok: false, err });
	});
	res.clearCookie("jid");
	return res.status(200).json({ ok: true, result: "logged out" });
});

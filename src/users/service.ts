import { hash } from "argon2";
import { User } from "../entities/user.entity";
import { registerUser } from "./dto/registerUserDTO";

export const register = async (userDetails: registerUser): Promise<User> => {
	const { name, email, password } = userDetails;

	const hashedPassword = await hash(password);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	}).save();

	return user;
};

export const findByEmail = async (email: string) => {
	const user = await User.findOne({ email });
	return user;
};

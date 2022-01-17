import Joi from "joi";

export const userSchema = Joi.object({
	name: Joi.string().alphanum().min(2).max(30).required().messages({
		"string.min": "password should have atleast 8 characters",
		"string.max": "password cannot be more than 20 characters long",
		"any.required": "name field cannot be empty",
	}),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
		.required()
		.messages({
			"string.email": "Please enter a valid e-mail",
			"any.required": "e-mail field cannot be empty",
		}),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.min(8)
		.max(20)
		.required()
		.messages({
			"string.pattern.base":
				"password should atleast 8 characters long and have atleast 1 number, 1 capital alphabet and 1 non-capital alphabet",
			"string.min": "password should have atleast 8 characters",
			"string.max": "password cannot be more than 20 characters long",
			"any.required": "password field cannot be empty",
		}),
});

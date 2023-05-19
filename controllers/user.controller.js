const User = require("../models/user_schema");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const getUser = (req, res) => {
	User.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.send(err);
		});
}

const signUp = async (req, res) => {
	const { f_name, l_name, email, password, address, contact } = req.body;
	if (!f_name || !l_name || !email || !password || !address, !contact) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "Please Provide Required Information",
		});
	}
	const hash_password = await bcrypt.hash(password, 10);

	const userData = {
		f_name,
		l_name,
		email,
		password: hash_password,
		address,
		contact,
	};

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "User already exists",
		});
	}

	try {
		const newUser = new User(userData);
		const savedUser = await newUser.save();

		return res.status(StatusCodes.OK).json({
			message: "User created successfully",
			user: savedUser,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Failed to save user",
		});
	};
}

const updateUser = async (req, res) => {
	try {
		const { f_name, l_name, email, password, address, contact } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				f_name,
				l_name,
				email,
				password: hashedPassword,
				address,
				contact,
			},
			{ new: true }
		);

		res.json(updatedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	};
}

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.todoID;

		const user = await User.findOneAndDelete({ _id: userId });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({ message: 'User deleted', user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "Please Provide Required Information",
		});
	}

	const emailRegex = /^[a-z][0-9]@[a-z]+\.[a-z]+$/;
	if (!emailRegex.test(email)) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: 'Invalid email',
		});
	}

	const users = await User.findOne({ email });
	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'User not found',
		});
	}

	const user = users[0];
	const isMatch = await bcrypt.compare(password, user.password);
	console.log("isMatch", isMatch);

	if (isMatch) {
		console.log("Success");
		res.status(200).json(user);
	} else {
		console.log("not valid");
		res.status(400).json({ message: "Invalid details" });
	}
};

module.exports = {
	getUser,
	signUp,
	updateUser,
	deleteUser,
	loginUser
};
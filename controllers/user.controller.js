const User = require("../models/user_schema");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
var UserService = require('../services/users.service');
const jwt = require("jsonwebtoken");
const jwtKey = "organization";

const getUser = (req, res) => {
	UserService.getUser()
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.send(err);
		});
}

const getUserById = (req, res) => {
	const { id } = req.params;
	UserService.getUserById(id)
		.then(user => {
			if (!user) {
				res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
			} else {
				res.json(user);
			}
		})
		.catch(err => {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
		});
}

//get users with pagination

// const getAllUser = async (req, res) => {
// 	const pageNumber = req.query.pageNumber || 1;
// 	const pageSize = req.query.pageSize || 3;

// 	const startIndex = (pageNumber - 1) * pageSize;
// 	const users = await User.find().skip(startIndex).limit(pageSize);

// 	res.json({
// 		user: users,
// 		pageNo: req.query.pageNumber,
// 	});
// };

//get users & search with pagination
const getAllUser = async (req, res) => {
	const searchQuery = req.query.search || '';
	const pageNumber = parseInt(req.query.pageNumber) || 1;
	const pageSize = parseInt(req.query.pageSize) || 3;

	const startIndex = (pageNumber - 1) * pageSize;
	const endIndex = pageNumber * pageSize;

	try {
		const totalCount = await User.countDocuments({
			$or: [
				{ f_name: { $regex: searchQuery, $options: 'i' } },
				{ l_name: { $regex: searchQuery, $options: 'i' } },
				{ email: { $regex: searchQuery, $options: 'i' } },
				{ address: { $regex: searchQuery, $options: 'i' } },
			],
		});

		const users = await User.find({
			$or: [
				{ f_name: { $regex: searchQuery, $options: 'i' } },
				{ l_name: { $regex: searchQuery, $options: 'i' } },
				{ email: { $regex: searchQuery, $options: 'i' } },
				{ address: { $regex: searchQuery, $options: 'i' } },
			],
		})
			.skip(startIndex)
			.limit(pageSize);

		const response = {
			users,
			page: pageNumber,
			// pageSize,
			totalCount,
		};

		if (endIndex < totalCount) {
			response.nextPage = pageNumber + 1;
		}

		if (startIndex > 0) {
			response.previousPage = pageNumber - 1;
		}

		res.json(response);
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
	}
};

const searchUserByFname = (req, res) => {
	const { f_name } = req.query;
	User.find({ f_name })
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.send(err);
		});
}

const signUp = async (req, res) => {
	try {
		const { f_name, l_name, email, password, address, contact } = req.body;

		if (!f_name || !l_name || !email || !password || !address || !contact) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Please provide required information',
			});
		}

		const userData = {
			f_name,
			l_name,
			email,
			password,
			address,
			contact,
		};

		const savedUser = await UserService.createUser(userData);

		res.status(StatusCodes.OK).json({
			message: 'User created successfully',
			user: savedUser,
		});
	} catch (error) {
		if (error.message === 'User already exists') {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'User already exists',
			});
		} else {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: 'Failed to save user' });
		}
	}
};

const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const userData = req.body;

		const updatedUser = await UserService.updateUserById(userId, userData);

		res.json({ message: 'User updated', updatedUser });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.todoID;

		const user = await UserService.deleteUserById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({ message: 'User deleted', user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Please provide required information',
			});
		}

		const user = await UserService.loginUser(email, password);
		const token = generateToken(user._id);
		console.log(token,"token");
		console.log(user);
		res.status(StatusCodes.OK).json({
			message: 'User logged-in',
			user: user,
			token: token,
		});
	} catch (error) {
		if (error.message === 'User not found') {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'User not found',
			});
		} else if (error.message === 'Invalid details') {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Invalid details',
			});
		} else {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: error.message });
		}
	}
};

const generateToken = (user) => {
	const token = jwt.sign({ userId: user._id }, jwtKey, {
		expiresIn: '24h',
	});
	return token;
};

const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];

	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(" ");
		const token = bearer[1];
		req.token = token;
		next();
	} else {
		res.send({
			message: "invalid token"
		})
	}
}


module.exports = {
	getUser,
	signUp,
	updateUser,
	deleteUser,
	loginUser,
	getAllUser,
	searchUserByFname,
	getUserById,
	verifyToken
};

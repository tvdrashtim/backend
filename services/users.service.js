const User = require("../models/user_schema");
const bcrypt = require('bcrypt');

const getUser = () => {
	return User.find();
};

const getUserById = (id) => {
	return User.findById(id);
};

const searchUserByFname = (f_name) => {
	return User.find({ f_name });
};

const deleteUserById = async (userId) => {
	try {
		const user = await User.findOneAndDelete({ _id: userId });
		return user;
	} catch (error) {
		throw error;
	}
};

const updateUserById = async (userId, userData) => {
	try {
		const { f_name, l_name, email, password, address, contact } = userData;

		const existingUser = await User.findOne({ email });
		if (existingUser && existingUser._id.toString() !== userId) {
			throw new Error('Email already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
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

		return updatedUser;
	} catch (error) {
		throw error;
	}
};

const loginUser = async (email, password) => {
	try {
		const user = await User.findOne({ email });

		if (!user) {
			throw new Error('User not found');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch) {
			return user;
		} else {
			throw new Error('Invalid details');
		}
	} catch (error) {
		throw error;
	}
};

const createUser = async (userData) => {
	try {
		const { email } = userData;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new Error('User already exists');
		}

		const hash_password = await bcrypt.hash(userData.password, 10);
		userData.password = hash_password;

		const newUser = new User(userData);
		const savedUser = await newUser.save();

		return savedUser;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getUser,
	createUser,
	updateUserById,
	deleteUserById,
	loginUser,
	searchUserByFname,
	getUserById,
};

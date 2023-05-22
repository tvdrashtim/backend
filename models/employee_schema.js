const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
	f_name: {
		type: String,
		required: true,
	},
	l_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	technology: {
		type: String,
		required: true,
	},
	contact: {
		type: Number,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
		require: true,
	},
});

module.exports = mongoose.model("employee", EmployeeSchema);

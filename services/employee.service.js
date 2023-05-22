const Employee = require("../models/employee_schema");
const bcrypt = require('bcrypt');

const createEmployee = async (employeeData) => {
	try {
		const { f_name, l_name, email, password, technology, contact } = employeeData;

		const hash_password = await bcrypt.hash(password, 10);

		const empData = {
			f_name,
			l_name,
			email,
			password: hash_password,
			technology,
			contact,
		};

		const existingEmployee = await Employee.findOne({ email });

		if (existingEmployee) {
			throw new Error('Employee already exists');
		}

		const newEmployee = new Employee(empData);
		const savedEmployee = await newEmployee.save();

		return savedEmployee;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createEmployee,
};
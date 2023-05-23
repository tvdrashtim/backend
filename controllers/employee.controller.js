const { StatusCodes } = require("http-status-codes");
const EmployeeService = require('../services/employee.service');

const EmployeesignUp = async (req, res) => {
	try {
		const { f_name, l_name, email, password, technology, contact } = req.body;
		if (!f_name || !l_name || !email || !password || !technology || !contact) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Please provide all the required information',
			});
		}

		const employeeData = {
			f_name,
			l_name,
			email,
			password,
			technology,
			contact,
		};

		const savedEmployee = await EmployeeService.createEmployee(employeeData);

		res.status(StatusCodes.OK).json({
			message: 'Employee created successfully',
			employee: savedEmployee,
		});
	} catch (error) {
		if (error.message === 'Employee already exists') {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Employee already exists',
			});
		} else {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ error: 'Failed to save Employee' });
		}
	}
};

const imageUpload = (req, res) => {
	res.send("file upload")
}

module.exports = {
	EmployeesignUp,
	imageUpload
};

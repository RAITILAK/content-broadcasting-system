const { registerUser, loginUser } = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return errorResponse(res, 400, 'All fields are required: name, email, password, role');
    }

    if (!['principal', 'teacher'].includes(role)) {
      return errorResponse(res, 400, 'Role must be either principal or teacher');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters');
    }

    const user = await registerUser({ name, email, password, role });
    return successResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    return errorResponse(res, error.status || 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const result = await loginUser({ email, password });
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    return errorResponse(res, error.status || 500, error.message);
  }
};

module.exports = { register, login };
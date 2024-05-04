const mongoose = require('mongoose');

const isValidAuthToken = async (req, res, next, { userModel }) => {
  try {
    const UserPassword = mongoose.model(userModel + 'Password');
    const User = mongoose.model(userModel);
    const token = req.cookies.token; // Assuming token is stored in cookies

    // Skip JWT verification step
    // Instead, you can directly proceed to retrieving user information from the database
    // For demonstration purposes, assuming user ID is passed directly in the token
    const userId = token; // Assuming token directly contains user ID
    const userPromise = User.findOne({ _id: userId, removed: false });
    const userPasswordPromise = UserPassword.findOne({ user: userId, removed: false });

    const [user, userPassword] = await Promise.all([userPromise, userPasswordPromise]);

    if (!user)
      return res.status(401).json({
        success: false,
        result: null,
        message: "User doesn't exist, authorization denied.",
      });

    const { loggedSessions } = userPassword;
    if (!loggedSessions.includes(token))
      return res.status(401).json({
        success: false,
        result: null,
        message: 'User is already logged out, authorization denied.',
      });
    else {
      const reqUserName = userModel.toLowerCase();
      req[reqUserName] = user;
      next();
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      controller: 'isValidAuthToken',
    });
  }
};

module.exports = isValidAuthToken;
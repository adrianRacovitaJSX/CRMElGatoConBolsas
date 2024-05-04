const mongoose = require('mongoose');
const shortid = require('shortid');

const login = async (req, res, { userModel }) => {
  const UserPassword = mongoose.model(userModel + 'Password');
  const User = mongoose.model(userModel);
  const { userId, emailToken } = req.params;

  const userPasswordResult = await UserPassword.findOne({ user: userId, removed: false });

  if (!userPasswordResult)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const isMatch = emailToken === userPasswordResult.emailToken;
  if (
    !isMatch ||
    userPasswordResult.emailToken === undefined ||
    userPasswordResult.emailToken === null
  )
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid verify token',
    });

  // Remove JWT token generation

  // Update the response to remove token cookie
  res.status(200).json({
    success: true,
    result: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      photo: user.photo,
    },
    message: 'Email verified successfully',
  });
};

module.exports = login;

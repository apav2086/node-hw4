const User = require("../../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        const newUser = await User.create({
            email: email,
            password: hashed,
            token: token,
        });
        res.json(newUser);
        req.session.userToken = token;
        console.log(req.session);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
};

module.exports = signup;
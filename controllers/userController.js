const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    async signup(req, res) {
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
            req.session.userToken = token;
            console.log(req.session);
            res.json({ token });
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    },
     async login(req, res) {
        try {
            const { email, password } = req.body;
            const singleUser = await User.findOne({ email: email });
            if (!singleUser) {
                res.json({ message: 'No user found with that account' });
                return;
            }
           
            const validatingPW = await singleUser.checkPassword(password);
            if (!validatingPW) {
                res.json({ message: 'Wrong Password' });
                return;
            }
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            req.session.userToken = token;
            res.json({ token});

        } catch (err) {
            console.log(err);
            res.json(err);
        }
    },
     async logout(req, res) {
        if (req.session.userToken) {
            req.session.destroy(() => {
                res.json({ message: 'User was signed out' });
            })
        } else {
            res.json({message: 'User is already signed out'})
        }
    }
};

module.exports = userController;
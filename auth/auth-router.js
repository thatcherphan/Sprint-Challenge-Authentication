const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');
const secrets = require('../config/secrets.js');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: "Error registering this user"})
    })
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        const decoded = jwt.verify(token, secrets.jwtSecret)
        console.log(decoded)

        res.status(200).json({
          message: `Welcome ${user.username}`,
          token: token
        })
      } else {
        res.status(401).json({message: "Invalid credentials"})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: "Error loging in"})
    })
});

function generateToken(user) {
  const payload = {
    userid: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;

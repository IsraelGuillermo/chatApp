const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 4040;
const ws = require('ws');
const Message = require('./models/Message');
const fs = require('fs');
dotenv.config();

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const app = express();
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(cors());

// const allowCors = (fn) => async (req, res) => {
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET,OPTIONS,PATCH,DELETE,POST,PUT'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   );
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }
//   return await fn(req, res);
// };

// const handler = (req, res) => {
//   const d = new Date();
//   res.end(d.toString());
// };

// module.exports = allowCors(handler);
// async function getUserDataFromRequest(req) {
//   return new Promise((resolve, reject) => {
//     const token = req.cookies?.token;
//     if (token) {
//       jwt.verify(token, jwtSecret, {}, (err, userData) => {
//         if (err) throw err;
//         resolve(userData);
//       });
//     } else {
//       reject('No Token');
//     }
//   });
// }

function notifyAboutOnlinePeople() {
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username
        }))
      })
    );
  });
}

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;

      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (!passOk) {
      return res.status(400).json({
        message: 'Incorrect Username or Password.'
      });
    }
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { sameSite: 'none', secure: true }).json({
            id: foundUser._id
          });
        }
      );
    }
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  const userExist = await User.find({ username: req.body.username });
  if (userExist.length > 0)
    return res.status(400).send({ message: 'User already exists' });
  try {
    const createdUser = await User.create({
      username,
      password: hashedPassword
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({
            id: createdUser._id
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;

  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] }
  }).sort({ createdAt: 1 });

  res.json(messages);
});

app.get('/people', async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
);

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });
  //read username and ID from cookie connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieStr = cookies
      .split(';')
      .find((str) => str.startsWith('token='));

    if (tokenCookieStr) {
      const token = tokenCookieStr.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;

          const { userId, username } = userData;

          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());

    const { recipient, text, file } = messageData;
    let filename = null;

    if (file) {
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.' + ext;

      const path = __dirname + '/uploads/' + filename;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('File Saved', { filename });
      });
    }

    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null
      });
      console.log('File message created');
      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id
            })
          )
        );
    }
  });

  // notify client of users online
  notifyAboutOnlinePeople();
});

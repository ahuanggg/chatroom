const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// const signupPage = (req, res) => {
//   res.render('signup', { csrfToken: req.csrfToken() });
// };

// const WebSocketServer = require('ws').Server;
// const wss = new WebSocketServer({ port: 2220 });

// wss.on('connection');

const logout = (req, res) => {
  // wss.close();
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/chat' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  console.log(req.body.username);

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/chat' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const settingsPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.owner = `${req.body.owner}`;
  req.body.password = `${req.body.password}`;
  req.body.password2 = `${req.body.password2}`;

  // console.log(req.body.owner);
  console.log(req.body.password);
  // console.log(req.body.password2);
  // console.log(req.session.account);

  if (!req.body.owner || !req.body.password || !req.body.password2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.password !== req.body.password2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // return Account.AccountModel.findByOwner(req.body.owner, function (err, docs) {

  // });
  return Account.AccountModel.generateHash(req.body.password, (salt, hash) => {
    const accountData = {
      username: req.session.account.username,
      salt,
      password: hash,
    };

    // console.log(accountData);

    Account.AccountModel.deleteOne({ username: req.session.account.username }, (err) => {
      if (err) console.log(err);
      console.log('Successful deletion');
    });

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/chat' });
    });

    savePromise.catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  changePassword,
  settingsPage,
  loginPage,
  login,
  logout,
  getToken,
  signup,
};

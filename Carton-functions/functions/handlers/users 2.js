const { db } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config);
const link = require("react-router-dom").Link;

const { validateSignupData, validateLoginData } = require('../util/validators')

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        reenterPassword: req.body.reenterPassword,
        username: req.body.username,
        cartonID: req.body.cartonID
    };
  
    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);
  
    let token, userId;
    db.doc(`/users/${newUser.username}`).get()
      .then(doc => { // returns snapshot even if doc doesn't exist
        if(doc.exists) { // username already taken, return Bad Request
          return res.status(400).json({ username: 'this username is already taken'});
        }
        else { // valid username; create account 
          return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => { // if we get here, user has been created
        userId = data.user.uid;
        return data.user.getIdToken(); // return auth token to user so they can request more data
      })
      .then((idToken) => {
        token = idToken;
        const userCredentials = {
          email: newUser.email,
          username: newUser.username,
          cartonID: newUser.cartonID,
          userId
        };
        // create document for new user in users collection w/ username as doc id 
        db.doc(`/users/${newUser.username}`).set(userCredentials); 
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'Email is already in use'});
        }
        else if (err.code === 'auth/weak-password') {
          return res.status(400).json({ password: 'Password is too weak'});
        }
        else {
          return res.status(500).json({ error: err.code});
        }
        
      });
  }

  exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);
  
    
  
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.json({token});
      })
      .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password') {
          return res.status(403).json({ general: 'Wrong credentials, please try again'});
        }
        else if (err.code === 'auth/user-not-found') {
          return res.status(403).json({ general: 'Email not registered, please try again'});
        }
        else {
          return res.status(500).json({error: err.code});
        }
        
      })
  }
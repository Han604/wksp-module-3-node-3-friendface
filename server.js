'use strict';
const greetingsArray = ['Greetings', 'Aloha', 'What\'s up', 'Howdy', 'Hi', 'Hello', 'BEGONE'] // 7 different items in this array
const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');
let currentUser = null;


const PORT = process.env.PORT || 7000;
const handleHome = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return}
    let friend1Id = currentUser.friends[0]
    let friend2Id = currentUser.friends[1]
    let friend3Id = currentUser.friends[2]
    //console.log((Math.random()* 7)-1);
    res.render('pages/homepage.ejs', {
        title: 'Welcome to friendSPACE',
        currentUser:currentUser,
        user: currentUser,
        greetings: greetingsArray[Math.floor(Math.random()* 7)],
        users: users,
        friend1: users.find(user => user.id === friend1Id),
        friend2: users.find(user => user.id === friend2Id),
        friend3: users.find(user => user.id === friend3Id),
    });
};
const handleSignin = (req, res) => {
    if (currentUser) {res.redirect('/'); return}
    res.render('pages/signinPage', {
        title: 'FriendSPACE sign-in', 
        user: currentUser,
        greetings: greetingsArray,
        users: users,
        currentUser:currentUser
    })
}
const handleUser = (req, res) => {
    const id = req.params.id
    if (!currentUser) {res.redirect('/signin'); return}
    const friend1Id = users.find(user => user.id === id).friends[0];
    const friend2Id = users.find(user => user.id === id).friends[1];
    const friend3Id = users.find(user => user.id === id).friends[2];
    res.render(`pages/homepage.ejs`, {
        user:users.find(user => user.id === id),
        title: `${users.find(user => user.id === id).name}'s page`,
        greetings: greetingsArray[Math.floor(Math.random()* 7)],
        currentUser:currentUser,
        friend1: users.find(user => user.id === friend1Id),
        friend2: users.find(user => user.id === friend2Id),
        friend3: users.find(user => user.id === friend3Id)
    })
}
const handleName = (req, res) => {
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName) || null;
    if (currentUser) {res.redirect('/'); return;};
    res.redirect('/signin');

}


// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints
    .get('/', handleHome)
    .get('/signin', handleSignin)
    .get('/user/:id', handleUser)
    .get('/getname', handleName)
    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })

    .listen(PORT, () => console.log(`Listening on port ${PORT}`));


    
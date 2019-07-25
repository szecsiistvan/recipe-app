const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {testDB} = require('./fixtures/db');

const {sign, verify} = require('../src/token/tokenAuth');

beforeEach(testDB);

test('USER - POST - /users - OK cases', async () => {

    const userOne = {
        name:"Proba4",
        email: "proba5@proba.hu",
        password: "probajelszo"
    };


    const response = await request(app)
        .post('/users')
        .send(userOne)
        .expect(201);


    const user = await User.findOne({email: userOne.email});

    expect(user.name).toEqual(userOne.name);
    expect(user.email).toEqual(userOne.email);

    expect(user.role).toEqual("NORMAL");
});

test('USER - POST - /users - name required', async () => {

    const userOnePost = {
        name: "",
        role: "NORMAL",
        email: "c@cc.hu",
        password: "asjdfoisajfdioj"
    };

    await request(app)
        .post('/users')
        .send(userOnePost)
        .expect(400);
});

test('USER - POST - /users - wrong email format', async () => {

    const userTwoPost = {
        name: "Valaki",
        role: "NORMAL",
        email: "c@chu",
        password: "asjdfoisajfdioj"
    };

    await request(app)
        .post('/users')
        .send(userTwoPost)
        .expect(400);
});
test('USER - POST - /users - too short password', async () => {

    const userThreePost = {
        name: "Valaki",
        role: "NORMAL",
        email: "c@c.hu",
        password: "as"
    };

    await request(app)
        .post('/users')
        .send(userThreePost)
        .expect(400);
});

test('USER - POST - /users - email already taken', async () => {

    const userThreePost = {
        name: "Valaki",
        role: "NORMAL",
        email: "a@a.hu",
        password: "asasdfasfsdfsdf"
    };

    await request(app)
        .post('/users')
        .send(userThreePost)
        .expect(400);
});

test('USER - POST - /users/login - login, OK cases', async ()=>{

    const loginData = {
        email: 'a@a.hu',
        password: 'szarafidesz'
    };

    await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(200);
});

test('USER - POST - /users/login - login, no email', async ()=>{

    const loginData = {
        email: '',
        password: 'szarafidesz'
    };

     await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(400);
});

test('USER - POST - /users/login - login, wrong password', async ()=>{

    const loginData = {
        email: 'a@a.hu',
        password: 'szarafidesz0'
    };

    await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(400);
});

test('USER - POST - /users/logout - logout, OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    await request(app)
        .post('/users/logout')
        .set('Cookie', [`token=${token}`])
        .send()
        .expect(200);
});

test('USER - POST - /users/logout - logout - no token', async () => {

    await request(app)
        .post('/users/logout')
        .set('Cookie', [`token=`])
        .send()
        .expect(401);
});

test('USER - PUT - /users/me - modify, OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    await request(app)
        .put('/users/me')
        .set('Cookie', [`token=${token}`])
        .send({
            name: "mas nev",
            password: "masnevjelszava",
            email: "masemail@masemail.hu",
        })
        .expect(200);

    const myNewUser = await User.findOne({email: 'masemail@masemail.hu'});

    expect(myNewUser.name).toEqual("mas nev");
    expect(myNewUser.email).toEqual("masemail@masemail.hu");
    expect(myNewUser.role).toEqual("NORMAL");

});

test('USER - DELETE - /users/me/delete - delete user, OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    await request(app)
        .delete('/users/me')
        .set('Cookie', [`token=${token}`])
        .send()
        .expect(200);

    const myDeletedUser = await User.findOne({email: 'a@a.hu'});
    expect(myDeletedUser).toBeFalsy();
});

test('USER - DELETE - /users/me/delete - delete user, OK cases', async () => {

    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);

    const myDeletedUser = await User.findOne({email: 'a@a.hu'});
    expect(myDeletedUser).toBeTruthy();

});
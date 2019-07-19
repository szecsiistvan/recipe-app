const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {
    setupDatabase,
    userOne,
    userTwo,
    userThree,
    ingredientOne,
    ingredientTwo,
    ingredientThree,
    recipeOne,
    recipeTwo
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('This is just a test test', () => {

    console.log('success!!!')
});

test('USER - POST - /users - OK cases', async () => {

    const userOne = new User({
        name: "Valaki",
        role: "NORMAL",
        email: "c@cc.hu",
        password: "asjdfoisajfdioj"
    });

    await request(app)
        .post('/users')
        .send(userOne)
        .expect(201);

    const user = await User.findOne({email: userOne.email});

    expect(user.name).toEqual(userOne.name);
    expect(user.email).toEqual(userOne.email);

    expect(user.role).toEqual("NORMAL");
});

test('USER - POST - /users - name required', async () => {

    const userOnePost = new User({
        name: "",
        role: "NORMAL",
        email: "c@cc.hu",
        password: "asjdfoisajfdioj"
    });

    await request(app)
        .post('/users')
        .send(userOnePost)
        .expect(400);
});

test('USER - POST - /users - wrong email format', async () => {

    const userTwoPost = new User({
        name: "Valaki",
        role: "NORMAL",
        email: "c@chu",
        password: "asjdfoisajfdioj"
    });

    await request(app)
        .post('/users')
        .send(userTwoPost)
        .expect(400);
});
test('USER - POST - /users - too short password', async () => {

    const userThreePost = new User({
        name: "Valaki",
        role: "NORMAL",
        email: "c@c.hu",
        password: "as"
    });

    await request(app)
        .post('/users')
        .send(userThreePost)
        .expect(400);

});

test('USER - POST - /users - email already taken', async () => {

    const userThreePost = new User({
        name: "Valaki",
        role: "NORMAL",
        email: "a@a.hu",
        password: "asasdfasfsdfsdf"
    });

    await request(app)
        .post('/users')
        .send(userThreePost)
        .expect(400);
});
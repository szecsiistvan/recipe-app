const request = require('supertest');
const app = require('../src/app');
const Ingredient = require('../src/models/ingredient');
const User = require('../src/models/user');
const {testDB, ingredientOneId, ingredientTwoId, ingredientThreeId} = require('./fixtures/db');
const {sign, verify} = require('../src/token/tokenAuth');

beforeEach(testDB);

test('INGREDIENT - POST - /ingredients - OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    const myIngredient = {
        name: "valami hozzavalo"
    };

    await request(app)
        .post('/ingredients')
        .set('Cookie', [`token=${token}`])
        .send(myIngredient)
        .expect(201)
});

test('INGREDIENT - POST - /ingredients - unauthorized /bad token/', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    const myIngredient = {
        name: "valami hozzavalo"
    }

    await request(app)
        .post('/ingredients')
        .set('Cookie', [`token=${token}0`])
        .send(myIngredient)
        .expect(401)
});


test('INGREDIENT - POST - /ingredients - not unique', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    const myIngredient = {
        name: "third ingredient"
    };

    await request(app)
        .post('/ingredients')
        .set('Cookie', [`token=${token}`])
        .send(myIngredient)
        .expect(400)
});

test('INGREDIENT - PUT - /ingredients - OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    const myIngredient = {
        name: "modified ingredient",
        id:ingredientOneId
    };

    await request(app)
        .put('/ingredients')
        .set('Cookie', [`token=${token}`])
        .send(myIngredient)
        .expect(200)

    const modifiedIngredient = await Ingredient.findById(ingredientOneId);
    expect(modifiedIngredient.name).toBe("modified ingredient");
});

test('INGREDIENT - DELETE - /ingredients - OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});

    const token = sign(myUser._id);

    const myIngredient = {
        id:ingredientOneId
    };

    await request(app)
        .delete('/ingredients')
        .set('Cookie', [`token=${token}`])
        .send(myIngredient)
        .expect(200);

    const nullIngredient = await Ingredient.findById(ingredientOneId);
    expect(nullIngredient).toBeFalsy();

    const allIngredient = await Ingredient.find({});

    expect(allIngredient.length).toEqual(2)
});
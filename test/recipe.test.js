const request = require('supertest');
const app = require('../src/app');
const Ingredient = require('../src/models/ingredient');
const User = require('../src/models/user');
const Recipe = require('../src/models/recipe');
const {testDB, userOneID, userTwoID, userThreeID, ingredientOneId, ingredientTwoId, ingredientThreeId,recipeOneId,recipeTwoId,recipeThreeId} = require('./fixtures/db');
const {sign, verify} = require('../src/token/tokenAuth');


beforeEach(testDB);

test('RECIPE - POST - create new - OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});
    const token = sign(myUser._id);

    const myRecipe = {
        name: "my first test recipe",
        description: "stir dasfasfsfddffdfdf",
        ingredients: [{
            "ingredient": {
                "id": ingredientOneId,
                "quantity": 1
            },
        }, {
            "ingredient": {
                "id": ingredientTwoId,
                "quantity": 2
            },
        }],
        prepTime: 3,
        cookingSteps: ["one", "two", "three"],
        owner: userOneID,
        tags: ["egy", "ketto", "harom"
        ]
    };

    await request(app)
        .post('/recipes')
        .set('Cookie', [`token=${token}`])
        .send(myRecipe)
        .expect(201);
});

test('RECIPE - DELETE - delete one- OK cases', async () => {

    const myUser = await User.findOne({email: 'a@a.hu'});
    const token = sign(myUser._id);

    const recipeToDelete = {
        id: recipeThreeId
    }

    await request(app)
        .delete('/recipes')
        .set('Cookie', [`token=${token}`])
        .send(recipeToDelete)
        .expect(200);

});
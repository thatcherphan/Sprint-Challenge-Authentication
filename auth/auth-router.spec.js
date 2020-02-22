const db = require('../database/dbConfig.js');
const request = require('supertest');
const server = require('../api/server.js');

describe('auth-router.js', () => {
    beforeEach(async() => {
        await db('users')
            .truncate();
    })

    describe('POST to /api/auth/register', () => {
        it ('responds with 201 OK', async() => {
            await request(server)
                .post('/api/auth/register')
                .send({ username: "Checkers", password: "Iam5yearsold"})
                .expect(201);
        });

        it('responds with JSON', async() => {
            await request(server)
                .post('/api/auth/register')
                .send({username: "Mimi", password: "Iam1yearold"})
                .expect('Content-Type', /json/)
        })
    })

    describe ("POSE to /api/auth/login", () => {
        it('responds with 200 OK', async() => {
            await request(server)
                .post('/api/auth/register')
                .send({ username: "Bobby", password: "Iam2yearsold"})

            await request(server)
                    .post('/api/auth/login')
                    .send({username: "Bobby", password: "Iam2yearsold"})
                    .expect(200);
        })

        it("responds with JSON", async() => {
            await request(server)
                .post('/api/auth/register')
                .send({ username: "Checkersthecat", password: "Iamhealthy"})
            
            await request(server)
                .post('/api/auth/login')
                .send({ username: "Checkersthecat", password: "Iamhealthy"})
                .expect('Content-Type', /json/i);
        })
    })

})


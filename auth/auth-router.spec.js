const request = require("supertest");
const server = require("../api/server.js");
const db = require("../database/dbConfig");

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("POST /api/auth/register", () => {
    it("should return 201 status and return the correct username for register", () => {
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "ayormeday",
          password: "1234"
        })
        .set("Content-Type", "application/json")
        .then(res => {
          expect(res.status).toBe(201);
          expect(res.body.username).toBe("ayormeday");
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 201 status and return the correct username for login", () => {
      return request(server)
        .post("/api/auth/login")
        .send({
          username: "ayormeday",
          password: "1234"
        })
        .set("Content-Type", "application/json")
        .then(res => {
          expect(res.status).toBe(201);
          expect(res.body.username).toBe("ayormeday");
        });
    });
  });

  describe('POST /api/auth/login', () => {
      it('user cant login without credentials', () => {
        return request(server)
          .post('/api/auth/login')
          .send({ username: "ayormeday" })
          .expect(401);
      });
    });
});
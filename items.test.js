process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let item = { name: "Pickles", price: 1.23 };

beforeEach(function () {
  items.push(item);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual([item]);
  });
});

describe("POST /items", function () {
  test("Creates a new item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({ name: "orange", price: 2.23 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      added: {
        name: "orange",
        price: 2.23,
      },
    });
  });
});

describe("GET /items/:name", function () {
  test("Gets a item", async function () {
    const resp = await request(app).get(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({
      name: "Pickles",
      price: 1.23,
    });
  });
  test("Responds with 404 if item is invalid", async function () {
    const resp = await request(app).patch(`/items/lakewater`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", function () {
  test("Updates a single item", async function () {
    const resp = await request(app).patch(`/items/${item.name}`).send({
      name: "Cupcake",
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: { name: "Cupcake", price: 1.23 } });
  });

  test("Responds with 404 if item is invalid", async function () {
    const resp = await request(app).patch(`/items/lakewater`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", function () {
  test("Deletes a single a item", async function () {
    const resp = await request(app).delete(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 if item is invalid", async function () {
    const resp = await request(app).patch(`/items/lakewater`);
    expect(resp.statusCode).toBe(404);
  });
});

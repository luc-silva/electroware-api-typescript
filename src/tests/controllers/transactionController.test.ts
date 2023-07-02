import supertest from "supertest";

describe("Shopping Cart Controller", () => {
  const endpoint = "http://localhost:6060/api/transaction";

  test("Should not create a transaction instance without token", async () => {
    const response = await supertest(endpoint).post("/").send({});
    expect(response.status).toBe(401);
  });
});

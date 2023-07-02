import supertest from "supertest";

describe("Shopping Cart Controller", () => {
  const endpoint = "http://localhost:6060/api/shoppingcart";

  test("Should not return user shopping cart items without token", async () => {
    const response = await supertest(endpoint).get("/");
    expect(response.status).toBe(401);
  });

  test("Should not return a user shopping cart item without token", async () => {
    const instance_id = "6452d9d185b1cde0217c91ba";
    const response = await supertest(endpoint).get(`/${instance_id}`);

    expect(response.status).toBe(401);
  });

  test("Should not create user shopping cart item without token", async () => {
    const response = await supertest(endpoint).post("/").send({});

    expect(response.status).toBe(401);
  });

  test("Should not delete user shopping cart item without token", async () => {
    const instance_id = "6452d9d185b1cde0217c91ba";
    const response = await supertest(endpoint).delete(`/${instance_id}`);

    expect(response.status).toBe(401);
  });
});

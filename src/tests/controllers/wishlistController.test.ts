import supertest from "supertest";

describe("Whislist Controller", () => {
  const endpoint = "http://localhost:6060/api/wishlist";

  test("Should not create a wishilist item without token", async () => {
    const response = await supertest(endpoint).post("/").send({});
    expect(response.status).toBe(401);
  });

  test("Should not delete a wishilist item without token", async () => {
    const wishlist_item_id = "";
    const response = await supertest(endpoint)
      .post(`/${wishlist_item_id}`)
      .send({});
    expect(response.status).toBe(401);
  });
});

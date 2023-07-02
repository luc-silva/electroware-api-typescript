import supertest from "supertest";

describe("Whislist Controller", () => {
  const endpoint = "http://localhost:6060/api/collection";

  test("Should return a array of products if public", async () => {
    const collection_id = "64a1dfb443077e35deb4eafc";

    const response = await supertest(endpoint).get(
      `/${collection_id}/products`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("Should not return products if private", async () => {
    const collection_id = "64a1df9143077e35deb4eacb";

    const response = await supertest(endpoint).get(
      `/${collection_id}/products`
    );

    expect(response.status).toBe(200);
  });

  test("Should not create a collection item without token", async () => {
    const response = await supertest(endpoint).post(`/`);
    expect(response.status).toBe(401);
  });
  test("Should not delete a collection item without token", async () => {
    const collection_id = "64a1df9143077e35deb4eacb";

    const response = await supertest(endpoint)
      .delete(`/${collection_id}`)
      .send({});
    expect(response.status).toBe(401);
  });
  test("Should not update a collection item without token", async () => {
    const collection_id = "64a1df9143077e35deb4eacb";

    const response = await supertest(endpoint)
      .put(`/${collection_id}`)
      .send({});
    expect(response.status).toBe(401);
  });
});

import supertest from "supertest";

describe("Review Controller", () => {
  const endpoint = "http://localhost:6060/api/review";

  test("Should return product details with given ID", async () => {
    const review_id = "64540a2d67e649f92c5e284d";
    const response = await supertest(endpoint).get(`/${review_id}`);

    expect(response.status).toBe(200);
  });

  test("Should not accept request without token", async () => {
    const review_id = "64540a2d67e649f92c5e284d";
    const response = await supertest(endpoint).post(`/ `);

    expect(response.status).toBe(401);
  });

  test("Should not delete review without token", async () => {
    const review_id = "64540a2d67e649f92c5e284d";
    const response = await supertest(endpoint).delete(`/${review_id}`);

    expect(response.status).toBe(401);
  });

  test("Should not update review without token", async () => {
    const review_id = "64540a2d67e649f92c5e284d";
    const response = await supertest(endpoint).patch(`/${review_id}`);

    expect(response.status).toBe(401);
  });
});

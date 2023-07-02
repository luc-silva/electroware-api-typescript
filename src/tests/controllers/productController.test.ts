import supertest from "supertest";

describe("Product Controller", () => {
  const endpoint = "http://localhost:6060/api/product";

  test("Recent products endpoint should return an array even if empty", async () => {
    const response = await supertest(endpoint).get("/");

    expect(response.body).toBeInstanceOf(Array);
  });

  test("Products on sale endpoint should return an array even if empty", async () => {
    const response = await supertest(endpoint).get(`/discount`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("Should return product details with given ID", async () => {
    const product_id = "643dd08fac5d12188de2a85e";
    const response = await supertest(endpoint).get(`/${product_id}`);

    expect(response.status).toBe(200);
  });

  test("Should return array of products review even if empty", async () => {
    const product_id = "643dd08fac5d12188de2a85e";

    const response = await supertest(endpoint).get(`/${product_id}/reviews`);

    expect(response.body).toBeInstanceOf(Array);
  });
});

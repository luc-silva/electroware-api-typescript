import supertest from "supertest";

describe("Category Controller", () => {
  const endpoint = "http://localhost:6060/api/category";

  test("Return correctly an array of categories", async () => {
    const response = await supertest(endpoint).get("/");

    expect(response.body).toBeInstanceOf(Array);
  });

  test("Should not return a category with invalid id", async () => {
    const category_id = "fake_category_id";
    const response = await supertest(endpoint).get(`/${category_id}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Id inválido." });
  });

  test("Return correctly an array of products from a categories", async () => {
    const category_id = "643992c0f653ecc0c147b450";
    const response = await supertest(endpoint).get(`/${category_id}/products`);

    expect(response.body).toBeInstanceOf(Array);
  });
});

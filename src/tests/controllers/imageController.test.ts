import supertest from "supertest";

describe("Image Controller - User: ", () => {
  const endpoint = "http://localhost:6060/api/image";

  test("Upload should return auth error if no token has been provided", async () => {
    const response = await supertest(endpoint).post("/upload");

    expect(response.status).toBe(401);
  });

  test("Should get user image with given id", async () => {
    const user_id = "6439922cf653ecc0c147b448";
    const response = await supertest(endpoint).get(`/user/${user_id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ _id: {}, data: {} });
  });

  test("Should get product image with given id", async () => {
    const product_id = "643dd08fac5d12188de2a85e";
    const response = await supertest(endpoint).get(`/product/${product_id}`);

    expect(response.status).toBe(200);
  });
});

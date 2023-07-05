import supertest from "supertest";

describe("User Controller - Login: ", () => {
  const endpoint = "http://localhost:6060/api/user";

  test("Server should return 400 if no email provided", async () => {
    const data = { email: "", password: "123" };

    const response = await supertest(endpoint).post("/login").send(data);

    expect(response.status).toBe(400);
  });

  test("Server should return 400 if no password provided", async () => {
    const data = { email: "b.gates@user.com", password: "" };

    const response = await supertest(endpoint).post("/login").send(data);

    expect(response.status).toBe(400);
  });

  test("Server should return 401 if wrong password", async () => {
    const data = { email: "b.gates@user.com", password: "fake_password" };

    const response = await supertest(endpoint).post("/login").send(data);

    expect(response.status).toBe(401);
  });

  test("Server should return 404 if a user with given email has not been found", async () => {
    const data = { email: "fake.email@a.com", password: "12345678" };

    const response = await supertest(endpoint).post("/login").send(data);

    expect(response.status).toBe(404);
  });
});

describe("User Controller - Register: ", () => {
  const endpoint = "http://localhost:6060/api/user";

  test("Server should return 400 if email has already been used", async () => {
    const data = {
      email: "b.gates@user.com",
      name: { first: "Someone", last: "" },
      location: { country: "Tamriel", state: "Skyrim" },
      password: "12345678",
    };

    const response = await supertest(endpoint).post("/register").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "Uma conta já foi criada com esse email.",
    });
  });

  test("Server should not create a user without email", async () => {
    const data = { email: "", password: "123" };

    const response = await supertest(endpoint).post("/register").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Campo email inválido." }); //this should be a message object in the future
  });

  test("Server should not create a user without first name", async () => {
    const data = { email: "fake_email@user.com", password: "12345678" };

    const response = await supertest(endpoint).post("/register").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Campo nome inválido." });
  });

  test("Server should not create a user without password", async () => {
    const data = { email: "fake_email@user.com", password: "" };

    const response = await supertest(endpoint).post("/register").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Campo senha inválido." });
  });
});

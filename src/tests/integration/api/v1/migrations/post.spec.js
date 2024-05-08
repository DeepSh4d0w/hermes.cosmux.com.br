import database from "src/infra/database";

async function cleanDatabase() {
    await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

const MIGRATIONS_URL = "http://localhost:3000/api/v1/migrations";

test("POST to /api/v1/migrations shuld return 200", async () => {
    const first_response = await fetch(MIGRATIONS_URL, {
        method: "POST",
    });

    const first_response_body = await first_response.json();

    expect(first_response.status).toBe(201);
    expect(Array.isArray(first_response_body)).toBe(true);
    expect(first_response_body.length).toBeGreaterThan(0);

    const second_response = await fetch(MIGRATIONS_URL, {
        method: "POST",
    });

    const second_response_body = await second_response.json();

    expect(second_response.status).toBe(200);
    expect(Array.isArray(second_response_body)).toBe(true);
    expect(second_response_body.length).toBe(0);
});

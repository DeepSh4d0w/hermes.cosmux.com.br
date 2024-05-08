import { Client } from "pg";

function getSSLValues() {
    const certificateAuthority = process.env.PGCA;

    if (certificateAuthority) {
        return {
            ca: certificateAuthority,
        };
    }

    return process.env.NODE_ENV === "production" ? true : false;
}

async function getNewClient() {
    const {
        POSTGRES_HOST: host,
        POSTGRES_PORT: port,
        POSTGRES_DB: database,
        POSTGRES_USER: user,
        POSTGRES_PASSWORD: password,
    } = process.env;

    const client = new Client({
        host,
        port,
        user,
        database,
        password,
        ssl: getSSLValues(),
    });

    await client.connect();
    return client;
}

async function query(queryObject) {
    let client;

    try {
        client = await getNewClient();

        const result = await client.query(queryObject);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.end();
    }
}

export default {
    query,
    getNewClient,
};

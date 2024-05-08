import database from "src/infra/database";

async function status(_, response) {
    const updated_at = new Date().toISOString();

    const version = (await database.query("SHOW server_version;")).rows[0]
        .server_version;

    const max_connections = parseInt(
        (await database.query("SHOW max_connections;")).rows[0].max_connections
    );
    const opened_connections = (
        await database.query({
            text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
            values: [process.env.POSTGRES_DB],
        })
    ).rows[0].count;

    response.status(200).json({
        updated_at,
        dependencies: {
            database: {
                version,
                max_connections,
                opened_connections,
            },
        },
    });
}

export default status;

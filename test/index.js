const r = require("..");

const environment = new r.Environment();
const redactClient = new r.RedactClient({
    token: environment.get("token"),
    intents: []
});

redactClient.login();
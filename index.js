import server from './server/express.js'
import conectToDatabase from './server/database.js';
import dotenv from "dotenv";
dotenv.config()

const port = 8080;

server.listen(port, () => console.log(`Rodando na porta ${port}!`))

conectToDatabase()
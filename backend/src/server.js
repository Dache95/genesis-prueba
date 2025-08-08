import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'

const port = process.env.port || 3000
app.listen(port, () => console.log(`La api esta corriendo en  http:/localhost:${port}`) )
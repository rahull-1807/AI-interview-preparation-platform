require("dotenv").config()
if (process.env.NODE_ENV === 'production') {
    for (const name of ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_GENAI_API_KEY']) {
        if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`)
    }
}
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const port = Number(process.env.PORT) || 3000


connectToDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch(() => {
    console.error('Database connection failed. Check MONGO_URI and the Atlas network access list.')
    process.exitCode = 1
})


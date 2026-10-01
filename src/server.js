import dotenv from 'dotenv'
import app from './app.js'
import { connectDb } from './config/db.js'

const PORT = process.env.PORT || 5000

dotenv.config()

const startServer = async () => {
    try {
        await connectDb()
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1)
    }
}

startServer()
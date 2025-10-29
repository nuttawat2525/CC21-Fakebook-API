import express from 'express'
import authRoute from './routes/auth.route.js'
import errorMiddleware from './middlewares/error.middleware.js'
import notFoundMiddleware from './middlewares/notFound.middleware.js'
import shutdownUtil from './utils/shutdown.util.js'



const app = express()
app.use(express.json())


app.use('/api/auth', authRoute)
app.use('/api/post', (req,res) => { res.send('post service')})
app.use('/api/comment', (req,res) => { res.send('comment service')})
app.use('/api/like', (req,res) => { res.send('like service')})


app.use(notFoundMiddleware)
app.use(errorMiddleware)

// prisma.$executeRaw`SHOW TABLES`.then(console.log)

// Listen for termination signals
process.on('SIGINT', () => shutdownUtil('SIGINT'))  // shutdown โดยกด Ctrl + C
process.on('SIGTERM', () => shutdownUtil('SIGTERM'))  // normal kill process
process.on('SIGBREAK', () => shutdownUtil('SIGBREAK'))  // Ctrl + break

// Catch unhandled errors
process.on("uncaughtException", ()=>  shutdownUtil('uncaughtException'))
process.on("unhandledRejection", ()=> shutdownUtil('unhandledRejection'))


export default app
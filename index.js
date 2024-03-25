import 'dotenv/config'
import './database/connectdb.js'
import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"

import authRouter from './routes/auth.route.js'
import linkRouter from './routes/link.route.js'
import redirectRouter from './routes/redirect.route.js'

const app = express()

//con esta tecnica no entran a los controladores
const whiteList = [process.env.ORIGIN1]

app.use(cors({
    origin: function(origin, callback){
        if(whiteList.includes(origin)) {
            return callback(null, origin)
        }
        return callback(
            "Erro de CORS origin " + origin + " No autorizado"
        )
    }
}))

app.use(express.json())
app.use(cookieParser());

// ejemplo back redirect (opcional)
app.use("/", redirectRouter)


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("http://localhost:" + PORT))
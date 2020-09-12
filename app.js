const  express = require( 'express') //получаем экспресс
const config = require('config') //получаем config
const mongoose = require('mongoose')



const app = express() //результат работы экспресс, наш будущий сервер

app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

async function start() {// обёртка чтобы пользоваться синтаксисом sync await
    try {
        await mongoose.connect(config.get('mongoURI'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true

        }) //пишем await чтобы подождать пока промис завершится

        console.log("%c 🇦🇸: PORT ", "font-size:16px;background-color:#65ee9d;color:black;", `App started at port ${PORT}...`)

        
    } catch (error) {
    console.log("%c 🥄: start -> error ", "font-size:16px;background-color:#d4133f;color:white;", error.message)
    process.exit(1)
        
    }
    
}


start()

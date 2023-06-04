import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoute from './routes/auth'
import roomsRoute from './routes/rooms'
import mongoose from 'mongoose';
import "dotenv/config"
import { ListenAuctions, apiKeyMiddleware } from './utils/helper-functions';

const app = express();



const port = process.env.PORT
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cors());
app.use(helmet());
app.use(apiKeyMiddleware)

app.use('/auth', authRoute)
app.use('/rooms', roomsRoute)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Hello World');
});
mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log(`mongoDB connected`)
    ListenAuctions()
}).catch((err) => console.log(err.message))


app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
    
})  



// console.log(Date.now())
// console.log(Date.now() + 3600)



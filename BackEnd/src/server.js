import dotenv from 'dotenv'
import app from './app.js'
import logger from './middlewares/logger.Middleware.js';
import router from './routes/auth.routes.js';
dotenv.config({path : new URL('../.env', import.meta.url)})


const port = process.env.PORT ;
app.use(logger)

app.get('/', (req, res) =>{
  res.send('You are on the homepage.')
})


app.use(router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


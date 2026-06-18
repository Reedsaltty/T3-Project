import dotenv from 'dotenv'
import app from './app.js'
dotenv.config({path : new URL('../.env', import.meta.url)})

app.get('/', (req, res) =>{
  res.send({"Location" : "Root page"})
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


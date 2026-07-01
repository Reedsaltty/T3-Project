import dotenv from 'dotenv'
import app from './app.js'
dotenv.config({path : new URL('../.env', import.meta.url)})

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

app.get('/', (req, res) =>{
  res.send({"Location" : "Root page"})
})



const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log('Server listening?', server.listening);
  console.log('Server address:', server.address());
});



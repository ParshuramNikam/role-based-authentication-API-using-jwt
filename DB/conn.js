import envVars from 'dotenv';
envVars.config();
import mongoose  from "mongoose";

const conn = () =>{
    mongoose.connect( process.env.CONN_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then( ()=> console.log("Successfully connect to MongoDB."))
    .catch( (err)=>  {
        console.error("Connection error", err);
        process.exit();
      });
}

export default conn;
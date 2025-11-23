import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"
dotenv.config()
const port = process.env.PORT||8000;

connectDB()
.then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    }); 
}


)

.catch((error)=>{
    console.log( error)
})
const exitHandler = () => {
  if (server) {
    server.close(() => {
      
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {

  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {

  if (server) {
    server.close();
  }
});
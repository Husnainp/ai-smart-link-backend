import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"
dotenv.config()
const port = 8000;

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
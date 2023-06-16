
const express = require("express");
const dotenv = require("dotenv");

const morgan = require("morgan");
const cors = require("cors");
const Fraazo = require("./src/models/frazomodels");
const cookieParser = require("cookie-parser");


const frazoController=require("./src/controllers/frazoController")
//config .evn to ./src/config/config.evv
dotenv.config();



const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());





  const connectDB = require("./src/config/db");
  connectDB();
  app.use(morgan("dev"));
  //Morgan give information each reequest
  //cors allow the react localhost at port 3000 without any problem

// app.use("/api", require("./src/routes/authroute"));
app.use("/fraazo", frazoController);
app.get("/search",async(req,res)=>{
  try{

  const {name}=req.query

  const agg=[
      {
          $search:{
              autocomplete:{
                  query:name,
                  path:"name",
                  fuzzy:{
                      maxEdits:2
                  }
              }
          }
         
      },
      {
          $limit:5
      },
      {
          $project:{
              _id:1,
              name:1,
              image:1,
              benifit:1,
              weight:1,
              prize:1,
              old_prize:1


          }
      }
  ]
const response= await Fraazo.aggregate(agg)

return res.status(200).json(response)

  
  }
  catch(err){
return res.json([])
  }
})

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

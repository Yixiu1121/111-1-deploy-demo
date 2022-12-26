import path from "path";
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";
import User from './models/user.js'
import cors from 'cors'

const app = express();
// init middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
app.use(bodyParser.json());
const router = express.Router()
app.use('/api', router)
// define routes
app.get("/api", (req, res) => {
  // send the request back to the client
  console.log("GET /api");
  res.send({ message: "Hello from the server!" }).status(200);
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// define server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

// hw6

var Name = ""
var Subject = ""
var Score = ""
var data = ""
router.post('/card', async(req, res) => {
    // console.log(req.body.name);
    Name = req.body.name
    Subject = req.body.subject
    Score  = req.body.score
    var m = await saveUser(Name, Subject, Score)
    res.json({
        message: m+" "+Name+" "+Subject+" "+Score,
        card:'card'
    })
   });
router.get('/cards',  async(req, res) => {
    var str = req.query.queryString
    var type = req.query.type
    
    if (User.find({'name':str})||(User.find({'subject':str}))){
        console.log("exist")
        console.log("搜尋字串",type,str);
        var d = await queryData(type,str)
        if (d.length === 0){
            console.log("not")
            res.json({
                messages: [str+" not found"]
            })
        }
        else {res.json({
            messages: d
    })}
    }});
router.delete('/cards',(req,res) => {
    if (req.method=="DELETE"){
        console.log(req.method)
        deleteDB()
        res.json({
            message: "Database cleared"
        })
    }
})

//Database
dotenv.config();
mongoose
    .connect(
        process.env.MONGO_URL,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => console.log("mongo db connection created"))

const saveUser = async ( name, subject, score ) => {
    const existing = await User.findOne({$and:[{"name":name},{"subject":subject}]});
    var msg = ""
    if (existing) {
        // console.log(User.findOne({$and:[{"name":name},{"subject":subject}]}))
        console.log(existing)
        await User.findOneAndUpdate({$and:[{"name":name},{"subject":subject}]},{$set:{"score": score}})
        msg = "update"
        return msg
    };  
    if (!existing){
        try {
            const newUser = await new User({ name, subject, score });
            console.log("Created user", newUser);
            newUser.save();
            msg = "Add"
            return msg
        } 
        catch (e) { 
            throw new Error("User creation error: " + e); 
        }
    }
   };
const deleteDB = async () => {
    try {
        await User.deleteMany({});
        console.log("Database deleted");
    } 
    catch (e) { 
        throw new Error("Database deletion failed"); 
    }
   };

const queryData = async (type,queryString) => {
    if (type == 'name'){
        const data = await User.find({'name':queryString},{_id:0,name:1,subject:1,score:1})
        const newArr = data.map((n) => (
            ("Found card with name : "+n.name+" "+n.subject+" "+n.score)
        ))
        console.log(newArr)
        return newArr
    }
    if (type == 'subject'){
        const data = await User.find({'subject':queryString},{_id:0,name:1,subject:1,score:1})
        const newArr = data.map((n) => (
            ("Found card with subject : "+n.name+" "+n.subject+" "+n.score)
        ))
        console.log(newArr)
        return newArr
    }}
   
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", async () => {
    // await deleteDB();
    await saveUser("Anna", "Subject", 12)
    await saveUser("mic", "Subject", 100)
   });
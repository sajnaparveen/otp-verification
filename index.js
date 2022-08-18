const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose=require('mongoose')
const app=express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
require('dotenv').config()
const port = process.env.PORT || 7000;
const userrouter=require('./routes/user.route');
mongoose.connect(process.env.dburl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data => {
    console.log("database connected");
}).catch(err => {
    console.log(err.message);
    process.exit(1);
})
app.use('/api/v1/user',userrouter); 




app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})
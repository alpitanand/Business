const express = require('express');
const path = require('path');
var app = express();


// Configuiring the port
var port = process.env.PORT || 3000;


// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));






//Listining
app.listen(port,()=>{
    console.log("Server is up");
})
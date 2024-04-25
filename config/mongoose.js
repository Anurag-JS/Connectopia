const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://anuragv8269:anuragconnectopia@cluster0.jqrqohk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error",console.error.bind(console ,'Error connecting to MongoDB') );

db.once('open',()=>{
    console.log('MongoDB Connected Successfully');
})

module.exports = db;

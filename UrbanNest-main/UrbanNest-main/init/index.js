const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/hotelproject");
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6730da9d8df1248b7a36710c'}));
    await Listing.insertMany(initData.data);
    console.log(initData.data);
    console.log("Data base has been initialised with sample data");
}

initDB();


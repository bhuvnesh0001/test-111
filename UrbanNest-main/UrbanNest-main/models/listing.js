const mongoose = require("mongoose");
const review = require("./review");

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    category:{
        type:String,
        enum:["Beachfront","Rooms","Mansion","MountainCity","Castle","Pool","Camping","Farms","Arctic"],
        required:true,
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

//post-middleware to delete all reviews of a listing when the listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing  = mongoose.model("Listing",listingSchema);
module.exports = Listing; 
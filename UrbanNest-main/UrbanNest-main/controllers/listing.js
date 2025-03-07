const Listing = require("../models/listing.js")

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});    
}

module.exports.showCategory = async(req,res)=>{
    let {filter} = req.params;
    const validCategories = ["Beachfront", "Rooms", "Mansion", "MountainCity", "Castle", "Pool", "Camping", "Farms", "Arctic"];
    if (!validCategories.includes(filter)) {
        req.flash("error", "Invalid category selected.");
        return res.redirect("/listings");  
    }
    let currList = await Listing.find({category:filter});
    if(currList.length==0){
        req.flash("error","No listing in this category");
        return res.redirect("/listings"); 
    }
    res.render("listings/index.ejs",{allListings:currList});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.createListing = async (req, res, next) => {
    const { category } = req.body.listing;
    const validCategories = ["Beachfront", "Rooms", "Mansion", "MountainCity", "Castle", "Pool", "Camping", "Farms", "Arctic"];
    if (!validCategories.includes(category)) {
        req.flash("error", "Invalid category selected.");
        return res.redirect("/listings/new");  
    }
    let url = req.file ? req.file.path : null;
    let filename = req.file ? req.file.filename : null;
    let newListing = new Listing(req.body.listing);
    if (url && filename) {
        newListing.image = { url, filename };
    }
    newListing.owner = req.user._id;
    try {
        await newListing.save();
        req.flash("success", "New listing added!");
        res.redirect("/listings");
    } catch (error) {
        next(error);  
    }
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).
    populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).
    populate("owner");
    if(!listing){
        req.flash("error","listing doesn't exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing doesn't exist!");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("upload","upload/w_200");

    res.render("listings/edit.ejs",{listing,originalImage});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let newListing = req.body.listing;
    if(typeof req.file!== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url,filename};
    }
    await Listing.findByIdAndUpdate(id,newListing);
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}

module.exports.searchListing = async(req,res)=>{
    const searchQuery = req.body.searchQuery;
    if(!searchQuery||searchQuery.length==0){
        return res.redirect("/listings");
    }
    const currCity= searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
    let currList = await Listing.find({location:currCity});
    if(currList.length==0){
        req.flash("error","No City found!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings:currList});

}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set(path.join(__dirname, "views")); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
    await mongoose.connect(MONGO_URL);
}


main().then(res => { console.log("connected to db") }).catch(err => { console.log(err) });


app.get("/", (req, res) => {
    res.send("I am root");
}) 


// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


//Index route
app.get("/listings", async (req, res) => {
    const allListings = await listing.find();
    res.render("./listings/index.ejs", { allListings });
}); 

//New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});


//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("./listings/show.ejs", { Listing });
});


//Create route
app.post("/listings",async (req, res) => {
    // let { title: newtitle, description: newdescription, image: newimage, price: newprice,location: newlocation,country: newcountry } = req.body;
    // let listings = req.body.listings;
    const newListing = new listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");  
})


//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const editlisting = await listing.findById(id);
    res.render("./listings/edit.ejs", { editlisting })
});

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


app.listen(8080, (req, res) => {
    console.log("server is listening to port 8080");
});

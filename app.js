const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing=require('./models/listing');
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

app.use(express.urlencoded({extended:true}));
const mongo_url="mongodb://127.0.0.1:27017/majorproject";
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("connected Database");
}).catch((err) =>{
    console.log(err);
});


async function main(){
    await mongoose.connect(mongo_url);
}



app.get("/",(req,res)=>{
    res.send("Hii I am Get");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get("/listing", async(req,res)=>{
    const list=await Listing.find({});
    res.render("listings/index.ejs",{list});
});

app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post("/listing/newsave",async(req,res)=>{
   const data = new Listing(req.body.listing);
   await data.save();
   res.redirect("/listing");
});

app.get("/show/:id",async(req,res)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.get("/listing/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
});

app.put("/update/:id",async(req,res)=>{
   const {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/show/${id}`);
})

app.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    res.redirect('/listing');
});
 
app.listen(8080,()=>{
    console.log("Server is Listing at port 8080");
})
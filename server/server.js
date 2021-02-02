
const express = require("express");
const app = express();

//import port number
require('dotenv').config();
const port = process.env.PORT || 3000;

//use() let's you use middleware
//express.json() is middleware that parses incoming requests, and JSON bodies 
app.use(express.json());


//dummy data (which will be retrieved from a database)
const movies = [
    {
        id:1,
        name:"tarzan",
        year:"1999"
    },
    {
        id:2,
        name:"batman begins",
        year:"1990"
    },
    {
        id:3,
        name:"prince of egypt",
        year: "1998"
    }
]


app.get("/", (req,res)=>{
    res.send("hello world!");
})


//send all movie data
app.get("/movies", (req,res)=>{
    res.send(movies); //this will only print 3 items since we're not saving the 4th posted item.
})

//dynamic url, /movies/1 (will show first object, 2 seond object and so on)
//:id is a parameter that is a placeholder for any value
app.get(`/movies/:id`, (req,res)=>{
    
    //get the id from :id
    const id = req.params.id

    //logic to see if id exists in dummy data
    const movie = movies.find(item=>item.id == parseInt(id));

    //if movie exists, send movie object, otherwise send 404 status
    if(movie){
        res.send(movie)
    }
    else{
        res.status(404).send("The item was not found"); //sends 404 status with custom message
    }
})


//we add a post method to the same url
app.post("/movies", (req, res)=>{


    //if the request has nod name or year property, send status error
    if(!req.body.name || !req.body.year){
        return res.status(400).send("Must provide name and year");
    }


    //create a movie object for the data extraction
    //the data will be attached to the requests body.(property name);
    //this will constantly add data to the array on every request, so needs to validate checker
    const movie ={
         id: movies.length +1, 
         name: req.body.name, //the property name will be what you set in the body, usually same as array.
         year: req.body.year

    }

    //add the newly created movie to array
    movies.push(movie);

    //send back the newly created movie
    res.send(movies);

})


//requires id
app.put('/movies/:id', (req,res)=>{

    //check if element exists otherwise send 404
    const id = req.params.id; 

    const movie = movies.find((item)=> item.id == parseInt(id));

    //if doesn't exist
    if(!movie){
        return res.status(404).send("movie doesn't exist to update");
    } //otherwise, retrieve the object data
    

        //simply override the object with the new object
        movie.name = req.body.name; 
        movie.year = req.body.year; 
        
        res.send(movies); //return full array
})



//delete method
app.delete('/movies/:id', (req, res)=>{

    //get id from parameter
    const id = req.params.id; 

    //if doesn't exist send error
    const index = movies.findIndex(item=>item.id == parseInt(id));

    if(index < 0){

        //return simply exits out of the delete method
        return res.status(400).send("item does not exist to delete"); 
    }

    //remove item with starting index, and # of items to remove after that
    movies.splice(index,1);

    //send user updated movie array
    res.send(console.log(req.params));

})



app.listen(port, ()=>{
    console.log(`port number ${port} activated`);
});


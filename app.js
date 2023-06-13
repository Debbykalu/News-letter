const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/" , function(req, res){
res.sendFile(__dirname + "/signup.html");
})
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members : [
     {
        email_address: email,
        status: "subscribed",
        merge_fields: {
        FNAME: firstName,
        LNAME: lastName
        }
        
     }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/05c42bd18c";
  const options = {
    method : "post",
    auth: "user:c7ba4648613103ed710a2eec24dda5f8-us21"
  }
  
// Send a response back to the client
 const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  request.on("error", function(error) {
    console.error(error);
    res.sendFile(__dirname + "/failure.html");
  });

});
app.post("/failure" , function(req,res){
  res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){
    console.log("The server is running on port 3000")
});



const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

// jo bhi folder commonly use honge unko ek folder main daldo 
// ie public aur stati cbnado toh woh humesha chalenge
app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    // res.send('hi there');
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
    const firstname = req.body.first;
    const lastname = req.body.last;
    const email = req.body.email;
    // console.log(firstname, lastname, email);
    if (firstname === '' || lastname === '' || email === '') {
        res.sendFile(__dirname + '/failure.html');
    }

    // below is the data we will send to mailchimp to store so store according documentatioin for api 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    const json_data = JSON.stringify(data);

    // now to send the data

    // https.request(url,option,function(res){})
    // basic syntax to send data
    // url is endpoint where we need to send data
    // option main method like get ya post aur authentication dete hain woh ek obj hai 
    var url = 'https://us12.api.mailchimp.com/3.0/lists/c6bde5a07c';
    var option = {
        method: 'POST',
        auth: 'aarnav:822e71318f211bb44684ff8f4658d9ce-us12'
    }
    const request = https.request(url, option, function (response) {
        if (response.statusCode === 200) {
            // res.send('successfully submitted');
            res.sendFile(__dirname + '/success.html');
        }
        else {
            // res.send('There was error in signing up,please try again later!');
            res.sendFile(__dirname + '/failure.html');
        }
        response.on('data', function (data) {
            console.log(JSON.parse(data));

        })
    })
    request.write(json_data);
    request.end();

});

app.post('/failure', function (req, res) {
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, function () {
    console.log('the server is running on port 3000.');
});

// 822e71318f211bb44684ff8f4658d9ce-us12

// c6bde5a07c
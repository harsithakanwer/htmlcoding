const axios = require('axios');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const qs = require('qs');
app.use(express.static('templates'));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
let refreshToken = null;

app.post('/submit', (req, res) => {
    const usernameValue = req.body.username;
    const passwordValue = req.body.password;

    let data = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'password',
        'username': usernameValue,
        'password': passwordValue
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            refreshToken = response.data.refresh_token;
            res.redirect("/home.html");
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/loggedout', (req, res) => {
    let data1 = qs.stringify({
        'refresh_token': refreshToken,
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94'
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/logout',
        headers: {
            'Cookie': 'connect.sid=s%3AskT1sh3hh2QBYYI-jD_XXtaZwE6B4vkT.7BSIXE9wNmnVVdcb8uHFg9LpoiiP4F6LCg3%2F0w9pMGk',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data1
    };

    axios.request(config)
        .then((response) => {
            res.redirect("/index.html");
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post('/signedup', (req, res) => {
    let accessToken = null;
    

const firstnameValue = req.body.afirstname;
const lastnameValue = req.body.alastname;
const usernameValue = req.body.ausername;
const emailValue = req.body.aemail;
const passwordValue = req.body.apassword;

    let data1 = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'client_credentials'
    });

    let config1 = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Cookie': 'connect.sid=s%3AskT1sh3hh2QBYYI-jD_XXtaZwE6B4vkT.7BSIXE9wNmnVVdcb8uHFg9LpoiiP4F6LCg3%2F0w9pMGk',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data1
    };

    axios.request(config1)
        .then((response) => {
            accessToken = response.data.access_token;
            let data = JSON.stringify({
                "ausername": usernameValue,
                "enabled": true,
                "afirstName": firstnameValue,
                "alastName": lastnameValue,
                "aemail": emailValue,
                "emailVerified": true,
                "credentials": [
                    {
                        "type": "password",
                        "value": passwordValue,
                        "temporary": false
                    }
                ]
            });
            
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/admin/realms/democl/users',
                // url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
            
            });
        })




app.listen(3001, () => {
    console.log("port connected in 3001");
});
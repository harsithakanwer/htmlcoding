const mongoose = require('mongoose')
const express = require("express")
const session = require("express-session");
const app = express()
const crypto = require("crypto")
const User = require("./models/user")
const cors = require('cors')
const { ExpressOIDC } = require('@okta/oidc-middleware');
const path = require('path')
const { auth, requiresAuth } = require('express-openid-connect');

app.use(express.static('templates'));

mongoose.set('strictQuery', false);

app.use(express.json());


const config = {
    authRequired: true,
    auth0Logout: true,
    baseURL: `http://localhost:3000`,
    clientID: 'sY0m0eX2VtceyNp07HwAud6MMyMZBXmy',
    issuerBaseURL: 'https://dev-ne6rmizjup5k4fa7.us.auth0.com',
    secret: 'a long, randomly-generated string stored in env'
};
app.use(auth(config));

app.get('/profile', requiresAuth(), async function (req, res, next) {
    const user = await req.oidc.user;
    console.log(user);
    res.redirect('index.html');
});


app.use(express.json())
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

app.use(express.urlencoded({ extended: false }))
mongoose.connect("mongodb://127.0.0.1:27017/login")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.log(err);
    })

const encryptPassword = (password) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        key: key.toString('hex'),
        iv: iv.toString('hex'),
        encryptedPassword: encrypted
    };
}

const decryptPassword = (encryptedPassword, key, iv) => {
    const decipher = crypto.createDicepheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

}

app.post("/signup", async (req, res) => {
    try {


        const encryptedPassword = encryptPassword(req.body.password);

        const newUser = await User.create({
            name: req.body.name,
            password: encryptedPassword.encryptedPassword,
            key: encryptedPassword.key,
            iv: encryptedPassword.iv,
        });
        res.send(newUser);
    } catch (error) {
        res.send(error.message)

    }
})
app.post("/login", async (req, res) => {
    try {
        const userdata = await User.findOne({ name: req.body.name })
        if (userdata.password === req.body.password) {
            res.send('success')
        } else {
            res.send('wrong password')
        }
    } catch (error) {

    }
})


app.listen(3001, () => {
    console.log("port connected");
})

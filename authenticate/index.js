const express=require("express")
const app=express()
const crypto=require("crypto")
const User=require("./models/user")
const cors=require('cors')


app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended:false}))
const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/login")
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log(err);
})

const encryptPassword = (password)=>{
    const key=crypto.randomBytes(32);
    const iv=crypto.randomBytes(32);
    const cipher=crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted=cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return{
        key: key.toString('hex'),
        iv: iv.toString('hex'),
        encryptedPassword: encrypted
    };
}

const decryptPassword = (encryptedPassword, key, iv)=> {
    const decipher = crypto.createDicepheriv('aes-256-cbc', Buffer.from(key, 'hex'),Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

}

app.post("/signup",async(req,res)=>{
    try {
        const newUser=await User.create(req.body);
        res.send('account created')
        const encryptedPassword = encryptPassword(userdata.password);
        userdata.password = encryptedPassword.encryptedPassword;
        userdata.key = encryptedPassword.key;
        userdata.iv = encryptedPassword.iv;
        const result = await collection.insertOne(userdata);
        res.sendStatus(200);
    } catch (error) {
        res.send('not created')
        
    }
})
app.post("/login",async(req,res)=>{
    try {
        const userdata=await User.findOne({name:req.body.name})
        if(userdata.password===req.body.password){
            res.send('success')
        }else{
            res.send('wrong password')
        }
    } catch (error) {
        
    }
})


app.listen(3001,()=>{
    console.log("port connected");
})
// mongodb shakti1089
// mongodb+srv://user1:user1@cluster1.mhc4t.mongodb.net

var exp = require('express')
var app = exp()
var http =  require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var dburl = "mongodb+srv://user1:user1@cluster1.mhc4t.mongodb.net"

app.use(exp.static(__dirname))
app.use(exp.urlencoded({ extended: true }));
app.use(exp.json())


var MonggoseModel = mongoose.model('message',{
    name:String,
    message:String
})

app.get('/messages',(req,res)=> {
    MonggoseModel.find({},(err,messages)=>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var m1 = new MonggoseModel(req.body)
    m1.save((err)=>{
        if(err)
            sendStatus(500)

        MonggoseModel.findOne({m1:'badword'},(err, censored)=>{
            if(censored){
                console.log('badword found', censored)
                MonggoseModel.remove({_id: censored.id},(err)=>{
                    console.log('removed censored message')
                })
            }
        })

        io.emit('message',req.body)
        res.sendStatus(200)
    })
    
})

var serv = http.listen(3030, () => {
    console.log("Server is running on port",serv.address().port)
})

io.on('connection', (socket)=>{
    console.log("user connected")
})

mongoose.connect(dburl, { useUnifiedTopology: true, useNewUrlParser: true} , (err)=>{
    console.log("Databasae connected",err)
})

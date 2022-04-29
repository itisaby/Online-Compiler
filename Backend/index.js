const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
const dotenv = require('dotenv')
dotenv.config()

const { generateFile } = require('./generateFile')
const { executeCpp } = require('./executeCpp')
const { executePy } = require('./executePy')
const { executeJs } = require('./executeJs')
const { score } = require('./computeScore')
const Job = require('./models/job')
const password = process.env.PASSWORD;
mongoose.connect(
    `mongodb+srv://node-rest:${password}@cluster1.fstlx.mongodb.net/myDatabase?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },(err) =>{
        if(err){
            console.error(err)
            process.exit(1)
        }
        console.log("successfully connected")
    }
  );

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        message: 'Hello World'
    })
})

app.post('/run', async (req, res) => {
    const { language = "cpp", code } = req.body
    if (code === undefined) {
        return res.status(400).json({
            success: false,
            message: 'No code provided'
        })
    }
    let job;
    try {
        //need to generate the c+= file with the content
        const filepath = await generateFile(language, code)
        job = await Job({language, filepath}).save()
        const jobid = job["_id"]
        // console.log(job);
        console.log("data received");
        
        //we need to run the file and send back the response
        let output;
        let points;

        job["StartedAt"] = new Date();

        if (language === 'cpp') {

            output = await executeCpp(filepath)
            console.log("output generated");
        } else if(language === 'py') {
            output = await executePy(filepath)
            points = score(code.length)
            console.log("points generated " + points);
            console.log("output generated");
        }else{
            output = await executeJs(filepath)
            console.log("output generated");
        }
        job["Score"] = points;
        job["CompletedAt"] = new Date();
        job["Status"] = "success";
        job["Output"] = output;
        await job.save();
        res.status(201).json({success: true, job});
        console.log(job);
        // return res.json({
        //     filepath,
        //     output,
        //     points
        // })
    } catch (err) {
        job["CompletedAt"] = new Date();
        job["Status"] = "error";
        job["Output"] = JSON.stringify(err);
        console.log(job)
        // return res.status(500).json({
        //     success: false,
        //     message: err.message
        // })
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
});
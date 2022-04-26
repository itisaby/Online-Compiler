const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const { generateFile } = require('./generateFile')
const { executeCpp } = require('./executeCpp')
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        message: 'Hello World'
    })
})

app.post('/run', async(req, res) => {
    const {language="cpp", code} = req.body
    if(code===undefined) {
        return res.status(400).json({
            success: false,
            message: 'No code provided'
        })
    }
    try{
        //need to generate the c+= file with the content
        const filepath = await generateFile(language, code)
        //we need to run the file and send back the response
        const output = await executeCpp(filepath)
        return res.json({
            filepath,
            output
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
});
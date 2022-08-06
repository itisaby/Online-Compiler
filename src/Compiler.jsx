import React, { useState }from 'react'
import axios from 'axios'
export const OnlineCompiler = () => {
  const [code, setCode] = useState('// Type your code here')
  const [output, setOutput] = useState('')
  const [score, setScore] = useState('0')
  
  const [language, setLanguage] = useState('cpp')
  const handleSubmit =async() =>{
    // console.log(code)
    const payload={
      language: language,
      code: code
    }
    try{

      const {data} = await axios.post('https://multiusercompiler.herokuapp.com:8000/run', payload)
      setOutput(data.job.Output)
      setScore(data.job.Score);
      console.log(data);
    }catch(
      {response}
    ){
      if(response){
        setOutput(response.success.json());
      }
      else{
        setOutput("error connecting server")
      }
    }
    
  }
  return (
    <div>
      <h1>Online Compiler</h1>
      <div>
        <label>Language</label>
        <select value={language} onChange={
          (e) => {
            setLanguage(e.target.value)
            console.log(e.target.value);
          }
        }>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="js">Javascript</option>
        </select>
        <br />
      </div>
      <textarea rows="10" cols="75" value={code} onChange={(e)=>{
        setCode(e.target.value)
      }}></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <p>Output: {output}</p>
      <p>Score: {score}</p>
    </div>
  )
}

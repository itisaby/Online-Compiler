import React, { useState }from 'react'
import axios from 'axios'
export const OnlineCompiler = () => {
  const [code, setCode] = useState('// Type your code here')
  const [output, setOutput] = useState('')
  const handleSubmit =async() =>{
    // console.log(code)
    const payload={
      language:"cpp",
      code: code
    }
    const output1 = axios.post('http://localhost:8000/run', payload)
    const output2 = await output1
    console.log(output);
  }
  return (
    <div>
      <h1>Online Compiler</h1>
      <textarea rows="10" cols="75" value={code} onChange={(e)=>{
        setCode(e.target.value)
      }}></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <p>{output}</p>
    </div>
  )
}

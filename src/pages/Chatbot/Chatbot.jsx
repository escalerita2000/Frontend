import { useState } from "react"

function Chatbot(){

const [messages,setMessages] = useState([])
const [input,setInput] = useState("")

const sendMessage = ()=>{

setMessages([...messages,{text:input,user:"me"}])

setInput("")

}

return(

<div>

<h1>Chatbot AVIS</h1>

<div>

{messages.map((msg,i)=>(
<p key={i}>{msg.text}</p>
))}

</div>

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
/>

<button onClick={sendMessage}>

Enviar

</button>

</div>

)

}

export default Chatbot
import React, { useEffect, useRef, useState } from 'react'
import Chatboticon from './chatcomponents/Chatboticon'
import Chatform from './chatcomponents/Chatform'
import ChatMessage from './chatcomponents/ChatMessage'
import { projectInfo } from './Platforminfo'
import './chatindex.css'
const Appchat = () => {
  const [chatHistory,setChatHistory]= useState([{
    hideInChat: true,
    role: "model",
    text: projectInfo
  }])
  const [showChatbot,setShowChatbot]=useState(false)
 const chatBodyRef=useRef()
  const generateBotResponse= async (history)=>{
   const  updateHistory=(text,isError = false)=>{
             setChatHistory(prev=>[...prev.filter(msg=>msg.text !=="Thinking..."),{role:"model",text, isError}])
   }
   
     history=history.map(({role,text})=>({role,parts:[{text}]}))
 
    const requestOptions ={
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body: JSON.stringify({contents : history })
    }

    try{
      // Make the API call to get the bot's response
      const response=await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyBDsxGLjwpHvezWCU4o4xjLokkL2mGKKl8',requestOptions)
      const data=await response.json()
      if(!response.ok)  throw new Error(data.error.message || "SomeThing went wrong!");
      console.log(data)
      const apiResponseText=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       updateHistory(apiResponseText)
    }catch(error){
        updateHistory(error.message,true)
    }
  }
  
  useEffect(()=>{
     // Auto-scroll whenever chat history update
         chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight,behavior:"smooth"})
  },[chatHistory])

  return (
    <div className={`container ${ showChatbot ? "show-chatbot" : ""}`}>

      <button onClick={() => setShowChatbot((prev)=>!prev)} id="chatbot-toggler">
         <span className='material-symbols-rounded'>mode_comment</span>
         <span className='material-symbols-rounded'>close</span>
      </button>
         <div className="chat-popup">
          <div className="chat-header">
            <div className="header-info">
               <Chatboticon/>
               <h2 className='logo-text'>Chatbot</h2>
            </div>
            <button 
            onClick={() => setShowChatbot((prev)=>!prev)}
            className="material-symbols-rounded">
keyboard_arrow_down
</button>
          </div>
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
            <Chatboticon/>
            <p className='message-text'>
                   Hey there <br/> How can I help you today?
            </p>
            </div>

           {/* Render chat history dynamically*/}
            {chatHistory.map((chat,index) =>(
              <ChatMessage key={index} chat={chat}/>
            ))}
            
          </div>
          <div className="chat-footer">
             <Chatform chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
          </div>
         </div>
    </div>
  )
}

export default Appchat



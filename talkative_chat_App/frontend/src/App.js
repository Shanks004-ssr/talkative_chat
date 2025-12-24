import React from 'react'
import { Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Chats from './Pages/Chats'
import './App.css'

const App = () => {
  return (
    
      <div className='App'>
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={Chats}/>
    </div>
    
    
  )
}

export default App

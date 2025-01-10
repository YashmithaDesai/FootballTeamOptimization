import React from 'react'
import Hero from './components/hero'
import About from './components/About'
import Navbar from './components/Navbar'
import Features from './components/Features'
import Story from  './components/Story'
import Footer from './components/Footer'
import Appchat from './components/Appchat'
const App = () => {
  return (
   <main className='realtive min-h-screen w-screen overflow-x-hidden'>
     <Navbar/>
     <Hero />
     <About/>
     <Features/>
    <Story/>
    <Footer/>
   
    </main>
 )
}

export default App
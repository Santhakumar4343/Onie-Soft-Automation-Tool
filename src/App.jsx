
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Components/Header/Dashboard'
import Testcases from './Components/Test Cases/Testcases'


function App() {
 

  return (
    
  <div className='app'>
       <Dashboard/>
       <Routes>
        <Route path='/testcases' element={Testcases}></Route>
       </Routes>
      
  </div>
  )
}

export default App

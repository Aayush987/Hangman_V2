import {Routes, Route} from 'react-router-dom'
import "./index.css"
import MainPage from './pages/MainPage'
import MultiplayerPage from './pages/MultiplayerPage'
import GameContainer from './components/GameContainer'
import Layout from './pages/Layout'

function App() {
 
  return (
      <Routes>
         <Route path = "/" element = {<Layout />}>
         <Route index element = {<MainPage />} />
         <Route path = "/multiplayer" element = {<MultiplayerPage />} />
         <Route path = "/multiplayer/:roomId" element = {<GameContainer />} />
         </Route>
      </Routes>
  )
}

export default App

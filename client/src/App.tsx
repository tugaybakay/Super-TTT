import socket from './socket'
import Header from './components/Header'
import Footer from './components/Footer'
import "./index.css"
import MainGameContainer from './components/MainGameContainer'
import CustomModals from './components/CustomModals'

function App() {
  socket.roomID = "";
  return (
    <>
    <Header/>
    <CustomModals/>
    <MainGameContainer/>
    <Footer/>
    </>
  )
}

export default App

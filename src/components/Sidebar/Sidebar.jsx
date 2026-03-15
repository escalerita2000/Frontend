import { Link } from "react-router-dom"
import { FaChartBar, FaRobot, FaUsers } from "react-icons/fa"

function Sidebar(){

return(

<div className="sidebar">

<h2>AVIS</h2>

<Link to="/dashboard">

<FaChartBar/> Dashboard

</Link>

<Link to="/chatbot">

<FaRobot/> Chatbot

</Link>

<Link to="/users">

<FaUsers/> Usuarios

</Link>

</div>

)

}

export default Sidebar
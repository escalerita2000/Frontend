import { LineChart, Line, XAxis, YAxis } from "recharts"

const data = [

{name:"Ene",users:30},
{name:"Feb",users:50},
{name:"Mar",users:80}

]

function Statistics(){

return(

<div>

<h1>Estadisticas</h1>

<LineChart width={400} height={200} data={data}>

<XAxis dataKey="name"/>
<YAxis/>
<Line type="monotone" dataKey="users"/>

</LineChart>

</div>

)

}

export default Statistics
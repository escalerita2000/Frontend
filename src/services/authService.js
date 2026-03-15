import api from "./Api"

export const loginUser = (data)=>{

return api.post("/login",data)

}
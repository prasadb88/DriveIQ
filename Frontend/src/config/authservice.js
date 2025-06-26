import axios from "axios";


export class AuthService{
    async createAccount({
        username, password, fullname, email, address, phoneno, role 

    }) {
        return axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/registeruser`, {username, password, fullname, email, address, phoneno, role})
        .then((respone)=>{
            return respone.data
        }).catch( (e)=>{
         throw e.response.data
        }
     )
    }

     async login({
        username,email,password
    }){
        if(username || email){
         return axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, {username,email,password}, { withCredentials: true })
        .then((respone)=>{
            return respone
        }).catch((error) => {
            throw error.response.data
            
        });
        }
    }

    async logout(){
        return axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {}, { withCredentials: true })
        .then((response)=>{
            return response;
        }).catch((e) => {
            throw e.response?.data || { success: false, message: 'Logout failed' };
        });
    }
    async newwobtoken(){
           axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/user/genratenewtoken`, { withCredentials: true })
        .then((respone)=>{
        return respone
        }).catch((e) => {
             throw e.response.data
        });
    }
    async chagepassword(
        oldpass,newpass
        
    ){
         axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/changepass`,{oldpass,newpass}, { withCredentials: true })
        .then((respone)=>{
        return respone
        }).catch((e) => {
             throw e.response.data
        });
    }
     async getcurrentuser(){
      return axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/getcurrentuser`, { withCredentials: true })
      .then((respone)=>{
        return respone
      }).catch((e) => {
        throw e.response.data
      });
    }
    async changeaccountdetails({
         username, email, phoneno, address 
    }){
         axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/changeaccountdetails`,{ email,username,phoneno,address}, { withCredentials: true })
        .then((respone)=>{
        return respone
        }).catch((e) => {
             throw e.response.data
        });
        }

      async changeavatar (avatar){
         axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/user/changeavatar`, {avatar}, { withCredentials: true })
        .then((respone)=>{
        return respone
        }).catch((e) => {
             throw e.response.data
        });
    }
       async changerole(role){
         axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/user/changerole`, {role}, { withCredentials: true })
        .then((respone)=>{
        return respone
        }).catch((e) => {
           throw e.response.data
        });
    }

    async getuser(id) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/getuser`,
          { id },
          { withCredentials: true }
        );
        return response.data;
      } catch (e) {
        throw e.response?.data || e;
      }
    }
    }

const authService = new AuthService();

export default authService;
import axios from "axios";

export class carService {
  async addcar(formData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/cars/addcar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }
  async upatecar({ id, formData }) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/cars/updatecar/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async delecar(id) {
    return axios.get(`${import.meta.env.VITE_API_URL}/api/v1/cars/deletecar/${id}`, { withCredentials: true })
      .then(res => res.data)
      .catch(err => {
        throw err.response?.data || err;
      });
  }
  async getallcars(){
       try {
         const response = await axios.get(
           `${import.meta.env.VITE_API_URL}/api/v1/cars/getallcars`,
           { withCredentials: true }
         );
         return response.data; // <-- Make sure to return the data here
       } catch (e) {
         throw e.response?.data || e;
       }
   }
  async getcar(id) {
    return axios.get(`${import.meta.env.VITE_API_URL}/api/v1/cars/getcar/${id}`, { withCredentials: true })
      .then(res => res.data);
  }
}

const carservice = new carService();

export default carservice;
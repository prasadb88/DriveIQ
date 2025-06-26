import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Store/store'
import { Toaster } from "@/components/ui/sonner"
import Signin from './components/Signin'
import RegisterPage from './components/Register'
import LandingPage from './components/Landingpage'
import Addcar from './pages/Addcar'
import Home from './pages/Home'
import Cardetailspage from './pages/Cardetailspage'
import Editcar from './pages/Editcar'
import MyTestdrive from './pages/MyTestdrive'
import SellerDashborad from './pages/SellerDashborad'



const router= createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/addcar",
        element:<Addcar/>
      },
      {
        path:"/cardetails/:id",
       element:<Cardetailspage/>

       },
       {
            path:"/updatecar/:id",
       element:<Editcar/>
       },
       {
        path:"my-test-drives",
        element:<MyTestdrive/>
       },
       {
         path:"seller-dashboard",
        element:<SellerDashborad/>
       }
    ]
  },
  {
    path:"/signin",
    element:<Signin/>
  },
  {
    path:"/register",
    element:<RegisterPage/>
  },

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <Provider store={store}>
<RouterProvider router={router}/>
    </Provider>

  </StrictMode>,
)

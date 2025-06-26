import './App.css'
import Header from "./components/Header/Header"

import { Outlet, Navigate } from "react-router-dom"
import Footer from "./components/Footer/Footer"
import { useEffect, useState } from 'react'
import authService from './config/authservice'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './Store/authSlice'
import LandingPage from './components/Landingpage'



function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      authService.getcurrentuser().then((userData) => {
        if (userData) {
          dispatch(login({ user: userData.data }))
        } else {
          dispatch(logout())
        }
      }).finally(() => { setLoading(false) })
    }
    fetchUser()
  }, [dispatch])

  if (loading) return null;

  return isAuthenticated ? (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  ) : (
    <>
      <Header/>
      <LandingPage/>
      <Footer/>
      </>
  )
}

export default App

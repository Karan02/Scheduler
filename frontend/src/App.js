import React,{useEffect,useState} from "react";
import Booking from './Booking';

function App() {

  useEffect(()=>{
    loadScript("https://checkout.razorpay.com/v1/checkout.js") ;
  });


  const loadScript = (src) => {
    return new Promise((resolve)  => {
      const script = document.createElement('script')

      script.src = src

      script.onload = () => {
        resolve(true)
      }

      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script);
    })
  }
  return (
        <Booking />
  );
}

export default App;
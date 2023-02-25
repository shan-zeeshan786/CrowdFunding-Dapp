import React from 'react'
import "../css/App.css"; 



export default function header() {
  const tologin=()=>{
    window.open("./signin","_self")
  }
  const tosignup=()=>{
    window.open("./signup", "_self")
  }
  
  return (
    <div class="card-header">
    <div className="Title">CrowdFunding</div>
   <div className='button'>
    <button
      type="button"
      class="btn btn-success"
      onClick={tosignup}
    >
      Sign up 
    </button>
  <button
      type="button"
      class="btn btn-success"
      onClick={tologin}
    >
      Login 
    </button>
    </div>
  </div>
  )
}

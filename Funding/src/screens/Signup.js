import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Hea from "./Header"


import Web3 from "web3";
import { loadContract } from "../utils/load-contract";
import detectEthereumProvider from "@metamask/detect-provider";

import '../css/Login.css'
// import contract from '@truffle/contract';

export default function SignUp() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigate = useNavigate();
   
    const [account, setAccount] = useState(null);
    // const [auth, setAuth] = React.useState(null);
   
    // const loadAccounts = async () => {
    // //   let { auth, accounts } = await loadBlockchainData();
   
    //   setAccounts(accounts);
    //   setAuth(auth);
    // };
    const OnsignUp = async (event) => {
      event.preventDefault();

       const {contract}=web3Api;
       var count;
        contract.usersCount.call((error,res)=>{
          if(error)return console.log("tyr again");
            count=res;
            console.log(count);
        })

        if (!username || !email || !password) {
          alert("please fill all details");
          return;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(mailformat)) {
          alert("please enter valid email address");
          return;
        }
        try {
          const {contract}=web3Api
            
             contract.createUser(username,email,password,{from:account});
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
          // console.log(localStorage.getItem("username"));
          navigate("/signin");
           
        } catch (e) {
          console.log(e.message);
        }
      };

    

      useEffect(() => {
        const loadProvider = async () => {
          const provider = await detectEthereumProvider();
          const contract = await loadContract("Funder", provider);
          
    
          if (provider) {
            provider.request({ method: "eth_requestAccounts" });
            setWeb3Api({
              web3: new Web3(provider),
              provider,
              contract,
            });
          } else {
            console.error('Please install MetaMask!')
          }
        };
    
        loadProvider();
      }, []);
    //   React.useEffect(() => {
    //     // loadWeb3();
    //   }, []);
     
    //   React.useEffect(() => {
    //     loadAccounts();
    //   }, []);
    useEffect(()=>{
        const getAccount=async()=>{
          const accounts= await web3Api.web3.eth.getAccounts();
         setAccount(accounts[0]);

         }
        
        web3Api.web3 && getAccount();

      },[web3Api]);
   
    return (
        <div className="text-center m-5-auto">
            <Hea />
            <form onSubmit={OnsignUp}>
            <h2>Join us</h2>
            <h5>Create your personal account</h5>
             <p>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    type="text"
                  />               
              </p>
                <p>
                <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="text"
                    />
                </p>
                <p>
               <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                    />
                </p>
                <p>
                    {/* <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></span>. */}
                </p>
                <p>
                    <button id="sub_btn" type="submit">Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}

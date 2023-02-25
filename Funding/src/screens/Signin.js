import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Hea from "./Header"
import '../css/Login.css'


import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "../utils/load-contract";
// import contract from '@truffle/contract';


export default function SignInPage() {
 
 

const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");
const [account, setAccount] = useState(null);
const navigate = useNavigate();

  const Login=async(event)=>{
    event.preventDefault();
    
    if (!email || !password) {
        alert("please fill all details");
        return;
      }
      const {contract}=web3Api
      var count;
    await  contract.usersCount.call((error,result)=>{
          if(error){
            return alert("Please! Log into Metamask")
          }
          count=result;
     console.log(count);
    });
       
      // localStorage.setItem("username",) 
      console.log("first")
      var log=await contract.getUser(email,password);
       if(log===true){
        console.log("working")
       navigate("/contribution")
       }else{
         return alert("Wrong credentials ")
       }
    // navigate("/contribution");
  }

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const setAccountListener = (provider) => {
    provider.on('accountsChanged',(accounts)=>{
           console.log(accounts[0]);
           return setAccount(accounts[0]);
          })
        }
        useEffect(() => {
          const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("Funder", provider);
      
            if (provider) {
              setAccountListener(provider);
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
            
            <form onSubmit={Login}>
            <h2>Sign in to us</h2>
            <br></br>
                <p>
                    <label>Username or email address</label><br/>
                    {/* <input type="text" name="first_name" required /> */}
                    <input
                    // style={input}
                    value={email}
                   onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="text"
                      />
                </p>
                <p>
                    <label>Password</label>
                    <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>
                    <br/>
                    {/* <input type="password" name="password" required /> */}
                    <input
                    //    style={input}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Password"
                       type="password"
                     />        
               </p>
                <p>
                    <button id="sub_btn" type="submit" >Login</button>
                </p>
            </form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}
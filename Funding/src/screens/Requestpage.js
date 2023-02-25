import { useState, useEffect } from "react";
import "../css/App.css";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "../utils/load-contract";

function Requestpage() {

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [reload, shouldReload] = useState(false);
    const [input, setInput] = useState(0);
    const [numOfFunders, setnumOfFunders] = useState(0);
    const [accepted, setaccept] = useState(0);
    const reloadEffect = () => shouldReload(!reload);
    const [withdrawRequest, setWrequest] = useState([{
        value: 0,
        recipient: null,
        complete: false,
        approvalCount: 0
    }])
    const setAccountListener = (provider) => {
        provider.on('accountsChanged', (accounts) => {
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
            contract.requests.call((error, res) => {
                if (error) return console.log("request");
                setWrequest(res);
            })
            await contract.numOfFunders.call((error, res) => {
                if (error) return console.log("try again");
                setnumOfFunders(res);

                console.log(res);
            })

        }
        ///***************Doubt******** */
        // for (var i = 0; i < 2; i++) {
        //     setWrequest(
        //         ...{
        //         value: i,
        //         recipient: "hello",
        //         complete: false,
        //         approvalCount: 0
        //     })
        // }


        loadProvider();
    }, []);

    // ***** //To connect with metamask automatically  //*********//
    // useEffect(()=>{
    //   const loadProvider=async()=>{
    //     let provider=null;
    //     if(window.ethereum){
    //       provider=window.ethereum;
    //       try{
    //         await provider.enable();
    //       }catch{
    //         console.error("User is not allowed");
    //       }
    //     }else if(window.web3){
    //       provider=window.web3.currentProvider;
    //     }else if(!process.env.production){
    //              provider=new Web3.providers.HttpProvider("http://localhost:7545");
    //     }
    //     setWeb3Api({
    //       web3:new Web3(provider),
    //       provider 
    //     })
    //   };
    //   loadProvider();

    // },[]);
    // console.log(web3Api.web3);

    //**********//Function to connect metamask with button//**********//

    // const toConnect=async() => {
    //   const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   console.log(accounts);

    // }

    ////////////////// To get all accounts and set 0 index account as connected /////////////// 
    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);

        }

        web3Api.web3 && getAccount();

    }, [web3Api]);
    /////////////// To get Balance of the contract ///////////////////////////////// 
    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = web3Api
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, "ether"));
        }
        web3Api.contract && loadBalance();

    }, [web3Api, reload]);

    /////////////////TransFund ////////////////// 
    const transferFund = async () => {
        if (input <= 0) {
            return alert("Please! Enter Positive Values ");
        }
        console.log("i'm working")
        const { web3, contract } = web3Api;
        await contract.transfer({
            from: account,
            value: web3.utils.toWei(input, "ether"),
        });
        reloadEffect();
    };
    ////////////// To withdraw fund/////////////////////
    const withdrawFund = async () => {
        const { web3, contract } = web3Api;
        if (input <= 0) {
            return alert("Please! Enter Positive value");
        }
        if (input > balance) {
            return alert("Sorry! contract doesn't have enough balance");
        }
        var owner;
        ////////////// To access the public state of contract /////////////////

        // contract.owner.call((error,result)=>{
        //   if(error){
        //     return alert("Please! Log into Metamask")
        //   }
        //   owner=result;
        // });

        /////////////// To access state of contract with getter function////////////////
        await contract.getOwner((error, result) => {
            if (error) {
                return alert("Please! Log into Metamask")
            }
            owner = result;

        });
        console.log(owner);
        //  contract.getOwner().then(console.log);
        if (account !== owner) {
            return alert("Sorry!you can't proceed")
        }
        const amount = web3.utils.toWei(input, "ether");
        await contract.withdraw(amount, {
            from: account,
        })
        reloadEffect();
    };

    //accept
    const accept = async (key) => {
        const { contract } = web3Api;
        // contract.approval(key);  
        reloadEffect();
    }
    useEffect(() => {
        const { contract } = web3Api;

        //  contract.accepted.call((error, res) => {
        //     if (error) return console.log("try again");
        //     setaccept(res);

        //     console.log(res);
        //   })
    }, reload);








    return (
        <>
            <div class="card text-center">
                <div class="card-header">
                    <div className="Title">CrowdFunding</div>
                </div>
                <div>
                    <ul>
                        {withdrawRequest.map(request => {
                            return (
                                <li key={request.id}>
                                    <div className="req">
                                        <div>{request.value} </div>
                                        <div>{request.recipient}</div>
                                        <div>{request.complete} </div>
                                        <div>{request.approvalCount}</div>
                                        <div className="btn">
                                            <button type="button" class="btn btn-success " onClick={accept()}>
                                                Approve
                                            </button>
                                         
                                        </div>
                                        
                                    </div>
                                    <hr/>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Balance: {balance} ETH </h5>
                    <p class="card-text">
                        Account :{account ? account : "not connected"}

                    </p>



                    <div className="trans">
                        {/* <input value={input} onInput={e => setInput(e.target.value)}/>         */}
                        <div className="RequestDetails">

                            TotalContributor={numOfFunders};
                            <div className="approved-rej">
                                <div>
                                    Approved={accepted}

                                </div>

                            </div>



                        </div>
                        <div className="btn">
                            <button type="button" class="btn btn-success " onClick={accept}>
                                Approve
                            </button>

                            {/* <button type="button" class="btn btn-primary " onClick={reject}>
                                Reject
                            </button> */}
                        </div>
                    </div>
                </div>

                <div class="card-footer text-muted">Thanks for Effort</div>

            </div>
        </>
    );
}

export default Requestpage;

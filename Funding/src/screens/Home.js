import React, { useState, useEffect } from "react";
import Hea from "./Header"
import "../css/App.css"
// import axios from 'axios';
import Web3 from "web3";
import { loadContract } from "../utils/load-contract";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [account, setAccount] = useState(null);
  const [users, setusers] = useState(0);
  const [reload, shouldReload] = useState(false);
  const reloadEffect = () => shouldReload(!reload);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [detail, setState] = useState({
    name: null,
    email: null,
    mess: null
  })
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
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);

    }

    web3Api.web3 && getAccount();

  }, [web3Api]);

  useEffect(() => {
    const get = async () => {
      const { contract } = web3Api;

      await contract.usersCount.call((error, res) => {
        if (error) return console.log("try again");
        setusers(res);

        console.log(res);
      })

    }
    get();
  }, [web3Api])

  const review_form = () => {
    console.log("working")
    console.log(detail.email)
    // const axios = require('axios').default;

    // axios.defaults.headers.post['Content-Type'] = 'application/json';
    // axios.post('https://formsubmit.co/84d06231563b44c60cd441bf315a2990',detail)
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error)); 
  }

  //-----------------------------------------------///
  return (
    <>
      <Hea />
      <div className="App">
        <img src="https://startuppakistan.com.pk/wp-content/uploads/2021/04/c-users-dell-pictures-crowdfunding-og-banner-jpg.jpeg" alt="Crowdfunding Image" className="home" />
        <div className="content">
          <div className="text">
            <h1>P2P Lending Crowdfunding</h1>
            <img src="https://www.chetu.com/img/blogs/create-your-own-crowdfunding/p2p-lending-crowdfunding.jpg" alt="img"></img>
            <p>P2P lending is the most popular crowdfunding business model since it allows an entrepreneur or business to borrow money from a group of people instead of a bank.

              For social lending structures (social projects), borrowers may not have to pay any interest on the loan. In this case, some platforms are designed to use P2P or P2B loans instead.

              P2P lending websites connect investors who want to lend money to entrepreneurs or entities that need money.
              More and more businesses and entrepreneurs are discovering the benefits of P2B and P2P lending software development.

              Even if a borrower's credit isn't great, a P2P lender may be willing to accept the risks involved for potential benefits or a cause that they believe in. This business model also gives more customization options to borrowers and lenders.

              Interest rates are usually between 6% and 36%, and loan amounts may vary between $1,000 and $40,000. The average repayment term is about 36 months.

              Companies or entrepreneurs that own custom crowdfunding platforms for P2P lending make money by allowing others to use them. In this case, they make money by being the intermediary (middleman) and charge a small percentage-based fee.

              Zopa is a well-known P2P lending crowdfunding platform utilized by millions of businesses and entrepreneurs looking to expand their budget for specific projects.</p>
            <h1>Donation-Based Crowdfunding
            </h1>
            <img src="https://www.chetu.com/img/blogs/create-your-own-crowdfunding/donation-based-crowdfunding.jpg" alt="img"></img>
            <p>Donation-based platforms are suitable for charitable projects, business expansion projects, or other types of projects where donors have the assurance that they're contributing to a specific project.

              This may encourage higher donation amounts and often inspires more confidence in donors. They also know that they can expect updates as the project progresses.

              GoFundMe is the most popular donation-based crowdfunding platform, resulting in a total of $5 billion in donations for charitable causes.

              This platform offers the simplest ideology out of all of the crowdfunding sites to choose from. However, donation-based platforms don't provide any incentives or financial returns to investors or contributors.

              For donation-based crowdfunding, you have to sell people on the cause that you're fundraising for.
              It doesn't necessarily matter what your cause is. What matters most is how you showcase your cause to the public and persuade them to care enough about it to cough up the cash.

              If you decide to choose this platform, consider creating a campaign that pulls at the heartstrings. More often than not, people will donate to a cause that relates to them on an emotional level.

              Common donation-based crowdfunding initiatives include nonprofits, charities, disaster relief, and medical bills.</p>
          </div>
          <div className="review">
            <div className="Users">
              <h3>Numbers of Users</h3>
              <h1>{users}</h1>
            </div>

            <form method="post">
              <h1>Suggestion</h1>
              <input id="'name" type="text" onChange={(e) => {
                const { name } = detail;
                setState(prevState => ({
                  ...prevState,
                  [name]: e.target.value
                }));
              }} name="Name :" placeholder="Name"></input>
              <input id="email" type="email" onChange={(e) => {
                const { email } = detail;
                setState(prevState => ({
                  ...prevState,
                  [email]: e.target.value
                }));
              }} name="Email  :" placeholder="Email"></input>
              <textarea class="sugges" name="Message  : " onChange={(e) => {
                const { mess } = detail;
                setState(prevState => ({
                  ...prevState,
                  [mess]: e.target.value
                }));
              }} placeholder="your can send any kind of suggestion here" cols="'5" rows="'5"></textarea>
              <button onClick={review_form} type="button" class="btn btn-secondary btn-lg btn-block">Submit</button>

            </form>
          </div>
        </div>
      </div>
    </>

  );
}
export default App;
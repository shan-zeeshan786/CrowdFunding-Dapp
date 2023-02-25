// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    //user
    struct user {
        string username;
        string email;
        string password;
    }
    /// contribution/////
    struct contribution {
        address useraddress;
        // string username;
        // string email;
        uint256 amount;
        bool approved;
    }

    ///withdrawal request//
    struct request {
        uint256 id;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    user[] public users;
    uint256 public usersCount = 0;
    uint256 withdrawalRequestcount = 0;
    uint256 public numOfFunders = 0;
    address public owner;
    contribution[] contributer;
    uint256 public accepted;
    request[] public requests;
    // address[] public contributers;
    //Get user details
    function getUser(string memory em, string memory pass)
        public
        view
        returns (bool)
    {
        uint256 p = usersCount;
        uint256 i = 0;
        while (i < usersCount) {
            string memory curr = users[i].email;
            if (
                bytes(curr).length == bytes(em).length &&
                keccak256(abi.encodePacked(curr)) ==
                keccak256(abi.encodePacked(em))
            ) {
                p = i;

                break;
            }

            i++;
        }

        if (p != usersCount) {
            string memory pss = users[p].password;
            if (
                bytes(pass).length == bytes(pss).length &&
                keccak256(abi.encodePacked(pass)) ==
                keccak256(abi.encodePacked(pss))
            ) return true;
        } else return false;
    }

    function createUser(
        string memory _username,
        string memory _email,
        string memory password
    ) public {
        user memory newUser = user({
            email: _email,
            username: _username,
            password: password
        });
        usersCount++;
        users.push(newUser);
    }

    constructor() {
        owner = msg.sender;
    }

    // mapping(uint256 => address) private funders;
    // Get owner
    function getOwner() public view returns (address) {
        return owner;
    }

    //Add new withdrawal request//
    function createRequest(uint256 v1) public  {

        request memory newrequest= request({
             
             value:v1,
             recipient:owner,
             complete:false,
             approvalCount:0
        });
        requests.push(newrequest);
    }

    function transfer() external payable {
        bool exist = false;
        for (uint256 i = 0; i < contributer.length; i++) {
            if (contributer[i].useraddress == msg.sender) {
                exist = true;
                contributer[i].amount += msg.value;
                break;
            }
        }

        if (!exist) {
            contribution memory newContro = contribution({
                useraddress: msg.sender,
                amount: msg.value,
                approved: false
            });
            numOfFunders++;
            contributer.push(newContro);
        }
    }

    // function contibute() public payable {
    //     require(msg.value > 2);

    //     contributers.push(msg.sender);
    //     //   approvers[msg.sender] = true;
    //     //   approversCount++;
    // }
    function approval(uint key) public {
        // for (uint256 i = 0; i < contributer.length; i++) {
        //     if (contributer[i].useraddress == msg.sender) {
        //         contributer[i].approved = true;
        //         accepted++;
        //         break;
        //     }
          requests[key].approved = true;
                accepted++;
        }
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000 && msg.sender == owner,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }
}

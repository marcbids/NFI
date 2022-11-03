import { chainIds } from "./chainIds.js";

let metaAddress, metaNetwork, metaBalance;
let activeAccount;

const metamaskButton = document.querySelector(".enableEthereumButton");
const address = document.querySelector(".showAccount");
const network = document.querySelector(".showNetwork");
const balance = document.querySelector(".showBalance");

metamaskButton.addEventListener("click", () => {
  metamaskButton.disabled = true;
  loginMeta();
});
window.addEventListener("load", () => {
  handleConnection();
});

const handleNetwork = (data) => {
  metaNetwork = chainIds[data];
  network.innerHTML = metaNetwork;
};

const handleAddress = (data) => {
  metaAddress = data[0];
  address.innerHTML = metaAddress;
};

const handleBalance = (data) => {
  metaBalance = parseInt(data, 16) / 10 ** 18;
  balance.innerHTML = metaBalance;
};

const handleConnection = () => {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
    ethereum.request({ method: "eth_accounts" }).then((data) => {
      if (data.length !== 0) {
        handleAddress(data);
        ethereum
          .request({
            method: "eth_getBalance",
            params: [metaAddress, "latest"],
          })
          .then((data) => {
            handleBalance(data);
          });
        metamaskButton.disabled = true;
        ethereum.request({ method: "net_version" }).then((data) => {
          handleNetwork(data);
        });
      } else {
        console.log("Manually login to your account");
      }
    });
  } else {
    alert("Metamask is not installed");
  }
};

const loginMeta = async () => {
  if (typeof window.ethereum == "undefined") {
    alert("Metamask is not installed");
    return;
  }
  if (window.ethereum) {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((data) => {
        metaAddress = data[0];
        ethereum
          .request({
            method: "eth_getBalance",
            params: [metaAddress, "latest"],
          })
          .then((data) => {
            handleBalance(data);
          });
        ethereum.request({ method: "net_version" }).then((data) => {
          handleNetwork(data);
        });
      })
      .catch((e) => console.log(e));
  }
};

ethereum.on("accountsChanged", (accounts) => {
  console.log("Account Changed!");
  ethereum
    .request({ method: "eth_requestAccounts", address: accounts[0] })
    .then((data) => {
      handleAddress(data);
      ethereum
        .request({ method: "eth_getBalance", params: [metaAddress, "latest"] })
        .then((data) => {
          handleBalance(data);
        });
    });
});

ethereum.on("chainChanged", (chainId) => {
  console.log(`Network Id Changed to ${parseInt(chainId)}!`);
  handleNetwork(parseInt(chainId));
  ethereum.request({ method: "eth_requestAccounts" }).then((data) => {
    handleAddress(data);
    ethereum
      .request({ method: "eth_getBalance", params: [metaAddress, "latest"] })
      .then((data) => {
        handleBalance(data);
      });
  });
  // window.location.reload();
});

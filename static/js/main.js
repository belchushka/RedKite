let web3Provider = "https://bsc-dataseed1.binance.org:443"
let user = null
let connectWalletBtn = document.querySelector("#connectWalletBtn")
let connectedWalletBtn = document.querySelector("#walletConnected")
let etBalance = document.querySelector("#etBalance")
let etCoinbase = document.querySelector("#etCoinbase")
let transactionAvaileble = false
let contracts = {}

fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Moscow').then(data=>{
    console.log(data);
})
initWeb3()
onRenderCheck()

connectWalletBtn.onclick = ()=>{
    login()
}

class User {
    constructor(coinbase) {
        this.coinbase = coinbase
        this.balance = null
    }
}

function onRenderCheck(){
    getCoinbase().then(coinbase=>{
        if (coinbase){
            createUser()
            getChainId().then(chainId=>{
                if(chainId!=web3.utils.toHex(97)){
                    transactionAvaileble = false
                }else{
                    transactionAvaileble = true

                }
            })
        }
    })
}


function initWeb3 () {
    if (typeof (web3) != "undefined") {
        web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider);
    } else {
        web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
        web3 = new Web3(web3Provider);
    }
    web3.eth.defaultAccount
}

function initializeContract(name,schema,hash){
    let contract =new web3.eth.Contract(schema,hash);
    contracts[name]=contract
}

function switchToBinance(){
    if (window.ethereum){
        ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: web3.utils.toHex(97),
                    chainName: "Smart Chain - Testnet",
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                    blockExplorerUrls: ["https://testnet.bscscan.com"],
                    nativeCurrency: {
                        name: "Binance",
                        symbol: "BNB",
                        decimals: 18,
                    }
                },
            ],
        }).then(()=>{
            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: web3.utils.toHex(97),
                    },
                ],
            }).then(res=>{
                transactionAvaileble = true
            })
        })
    }
}


function getCoinbase(){
    return web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
            return account
        }
    });
}

function getBalance(hash){
       return  web3.eth.getBalance(hash,"",(err, balance)=>{
            if (err === null) {
                return balance
            }
        });
}

function createUser(){
    getCoinbase().then(account=>{
        user = new User(account)
        getBalance(user.coinbase).then(balance=>{
            user.balance = balance
            connectWalletBtn.style.display = "none"
            connectedWalletBtn.style.display = "flex"
            etBalance = user.balance
            etCoinbase = user.coinbase
        })
    })
}

function wipeData(){
    user=null
    connectWalletBtn.style.display = "block"
    connectedWalletBtn.style.display = "none"
}

ethereum.on("accountsChanged", (accounts)=>{
    if (accounts.length>0){
        getCoinbase().then(account=>{
            if (account==null){
                wipeData()
            }else{
                createUser()
            }
        })
    }else{
        wipeData()
    }

})

function getChainId(){
    return ethereum.request({"method": "eth_chainId",})
}

ethereum.on('chainChanged', (chainId) => {
    if(chainId!=web3.utils.toHex(97)){
        transactionAvaileble = false
    }
});

function login(){
    switchToBinance()
    if(!user){
        ethereum.request({method:"eth_requestAccounts"}).then(
            createUser()
        )
    }
}








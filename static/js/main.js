let web3Provider = "https://data-seed-prebsc-1-s1.binance.org:8545"
let user = null
let connectWalletBtn = document.querySelector("#connectWalletBtn")
let connectedWalletBtn = document.querySelector("#walletConnected")
let etBalance = document.querySelector("#etBalance")
let etCoinbase = document.querySelector("#etCoinbase")
let BB = document.querySelector("#buy_button")
let BBinp = document.querySelector("#form_input")
let transactionAvaileble = false
let modalError = document.querySelector("#modalError")
let contracts = {}
let switchChainBtn = document.querySelector("#switchChainBtn")

initWeb3()
onRenderCheck()

connectWalletBtn.onclick = () => {
    login()
}

BB.onclick = ()=>{
    let value = BBinp.value
    makeTransaction(value)
}

switchChainBtn.onclick = ()=>{
    switchToBinance()
}

class User {
    constructor(coinbase) {
        this.coinbase = coinbase
        this.balance = null
    }
}

function onRenderCheck() {
    getCoinbase().then(coinbase => {
        if (coinbase) {
            createUser()
            getChainId().then(chainId => {
                if (chainId != web3.utils.toHex(97)) {
                    transactionAvaileble = false
                    switchLimit(1)
                } else {
                    transactionAvaileble = true
                    switchLimit(0)
                }
            })
        }
    })
}


function initWeb3() {
    if (typeof (web3) != "undefined") {
        web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider);
    } else {
        web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
        web3 = new Web3(web3Provider);
    }
    web3.eth.defaultAccount
}

function initializeContract(name, schema, hash) {
    let contract = new web3.eth.Contract(schema, hash);
    contracts[name] = contract
}

function switchToBinance() {
    if (window.ethereum) {
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
        }).then(() => {
            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: web3.utils.toHex(97),
                    },
                ],
            }).then(res => {
                transactionAvaileble = true
            })
        })
    }
}


function getCoinbase() {
    return web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
            return account
        }
    });
}

function getBalance(hash) {
    return ethereum.request({
        method:"eth_getBalance",
        params:[hash,"latest"]
    }).then(bal=>{
       return web3.utils.hexToNumberString(bal)/Math.pow(10,18);
    })
}

function createUser() {
    getCoinbase().then(account => {
        user = new User(account)
        getBalance(user.coinbase).then(balance => {
            user.balance = balance
            connectWalletBtn.style.display = "none"
            connectedWalletBtn.style.display = "flex"
            etBalance.innerHTML = user.balance.toFixed(5) + " BNB"
            etCoinbase.innerHTML = user.coinbase.substr(0,6)+"..."+user.coinbase.substr(user.coinbase.length-3)
        })
    })
}

function wipeData() {
    user = null
    connectWalletBtn.style.display = "block"
    connectedWalletBtn.style.display = "none"
}

ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
        getCoinbase().then(account => {
            if (account == null) {
                wipeData()
            } else {
                createUser()
            }
        })
    } else {
        wipeData()
    }
})

function getChainId() {
    return ethereum.request({"method": "eth_chainId",})
}

ethereum.on('chainChanged', (chainId) => {
    createUser()
    if (chainId != web3.utils.toHex(97)) {
        transactionAvaileble = false
        switchLimit(1)
    }else{
        switchLimit(0)
        transactionAvaileble = true
    }
});

function switchLimit(value){
    switch(value){
        case 1:
            modalError.style.display = "flex"
            BBinp.setAttribute("disabled", "disabled")
            break
        case 0:
            modalError.style.display = "none"
            BBinp.removeAttribute("disabled")
            break
    }
}

function login() {
    switchToBinance()
    if (!user) {
        ethereum.request({method: "eth_requestAccounts"}).then(
            createUser()
        )
    }
}

let makeTransaction = (value)=>{
    if (user && transactionAvaileble){
        let WeiValue = web3.utils.toWei(value,"ether")
        ethereum.request({
            method:"eth_sendTransaction",
            params:[
                {
                    from:user.coinbase,
                    to:"0x9610946e952756973A6069dE267eCD4A49D26B50",
                    value: web3.utils.toHex(WeiValue)
                }
            ]
        })
    }
}


let timeStart = 1639713600000
async function getTime(){
    let resp = await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=utc")
    resp = await resp.json()
    return resp
}

getTime().then(resp=>{
    let data = new Date(resp.dateTime)
    if (timeStart-data<=0 || true){
        makeTransaction = (value)=>{
            console.log(value);
        }
    }
})





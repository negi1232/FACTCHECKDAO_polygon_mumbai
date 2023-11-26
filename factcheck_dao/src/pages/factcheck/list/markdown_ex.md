# erc20_token

- This explains how to mint/send/show ERC20 tokens on kovan testnet

- ERC20 Contract <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol>


## Install nodejs, npm, git
```
sudo apt install nodejs npm
sudo apt install git

sudo add-apt-repository ppa:ethereum/ethereum
sudo add-apt-repository ppa:ethereum/ethereum-dev
sudo apt update
sudo apt install solchereum/ethereum-dev
sudo apt update
sudo apt install solc
```


## Install brownie and ganache

```
sudo pip3 install eth-brownie
```

```
sudo npm install -g ganache-cli
```
or 
```
sudo npm install -g ganache
```


## Settings of ethereum kovan testnet

- Insert web3 infura project ID from infura <https://infura.io> into ***

```
export WEB3_INFURA_PROJECT_ID='***'
```


- Inset your private key from your metamask account into ***

```
export PRIVATE_KEY=***
```


## Get ETH of kovan testnet from faucet

- Install Metamask <https://metamask.io/>
  To do this, you can follow the instruction from ![this](MetaMask_HowToCreateAccount.pdf). (Thanks to Hikaru!)
- Then, get an account address
- Get some ETH from faucent (more than 0.004 ETH is recommended) <https://ethdrop.dev> or <https://gitter.im/kovan-testnet/faucet>


## git clone

```
git clone https://github.com/fujihalab/erc20_token.git
```


## Edit contract 

- Edit token name (default: FujihaLab Token) and symbol (default: FLT) in contracts/MyERC20Token.sol


## Test minting tokens using ganache

- Open 1st terminal, then run the following command

```
$ ganache-cli 
```

- Open 2nd terminal, then run the following command

```
brownie run scripts/mint_token.py

```


## Mint token

- Then, run the following command

```
brownie run scripts/mint_token.py --network kovan
```

The standard output goes like this:

```
Brownie v1.18.1 - Python development framework for Ethereum
"
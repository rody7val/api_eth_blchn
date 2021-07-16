# eth-blchn
### Dependences:
- [node.js](https://nodejs.org/)
- [mongodb](https://docs.mongodb.com/guides/server/install/)
- Ganache CLI
  ```
  npm install ganache-cli -g
  ```
- Truffle 
  ```
  npm install truffle -g
  ```
### Getting started:
Run local ethereum:
```
ganache-cli
```
In another shell:
```
git clone https://github.com/rody7val/api_eth_blchn
npm install
cd api_eth_blchn
truffle init
truffle compile
truffle migrate
npm run build
```
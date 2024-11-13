# gas 方案

对新用户而言，获得 SUI 作为gas去与应用交互是比较麻烦的。在Sui上有两种方案可以为用户解决gas的问题，分别是 `赞助交易` 和 `批量分发gas`.

## 赞助交易

Sui可以由中心化的gas提供商为用户支付交易所需的gas, 这叫做[赞助交易 Sponsored Transactions](https://docs.sui.io/concepts/transactions/sponsored-transactions)。

赞助交易可以分别由用户端发起，或赞助方发起。

### 用户端发起流程

1. 用户发起一笔无gas交易`GasLessTransactionData`.
2. 用户将无gas交易`GasLessTransactionData`发送给赞助方。
3. 赞助方验证交易后，构建包含gas费的交易数据`TransactionData`, 然后签署该交易数据。
4. 赞助方将签署后的交易数据`TransactionData`和赞助方签名发回给用户。
5. 用户验证交易数据后，签署交易数据`TransactionData`, 并将带有两份交易签名的交易，通过全节点或者赞助方提交给Sui网络。

### 赞助方发起流程

1. 赞助方构建包含交易费的交易数据`TransactionData`, 签署交易后和交易签名一起发给用户。
2. 用户检查交易数据后，为交易签署第二份签名。
3. 用户将带有两份交易签名的交易通过全节点或者赞助方提交给Sui网络。

在为用户提供赞助交易服务时，如果同一笔 `Coin<SUI> gas` 在不同的交易中同时被使用，就会因为双花安全问题被锁住一个epoch. 为了避免这个问题，会将 `Coin<SUI> gas` 分割成很多的不同的Object, 被不同的赞助交易去使用。

Mysten 开源了 [Sui Gas Pool](https://github.com/MystenLabs/sui-gas-pool) 的技术方案，也可以注册并使用[由Shinami提供的赞助交易服务](https://www.shinami.com/gas-station)。

## 批量分发gas


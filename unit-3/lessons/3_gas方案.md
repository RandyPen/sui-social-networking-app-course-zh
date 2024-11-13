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

本小节教程仅作概要介绍，在实际项目中还会存在许多工程细节。比如，在为用户提供赞助交易服务时，如果同一笔 `Coin<SUI> gas` 在不同的交易中同时被使用，就会因为双花安全问题被锁住一个epoch. 为了避免这个问题，会将 `Coin<SUI> gas` 分割成很多的不同的Object, 被不同的赞助交易去使用。也要考虑限制单个用户地址、单个IP的调用频次等。

更具体的，可以参考 Mysten 开源的 [Sui Gas Pool](https://github.com/MystenLabs/sui-gas-pool) 技术方案，也可以注册并使用[由Shinami提供的赞助交易服务](https://www.shinami.com/gas-station)。

## 批量分发gas

还有的应用项目会选择更加简易的方案，对新注册的用户地址，如果收到申请 gas 的请求，会每隔一段时间，集中分发 gas, 每个地址都能领到 0.01 SUI 作为gas.

[send_gas的示例项目](../example_projects/send_gas)中提供了批量转发gas的[示例合约](../example_projects/send_gas/sources/send_gas.move)与[示例TypeScript代码](../example_projects/send_gas/scripts/send.ts)。

在合约代码中，批量转发gas函数定义如下。
```rust
public fun send_gas(
    coin: &mut Coin<SUI>,
    value: u64,
    mut recipients: vector<address>,
    ctx: &mut TxContext
) {
    let len = vector::length(&recipients);
    let mut i = 0;

    while (i < len) {
        let recipient = vector::pop_back(&mut recipients);
        let to_sent = coin::split<SUI>(coin, value, ctx);
        transfer::public_transfer(to_sent, recipient);
        i = i + 1;
    };
}
```

在调用的TypeScript程序中，构建PTB交易信息如下。
```TypeScript
const tx = new Transaction();
tx.moveCall({
    package: PACKAGE_ID,
    module: "send_gas",
    function: "send_gas",
    arguments: [
        tx.gas,
        tx.pure(bcs.U64.serialize(0.01 * 1_000_000_000)),
        tx.pure(bcs.vector(bcs.Address).serialize(recipients).toBytes()),
    ],
});
```
第一个参数默认情况下是tx.gas, 也就是`Coin<SUI>`.  
第二个参数是value, 0.01 SUI = 0.01 * 1_000_000_000 MIST, 所以要输入 10_000_000.  
第三个参数是所有接收地址。  
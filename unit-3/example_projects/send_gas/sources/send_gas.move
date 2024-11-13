module send_gas::send_gas;

use sui::{
    coin::{Self, Coin},
    sui::SUI
};

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
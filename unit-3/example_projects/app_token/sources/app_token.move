module app_token::app;

use std::{
    string::String
};
use sui::{
    coin::{Self, TreasuryCap},
    token::{Self, TokenPolicy, Token},
    table::{Self, Table},
    event::emit,
    url::new_unsafe_from_bytes
};
use app_token::profile::{Self, Profile};


const DECIMALS: u8 = 0;
const SYMBOLS: vector<u8> = b"APP";
const NAME: vector<u8> = b"App";
const DESCRIPTION: vector<u8> = b"Token for Application";
const ICON_URL: vector<u8> = b"https://";  // Coin / Token Icon

// ------ Errors -----------
const EWrongAmount: u64 = 0;

public struct APP has drop {}

public struct AdminCap has key, store {
    id: UID,
}

public struct AppTokenCap has key {
    id: UID,
    cap: TreasuryCap<APP>,
}

public struct PriceRecord has key {
    id: UID,
    prices: Table<String, u64>,
}

public struct PurchasedRecord has key {
    id: UID,
    record: Table<String, bool>,
}

// ------ Events ---------
public struct BuyEvent has copy, drop {
    buyer: address,
    item: String,
    price: u64,
}

public struct Click2EarnEvent has copy, drop {
    user: address,
    amount: u64,
}

// ------ Functions ---------
fun init(otw: APP, ctx: &mut TxContext) {
    let deployer = ctx.sender();
    let admin_cap = AdminCap { id: object::new(ctx) };
    transfer::public_transfer(admin_cap, deployer);

    let (treasury_cap, metadata) = coin::create_currency<APP>(
        otw,
        DECIMALS,
        SYMBOLS, 
        NAME, 
        DESCRIPTION, 
        option::some(new_unsafe_from_bytes(ICON_URL)), 
        ctx
    );

    let (mut policy, cap) = token::new_policy<APP>(
        &treasury_cap, ctx
    );

    let token_cap = AppTokenCap {
        id: object::new(ctx),
        cap: treasury_cap,
    };

    let price_record = PriceRecord { 
        id: object::new(ctx),
        prices: table::new<String, u64>(ctx),
    };

    token::allow(&mut policy, &cap, token::spend_action(), ctx);
    token::share_policy<APP>(policy);
    transfer::share_object(token_cap);
    transfer::share_object(price_record);
    transfer::public_transfer(cap, deployer);
    transfer::public_freeze_object(metadata);
}

public fun get_purchased_record(ctx: &mut TxContext) {
    let record = PurchasedRecord {
        id: object::new(ctx),
        record: table::new<String, bool>(ctx),
    };
    transfer::transfer(record, ctx.sender());
}

public fun buy(
    payment: Token<APP>,
    price_record: &PriceRecord,
    purchased_record: &mut PurchasedRecord,
    item: String,
    token_prolicy: &mut TokenPolicy<APP>,
    ctx: &mut TxContext
) {
    let price = &price_record.prices[item];
    assert!(token::value<APP>(&payment) == *price, EWrongAmount);
    let req = token::spend(payment, ctx);
    token::confirm_request_mut(token_prolicy, req, ctx);
    table::add<String, bool>(&mut purchased_record.record, item, true);
    emit(BuyEvent {
        buyer: ctx.sender(),
        item,
        price: *price,
    });
}

public fun click2earn(
    profile: &mut Profile,
    token_cap: &mut AppTokenCap,
    ctx: &mut TxContext
) {
    profile::click(profile, ctx);
    let app_token = token::mint(&mut token_cap.cap, profile::points(profile), ctx);
    emit(Click2EarnEvent {
        user: ctx.sender(),
        amount: token::value<APP>(&app_token),
    });
    let req = token::transfer<APP>(app_token, ctx.sender(), ctx);
    token::confirm_with_treasury_cap<APP>(
        &mut token_cap.cap,
        req,
        ctx
    );
}

// ------ Admin Functions ---------
// for token::flush 
public fun treasury_borrow_mut(
    _admin: &AdminCap,
    app_token_cap: &mut AppTokenCap,
): &mut TreasuryCap<APP> {
    &mut app_token_cap.cap
}

public fun set_item_price(
    _admin: &AdminCap,
    price_record: &mut PriceRecord,
    item: String,
    price: u64,
) {
    if (table::contains<String, u64>(&price_record.prices, item)) {
        let item_price = &mut price_record.prices[item];
        *item_price = price;
    } else {
        table::add<String, u64>(&mut price_record.prices, item, price);
    };
}

public fun remove_item_price(
    _admin: &AdminCap,
    price_record: &mut PriceRecord,
    item: String,
) {
    table::remove<String, u64>(&mut price_record.prices, item);
}
module sign_up_table::sign_up_table;

use std::string::String;
use sui::table::{Self, Table};

public struct AdminCap has key, store {
    id: UID,
}

public struct HandleRecord has key {
    id: UID,
    record: Table<String, bool>,
}

#[allow(unused_field)]
public struct Profile has key {
    id: UID,
    handle: String,
    points: u64,
    last_time: u64,
}

fun init(ctx: &mut TxContext) {
    let admin = AdminCap {
        id: object::new(ctx),
    };
    transfer::public_transfer(admin, ctx.sender());

    let handle_record = HandleRecord {
        id: object::new(ctx),
        record: table::new<String, bool>(ctx),
    };
    transfer::share_object(handle_record);
}

public fun mint(
    _admin: &AdminCap, 
    handle_record: &mut HandleRecord, 
    handle: String, 
    recipient: address, 
    ctx: &mut TxContext
) {
    table::add<String, bool>(&mut handle_record.record, handle, true);
    let profile = new(handle, ctx);
    transfer::transfer(profile, recipient);
}

public fun new(handle: String, ctx: &mut TxContext): Profile {
    Profile {
        id: object::new(ctx),
        handle,
        points: 0,
        last_time: 0,
    }
}
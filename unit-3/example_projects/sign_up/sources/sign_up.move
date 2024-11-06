module sign_up::sign_up;

use std::string::String;

public struct AdminCap has key, store {
    id: UID,
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
}

public fun mint(_admin: &AdminCap, handle: String, recipient: address, ctx: &mut TxContext) {
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
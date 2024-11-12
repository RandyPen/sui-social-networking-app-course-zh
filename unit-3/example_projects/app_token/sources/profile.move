module app_token::profile;

use std::string::String;

public struct Profile has key {
    id: UID,
    handle: String,
    points: u64,
    last_time: u64,
}

public fun mint(handle: String, ctx: &mut TxContext) {
    let sender = ctx.sender();
    let profile = new(handle, ctx);
    transfer::transfer(profile, sender);
}

public fun click(profile: &mut Profile, ctx: &TxContext) {
    let this_epoch_time = ctx.epoch_timestamp_ms();
    assert!(this_epoch_time > profile.last_time);
    profile.last_time = this_epoch_time;
    profile.points = profile.points + 1;
}

public fun burn(profile: Profile, ctx: &TxContext) {
    let this_epoch_time = ctx.epoch_timestamp_ms();
    assert!(this_epoch_time > profile.last_time);
    let Profile {
        id,
        ..
    } = profile;
    object::delete(id);
}

public fun points(profile: &Profile): u64 {
    profile.points
}

fun new(handle: String, ctx: &mut TxContext): Profile {
    Profile {
        id: object::new(ctx),
        handle,
        points: 0,
        last_time: 0,
    }
}



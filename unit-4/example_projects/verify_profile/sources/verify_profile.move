module verify_profile::profile;

use std::string::String;
use sui::{
    clock::Clock,
    bcs,
    hash,
    ed25519
};

const PK: vector<u8> = vector[185, 198, 238, 22, 48, 
    239, 62, 113, 17, 68, 166, 72, 219, 6, 187, 178, 
    40, 79, 114, 116, 207, 190, 229, 63, 252, 238, 80, 
    60, 193, 164, 146, 0];
const ONE_HOUR_IN_MS: u64 = 60 * 60 * 1000;

public struct Profile has key {
    id: UID,
    handle: String,
    points: u64,
    last_time: u64,
}

public struct ProfileData has drop {
    id: ID,
    add_points: u64,
    last_time: u64,
}

public fun mint(handle: String, ctx: &mut TxContext) {
    let sender = ctx.sender();
    let profile = new(handle, ctx);
    transfer::transfer(profile, sender);
}

public fun click(profile: &mut Profile, clock: &Clock) {
    let now = clock.timestamp_ms();
    assert!(now > profile.last_time + ONE_HOUR_IN_MS);
    profile.last_time = now;
    profile.points = profile.points + 1;
}

public fun add_points(
    profile: &mut Profile, 
    add_points: u64, 
    sig: vector<u8>,
    clock: &Clock
) {
    let profile_data = ProfileData {
        id: object::id(profile),
        add_points,
        last_time: profile.last_time,
    };
    let byte_data = bcs::to_bytes(&profile_data);
    let hash_data = hash::keccak256(&byte_data);
    let pk = PK;
    let verify = ed25519::ed25519_verify(&sig, &pk, &hash_data);
    assert!(verify == true);

    profile.points = profile.points + add_points;
    profile.last_time = clock.timestamp_ms();
}

public fun burn(profile: Profile) {
    let Profile {
        id,
        ..
    } = profile;
    object::delete(id);
}

fun new(handle: String, ctx: &mut TxContext): Profile {
    Profile {
        id: object::new(ctx),
        handle,
        points: 0,
        last_time: 0,
    }
}



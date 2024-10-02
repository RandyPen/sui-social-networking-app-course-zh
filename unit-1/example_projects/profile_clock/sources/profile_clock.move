module profile_clock::profile_clock {
    use std::string::String;
    use sui::clock::Clock;

    const ONE_HOUR_IN_MS: u64 = 60 * 60 * 1000;

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

    public fun click(profile: &mut Profile, clock: &Clock) {
        let now = clock.timestamp_ms();
        assert!(now > profile.last_time + ONE_HOUR_IN_MS);
        profile.last_time = now;
        profile.points = profile.points + 1;
    }

    public fun burn(profile: Profile) {
        let Profile {
            id,
            ..
        } = profile;
        object::delete(id);
    }

    public fun new(handle: String, ctx: &mut TxContext): Profile {
        Profile {
            id: object::new(ctx),
            handle,
            points: 0,
            last_time: 0,
        }
    }

}


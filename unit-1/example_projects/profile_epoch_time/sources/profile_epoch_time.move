module profile_epoch_time::profile_epoch_time {
    use std::string::String;

    public struct Profile has key {
        id: UID,
        handle: String,
        points: u64,
        last_time: u64,
    }

    public fun mint(recipient: address, handle: String, ctx: &mut TxContext) {
        let profile = new(handle, ctx);
        transfer::transfer(profile, recipient);
    }

    public fun click(profile: &mut Profile, ctx: &TxContext) {
        let this_epoch_time = ctx.epoch_timestamp_ms();
        assert!(this_epoch_time > profile.last_time);
        profile.last_time = this_epoch_time;
        profile.points = profile.points + 1;
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
}


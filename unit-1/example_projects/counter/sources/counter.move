module counter::counter {

    public struct Counter has key, store {
        id: UID,
        times: u64,
    }

    public fun mint(recipient: address, ctx: &mut TxContext) {
        let counter = new(ctx);
        transfer::public_transfer(counter, recipient);
    }

    public fun count(counter: &mut Counter) {
        counter.times = counter.times + 1;
    }

    public fun burn(counter: Counter) {
        let Counter {
            id,
            ..
        } = counter;
        object::delete(id);
    }

    fun new(ctx: &mut TxContext): Counter {
        Counter {
            id: object::new(ctx),
            times: 0,
        }
    }
}

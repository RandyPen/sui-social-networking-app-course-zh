module counter_event::counter_event {
    use sui::event::emit;

    public struct Counter has key, store {
        id: UID,
        times: u64,
    }

    public struct CountEvent has copy, drop {
        id: ID,
        times: u64,
    }

    public fun mint(recipient: address, ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            times: 0,
        };
        transfer::public_transfer(counter, recipient);
    }

    public fun count(counter: &mut Counter) {
        counter.times = counter.times + 1;

        emit(
            CountEvent {
                id: object::id(counter),
                times: counter.times,
            }
        );
    }

    public fun burn(counter: Counter) {
        let Counter {
            id,
            ..
        } = counter;
        object::delete(id);
    }
}

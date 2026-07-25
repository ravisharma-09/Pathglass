export function* takeFrom<T>(
    items: Iterable<T>,
    count: number,
): Generator<T>{
    if (count === 0){
        return ;
    }
    let taken = 0;
    for (const item of items){
        yield item;
        taken++;
        if (taken === count){
            return ;
        }
    }
}
export function* filterFrom<T>(
    items: Iterable<T>, 
    predicate:(item: T)=> boolean,
): Generator<T> {
    for (const item of items){
        if (predicate(item)){
            yield item ;
        }
    }
}
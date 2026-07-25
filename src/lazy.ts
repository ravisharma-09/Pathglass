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
export function* uniqueFrom<T, K>(
    items: Iterable<T>,
    getKey: (item:T) => K,

):Generator<T> {
    const seen = new Set<K>();

    for (const item of items){
        const key = getKey(item) ;

        if(seen.has(key)){
            continue ;
        }

        seen.add(key) ;
        yield item ;
    }
}
   
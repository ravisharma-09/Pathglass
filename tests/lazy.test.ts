import { describe, expect,it } from "vitest";
import { filterFrom , takeFrom , uniqueFrom} from "../src/lazy";



describe("lazy helpers", () => {
    it("takes only the requested items", ()=>{
        const values = takeFrom(
            [1,2,3,4],
            2,
        );
        expect([...values]).toEqual([1,2]);
    });
    it("does not read unnecessary items", () =>{
        let generated = 0 ;
        function* numbers() {
            for (const value of [1,2,3,4]) {
                generated++ ;
                yield value ;

            }
        }
        const results = [
            ...takeFrom(numbers(), 2),
        ];
        expect(results).toEqual([1,2]) ;
        expect(generated).toBe(2) ;
    });
    it("yields only items that match the filter", ()=>{
        const numbers =[1,2,3,4,5] ;
        const results = Array.from(
            filterFrom(numbers, (number) => number % 2 === 0),
        );
        expect(results).toEqual([2,4]) ;
    });
    it("filters items only as they are requested", () => {
        const visited: number[] = [] ;

        function* numbers() {
            for (const number of [1, 2, 3, 4]){
                visited.push(number);
                yield number;
            }
        }
        const iterator = filterFrom(
            numbers(),
            (number) => number % 2 === 0,
        );
        expect(visited).toEqual([]);

        const firstResult = iterator.next() ;

        expect(firstResult.value).toBe(2) ;
        expect(visited).toEqual([1,2]) ;
    });
    it("yield only the first item with each key", () => {
        const items = [
            {id: "ravi"},
            { id: "northflow"},
            { id: "ravi"},
        ];
        const results = Array.from(
            uniqueFrom(items, (item) => item.id),

        );
        expect(results).toEqual([
            items[0],
            items[1],
        ]);
    });
    it("checks for duplicates only as items as requested", () => {
        const visited: number[] = [] ;

        function* numbers(){
            for(const number of [1,1,2,3]){
                visited.push(number);
                yield number ;

            }
        }
        const iterator = uniqueFrom(
            numbers(),
            (number) => number,

        );
        expect(visited).toEqual([]) ;
        expect(iterator.next().value).toBe(1) ;
        expect(visited).toEqual([1]);

        expect(iterator.next().value).toBe(2);
        expect(visited).toEqual([1,1,2]);
    });
});

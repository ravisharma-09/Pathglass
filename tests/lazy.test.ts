import { describe, expect,it } from "vitest";
import { takeFrom } from "../src/lazy";
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
});

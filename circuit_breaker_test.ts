import { assert, assertEquals, assertThrows, assertThrowsAsync } from "https://deno.land/std/testing/asserts.ts";
import { CircuitBreaker, State } from './circuit_breaker.ts';
import { SimpleValidator } from './validators/simple_circuit_validator.ts';
import { Validator } from './interfaces/validator.ts'

Deno.test("validate error throw", async function (): Promise<void> {

    const validator = <Validator>new SimpleValidator({ closeTimeout: 0 });
    const circuitBreaker = new CircuitBreaker(validator);
    const error500url = "http://www.mocky.io/v2/5ecb13e43000009e00ddd4aa";

    await (await circuitBreaker.fetch(error500url)).text()
    await (await circuitBreaker.fetch(error500url)).text()
    await (await circuitBreaker.fetch(error500url)).text()

    await assertThrowsAsync(async () => {
        await (await circuitBreaker.fetch(error500url)).text()
    });

});

Deno.test("start opened", function () {
    // arrange
    const expected = State.Opened;
    const validator = <Validator>new SimpleValidator({ closeTimeout: 0 });
    // act
    const circuit = new CircuitBreaker(validator);
    const actual = (<any>circuit).state;
    // assert8
    assertEquals(actual, expected);
});

Deno.test("close", function () {
    // arrange
    const validator = <Validator>new SimpleValidator({ closeTimeout: 0 });
    const circuit = new CircuitBreaker(validator);
    const expected = State.Closed;
    // act
    circuit.close();
    const actual = (<any>circuit).state;
    //assert
    assertEquals(actual, expected);
});
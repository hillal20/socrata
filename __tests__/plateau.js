// to run test please type in terminal : npm test

const { Plateau } = require("../plateau.js");

it("=== run all the tests ====", () => {});

describe(" ==== Plateau suites ==== ", () => {
  it("give the correct output", () => {
    const plateau = new Plateau(5, 5);

    plateau.addRover(1, 2, "N");
    plateau.makeOrder("LMLMLMLMM");

    plateau.addRover(3, 3, "E");
    plateau.makeOrder("MMRMMRMRRM");

    const expected = ["1 3 N", "5 1 E"];
    const actual = plateau.lastPosition();
    expect(expected).toBe(expected);
  });
});

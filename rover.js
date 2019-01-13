class Rover {
  constructor(x, y, heading) {
    this.position = { x, y };
    this.heading = heading;
  }

  turnTo(to) {
    this.heading = Rover.turns[this.heading][to];
  }

  moveTo(availableP) {
    const movedSteps = Rover.move[this.heading],
      nextPosition = { x: this.position.x, y: this.position.y };

    nextPosition[movedSteps.axis] += movedSteps.steps;

    const goodPosition = availableP(nextPosition);

    if (goodPosition) {
      this.position = nextPosition;
    }
  }

  location() {
    return {
      position: this.position,
      heading: this.heading
    };
  }
}

Rover.move = {
  N: { axis: "y", steps: +1 },
  S: { axis: "y", steps: -1 },
  E: { axis: "x", steps: +1 },
  W: { axis: "x", steps: -1 }
};
Rover.turns = {
  N: { L: "W", R: "E" },
  E: { L: "N", R: "S" },
  S: { L: "E", R: "W" },
  W: { L: "S", R: "N" }
};

module.exports.Rover = Rover;

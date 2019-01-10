class Rover {
  constructor(x, y, heading) {
    this.pos = { x, y };
    this.heading = heading;
  }

  turnTo(to) {
    this.heading = Rover.turns[this.heading][to];
  }

  moveTo(predicate) {
    const moveBy = Rover.move[this.heading],
      nextPos = { x: this.pos.x, y: this.pos.y };

    nextPos[moveBy.axis] += moveBy.steps;

    const isLegal = predicate(nextPos);

    if (isLegal) {
      this.pos = nextPos;
    }
  }

  getState() {
    return {
      pos: this.pos,
      heading: this.heading
    };
  }
}

Rover.turns = {
  N: { L: "W", R: "E" },
  E: { L: "N", R: "S" },
  S: { L: "E", R: "W" },
  W: { L: "S", R: "N" }
};

Rover.move = {
  N: { axis: "y", steps: +1 },
  S: { axis: "y", steps: -1 },
  E: { axis: "x", steps: +1 },
  W: { axis: "x", steps: -1 }
};
///////////////////////////////////////////////////////////
class Plateau {
  constructor(maxX, maxY) {
    this.size = {
      x: maxX,
      y: maxY
    };

    this.rovers = [];
    this.currentRover = null;

    this.availableP = this.availableP.bind(this);
    this.executeCommand = this.executeCommand.bind(this);
  }

  availableP(nextPos) {
    return this.truePosition(nextPos) && !this.getRoverByPosition(nextPos);
  }

  truePosition({ x, y }) {
    return x > -1 && y > -1 && x <= this.size.x && y <= this.size.y;
  }

  getRoverByPosition({ x, y }) {
    return this.rovers.find(rover => {
      const state = rover.getState();

      return state.pos.x === x && state.pos.y === y;
    });
  }

  addRover(x, y, heading) {
    this.currentRover = null;

    if (!this.availableP({ x, y })) {
      return false;
    }

    const rover = new Rover(x, y, heading);

    this.rovers.push(rover);
    this.currentRover = rover;

    return this.rovers.length - 1;
  }

  activateRover(index) {
    return !!(this.currentRover = this.rovers[index]);
  }

  executeCommand(command) {
    if (!this.currentRover) {
      return false;
    }

    if (command === "M") {
      return this.currentRover.moveTo(this.availableP);
    }

    if (command === "L" || command === "R") {
      return this.currentRover.turnTo(command);
    }
  }

  sendCommand(commandList) {
    [...commandList].forEach(this.executeCommand);
  }

  getFinalPositions() {
    return this.rovers.map(rover => {
      const state = rover.getState();

      return `${state.pos.x} ${state.pos.y} ${state.heading}`;
    });
  }
}

const newPlateau = new Plateau(5, 5);

newPlateau.addRover(1, 2, "N");
newPlateau.sendCommand("LMLMLMLMM");

newPlateau.addRover(3, 3, "E");
newPlateau.sendCommand("MMRMMRMRRM");

console.log(newPlateau.getFinalPositions());

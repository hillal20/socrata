class Rover {
  constructor(x, y, heading) {
    this.position = { x, y };
    this.heading = heading;
  }

  turnTo(to) {
    this.heading = Rover.turns[this.heading][to];
  }

  moveTo(availableP) {
    const moveBy = Rover.move[this.heading],
      nextPosition = { x: this.position.x, y: this.position.y };

    nextPosition[moveBy.axis] += moveBy.steps;

    const isLegal = availableP(nextPosition);

    if (isLegal) {
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
  }

  availableP(nextPos) {
    return this.truePosition(nextPos) && !this.roverPosition(nextPos);
  }

  truePosition({ x, y }) {
    return x > -1 && y > -1 && x <= this.size.x && y <= this.size.y;
  }

  roverPosition({ x, y }) {
    return this.rovers.find(rover => {
      const location = rover.location();

      return location.position.x === x && location.position.y === y;
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

  checkRover(index) {
    if ((this.currentRover = this.rovers[index])) {
      return true;
    } else {
      return false;
    }
  }

  makeOrder(orders) {
    [...orders].forEach(order => {
      if (!this.currentRover) {
        return false;
      }

      if (order === "M") {
        return this.currentRover.moveTo(this.availableP);
      }

      if (order === "L" || order === "R") {
        return this.currentRover.turnTo(order);
      }
    });
  }

  lastPosition() {
    return this.rovers.map(rover => {
      const location = rover.location();

      return `${location.position.x} ${location.position.y} ${
        location.heading
      }`;
    });
  }
}

const newPlateau = new Plateau(5, 5);
newPlateau.addRover(1, 2, "N");
newPlateau.makeOrder("LMLMLMLMM");
newPlateau.addRover(3, 3, "E");
newPlateau.makeOrder("MMRMMRMRRM");
console.log(newPlateau.lastPosition());

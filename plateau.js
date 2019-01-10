class Rover {
  constructor(x, y, heading) {
    this.pos = { x, y };
    this.heading = heading;
  }

  /**
   * Rotate to given direction. L or R.
   */
  rotate(to) {
    this.heading = Rover.rotateMap[this.heading][to];
  }

  /**
   * Move one step forward.
   */
  move(predicate) {
    const moveBy = Rover.moveMap[this.heading],
      nextPos = { x: this.pos.x, y: this.pos.y };

    // Set next pos.
    nextPos[moveBy.axis] += moveBy.amount;

    // Check if move is legal.
    const isLegal = predicate(nextPos);

    // Update position if move is legal.
    if (isLegal) {
      this.pos = nextPos;
    }
  }

  /**
   * Get current state.
   */
  getState() {
    return {
      pos: this.pos,
      heading: this.heading
    };
  }
}

/**
 * Rotate map by compass directions.
 */
Rover.rotateMap = {
  N: { L: "W", R: "E" },
  E: { L: "N", R: "S" },
  S: { L: "E", R: "W" },
  W: { L: "S", R: "N" }
};

/**
 * Move map by compass directions.
 */
Rover.moveMap = {
  N: { axis: "y", amount: +1 },
  S: { axis: "y", amount: -1 },
  E: { axis: "x", amount: +1 },
  W: { axis: "x", amount: -1 }
};

/**
 * Export Rover.
 */
/**
 * Get dependencies.
 */

/**
 * Manager class for Rovers.
 */
class MarsRover {
  /**
   * Create initial data.
   */
  constructor(xSize, ySize) {
    this.size = {
      x: xSize,
      y: ySize
    };

    this.rovers = [];
    this.activeRover = null;

    this.isPositionAvailable = this.isPositionAvailable.bind(this);
    this.executeCommand = this.executeCommand.bind(this);
  }

  /**
   * Check for plateau borders and rover collisions.
   */
  isPositionAvailable(nextPos) {
    return this.isPositionExist(nextPos) && !this.getRoverByPosition(nextPos);
  }

  /**
   * Check if given coordinates exist on plateau.
   */
  isPositionExist({ x, y }) {
    return x > -1 && y > -1 && x <= this.size.x && y <= this.size.y;
  }

  /**
   *  Get rover which on given position.
   */
  getRoverByPosition({ x, y }) {
    return this.rovers.find(rover => {
      const state = rover.getState();

      return state.pos.x === x && state.pos.y === y;
    });
  }

  /**
   * Add and activate rover.
   */

  addRover(x, y, heading) {
    this.activeRover = null;

    // Dont add rover over another one.
    if (!this.isPositionAvailable({ x, y })) {
      return false;
    }

    // Create rover.
    const rover = new Rover(x, y, heading);

    this.rovers.push(rover);
    this.activeRover = rover;

    // This index number acts like an id,
    // and can be used to activate this rover later.
    return this.rovers.length - 1;
  }

  /**
   * Activate rover with given index number.
   */
  activateRover(index) {
    return !!(this.activeRover = this.rovers[index]);
  }

  /**
   * Execute single command.
   */
  executeCommand(command) {
    if (!this.activeRover) {
      return false;
    }

    if (command === "M") {
      return this.activeRover.move(this.isPositionAvailable);
    }

    if (command === "L" || command === "R") {
      return this.activeRover.rotate(command);
    }
  }

  /**
   * Distribute command to active rover.
   */
  sendCommand(commandList) {
    [...commandList].forEach(this.executeCommand);
  }

  /**
   * Simply create array of rover position summaries.
   */
  getFinalPositions() {
    return this.rovers.map(rover => {
      const state = rover.getState();

      return `${state.pos.x} ${state.pos.y} ${state.heading}`;
    });
  }
}

/**
 * Export MarsRover.
 */
const marsRover = new MarsRover(5, 5);

marsRover.addRover(1, 2, "N");
marsRover.sendCommand("LMLMLMLMM");

marsRover.addRover(3, 3, "E");
marsRover.sendCommand("MMRMMRMRRM");

console.log(marsRover.getFinalPositions());

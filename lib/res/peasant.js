
let mId = Symbol('id');
let mName = Symbol('name');
let mYear = Symbol('year');

export class Peasant {
  constructor(data) {
    this[mId] = data.id;
    this[mName] = data.name;
    this[mYear] = data.year;
  }

  getName() {
    return this[mName];
  }
}

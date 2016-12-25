export default class LearningDataModel {
  constructor(preflop, flop, turn, river) {
   this.data = {preflop: preflop, flop: flop, turn: turn, river: river};
  }

  getData(key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : '';
  }
}

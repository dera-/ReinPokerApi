export default class LearningDataModel {
  constructor(preflop, flop, turn, river) {
   this.data = {preflop: preflop, flop: flop, turn: turn, river: river};
  }

  getData(key) {
    freturn this.data.hasOwnProperty(key) ? this.data[key] : '';
  }
}
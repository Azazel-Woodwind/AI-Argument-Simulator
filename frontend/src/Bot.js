class Bot {
  static DEFAULT_MODEL = "text-davinci-002";
  static DEFAULT_TEMP = 0;
  static DEFAULT_FREQ_PENALTY = 0;
  static DEFAULT_PRES_PENALTY = 0;

  constructor(name, isFor) {
    console.log("a bot was created called " + name);
    this.name = name;
    this.isFor = isFor;
    this.setDefaults();
  }

  setDefaults() {
    this.model = Bot.DEFAULT_MODEL;
    this.temp = Bot.DEFAULT_TEMP;
    this.freqPenalty = Bot.DEFAULT_FREQ_PENALTY;
    this.presPenalty = Bot.DEFAULT_PRES_PENALTY;
  }
}

export default Bot;

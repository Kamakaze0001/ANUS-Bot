// The Maybe monad
class Maybe {
  static of(value) {
    return new Maybe(value);
  }
  
  constructor(value) {
    this.__value =  value;
  }

  isNothing() {
    return this.__value === null || this.__value === undefined;
  }

  map(func) {
    return Maybe.of(this.isNothing() ? null : func(this.__value));
  }
  
  then(func) {
    return Maybe.of(this.isNothing() ? null : func(this.__value));
  }
}

//I want a cute synonym for holding messages
const Envelope = Maybe
Envelope.prototype.with = Maybe.of

exports.Maybe = Maybe;
exports.Envelope = Envelope;
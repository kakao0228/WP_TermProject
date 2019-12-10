const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  tourId: {Schema.Types.ObjectId, ref: 'Tour'},
  customorId: {Schema.Types.ObjectId, ref: 'User'},
  tourDate: {type:Date, trim: true, required: true},
  // 흠... 토탈 프라이스를 사람 수 * 한 사람당 가격 수 가능?
  numberOfPerson: {type: Number, trim: true, required: true},
  totalPrice: {type: Number, trim: true, required: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  tour: {type: Schema.Types.ObjectId, ref: 'Tour'},
  customor: {type: Schema.Types.ObjectId, ref: 'User'},
  tourDate: {type: Date, trim: true, required: true},
  numberOfPerson: {type: Number, trim: true, required: true},
  totalPrice: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
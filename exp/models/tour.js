const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  guide: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  goTo: {type: String, trim: true, required: true},
  simpleContent: {type: String, trim: true, required: true},
  pricePer: {type: Number, trim: true, required: true},
  //img: {type: String},
  startTime: {type: String, trim: true, required: true},
  allTourList: [String],
  tourExpression: {type: String, trim: true, required: false},
  numComments: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);

var Tour = mongoose.model('Tour', schema);

module.exports = Tour;
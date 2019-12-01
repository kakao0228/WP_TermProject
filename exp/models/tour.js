const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  guide: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  startDate: {type:Date, trim: true, required: true},
  endDate: {type:Date, trim: true, required: true},
  simpleContent: {type: String, trim: true, required: true},
  pricePer: {type: Number, trim: true, required: true},
  //img: {type: String},
  startTime: {type: Text, trim: true, required: true},
  allTourList: [new mongoose.Schema({scheduleName: String, finishTime: String, scheduleExpress: String}, {_id: false})],
  includeTour: [new mongoose.Schema({include: String}, {_id: false})],
  notInclude: [new mongoose.Schema({notInclude: String}, {_id: false})],
  tourExpression: {type: String, trim: true, required: false},
  numReview: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

UserSchema.methods.addTourList = function (info) {
  this.allTourList.push({scheduleName: info.scheduleName, finishTime: info.finishTime, scheduleExpress: info.scheduleExpress});
  return this.save();
};

UserSchema.methods.deleteTourList = function (info) {
  this.allTourList.pull({scheduleName: info.scheduleName});
  return this.save();
};

UserSchema.methods.addInclude = function (info) {
  this.includeTour.push({include: info.include});
  return this.save();
};

UserSchema.methods.deleteInclude = function (info) {
  this.includeTour.pull({include: info.include});
  return this.save();
};

UserSchema.methods.addNotInclude = function (info) {
  this.notIncludeTour.push({notInclude: info.notInclude});
  return this.save();
};

UserSchema.methods.deleteNotInclude = function (info) {
  this.notIncludeTour.pull({notInclude: info.notInclude});
  return this.save();
};

schema.plugin(mongoosePaginate);
var Tour = mongoose.model('Tour', schema);

module.exports = Tour;
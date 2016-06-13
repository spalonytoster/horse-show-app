var db = require('../db');
var deepPopulate = require('mongoose-deep-populate')(db);

var scoreSchema = db.Schema({
  scoreType: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /type|neck|body|legs|movement/.test(v);
      },
      message: '{VALUE} is not a valid role. Must be either user, admin, refree or breeder.'
    }
  },
  value: { type: Number, required: true },
  refree: { type: db.Schema.ObjectId, ref: 'Person' }
});

var currentVotingSchema = db.Schema({
  group: { type: Number, default: 0 },
  contestant: {
    index: { type: Number, default: 0 },
    number: Number,
    horse: { type: db.Schema.ObjectId, ref: 'Horse' }
  },
  votingStarted: { type: Boolean, default: false },
  isPaused: { type: Boolean, default: false },
  timeLeft: Number,
  scores: [scoreSchema]
});

var contestSchema = db.Schema({
  name: { type: String, required: true },
  nameFormatted: { type: String, required: true },
  date: { type: Date, default: Date.now },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  format: {
    min: { type: Number, default: 0 },
    max: { type: Number, required: true },
    halvesAllowed: { type: Boolean, default: false }
  },
  groups: [{
    name: { type: String, required: true },
    contestants: [{
      horse: { type: db.Schema.ObjectId, ref: 'Horse' },
      number: { type: Number, required: true },
      scores: [scoreSchema]
    }],
    refrees: [{ type: db.Schema.ObjectId, ref: 'Person' }]
  }],
  liveNow: { type: Boolean, default: false },
  hasEnded: { type: Boolean, default: false },
  currentVoting: currentVotingSchema
});

contestSchema.plugin(deepPopulate);

module.exports = db.model('Contest', contestSchema);

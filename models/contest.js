var db = require('../db');

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
      score: { type: Number, required: true }
    }],
    refrees: [{ type: db.Schema.ObjectId, ref: 'Person' }]
  }],
  liveNow: Boolean
});

module.exports = db.model('Contest', contestSchema);

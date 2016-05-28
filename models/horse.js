var db = require('../db');

var horseSchema = db.Schema({
  name: { type: String, required: true },
  sex: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /stallion|mare/.test(v);
      },
      message: '{VALUE} is not a valid sex. Must be either stallion or mare.'
    }
  },
  breeder: { type: db.Schema.ObjectId, ref: 'Person' }
});

module.exports = {
  schema: horseSchema,
  model: db.model('Horse', horseSchema)
};

var db = require('../db');

var personSchema = db.Schema({
  username: { type: String, select: false },
  password: { type: String, select: false },
  role: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /user|admin|refree|breeder/.test(v);
      },
      message: '{VALUE} is not a valid role. Must be either user, admin, refree or breeder.'
    }
  },
  name: { type: String, required: true },
  surname: { type: String, required: true }
});

module.exports = {
  schema: personSchema,
  model: db.model('Person', personSchema)
};

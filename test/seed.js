/* jshint node: true, esversion: 6 */
'use strict';

var faker = require('faker'),
    Person = require('../models/person'),
    Horse = require('../models/horse'),
    Contest = require('../models/contest'),
    roles = require('../config').roles,
    sexes = require('../config').sexes;

var breeders = [], refrees = [], horses = [];
const CONTESTS = 5;
const GROUPS = 5 * CONTESTS;
const HORSES = 10 * GROUPS * CONTESTS + 50;
const BREEDERS = HORSES;
const REFREES = 20;

for (let i = 0; i < BREEDERS; i++) {
  new Person({
    role: roles.BREEDER,
    name: faker.name.firstName(),
    surname: faker.name.lastName()
})
  .save(function (person) {
    breeders.push(person);
    console.log(person);
  });
}

for (let i = 0; i < REFREES; i++) {
  new Person({
    role: roles.REFREE,
    name: faker.name.firstName(),
    surname: faker.name.lastName()
})
  .save(function (person) {
    breeders.push(person);
  });
}

for (let i = 0; i < HORSES/2; i++) {
  new Horse({
    name: faker.name.firstName(),
    sex: sexes.MARE,
    breeder: breeders[i]._id
  })
  .save(function (horse) {
    horses.push(horse);
  });
}

for (let i = 0; i < HORSES/2; i++) {
  new Horse({
    name: faker.name.firstName(),
    sex: sexes.STALLION,
    breeder: breeders[i + HORSES/2]._id
  })
  .save(function (person) {
    horses.push(person);
  });
}

for (let i = 0; i < GROUPS; i++) {

}

for (let i = 0; i < CONTESTS; i++) {
  // var contest = new Contest({
  //   name: req.body.name,
  //   nameFormatted: _.kebabCase(req.body.name + req.body.location.city),
  //   date: req.body.date,
  //   location: {
  //     city: req.body.location.city,
  //     country: req.body.location.country
  //   },
  //   format: {
  //     min: req.body.format.min,
  //     max: req.body.format.max,
  //     halvesAllowed: req.body.format.halvesAllowed
  //   },
  //   groups: groups,
  // });
  //
  // console.dir(contest);
  //
  // contest.save(function (err, contest) {
  //   if (err) {
  //     console.dir(err);
  //     return next(err);
  //   }
  //   res.status(201).json(contest);
  // });
}

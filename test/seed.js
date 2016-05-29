/* jshint node: true, esversion: 6 */
'use strict';

var faker = require('faker'),
    Person = require('../models/person'),
    Horse = require('../models/horse'),
    Contest = require('../models/contest'),
    roles = require('../config').roles,
    sexes = require('../config').sexes,
    async = require('async');

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

var breeders = [], refrees = [], horses = [];
const CONTESTS = 5;
const GROUPS = 5 * CONTESTS;
const HORSES = 1000;
const BREEDERS = 700;
const REFREES = 50;

async.series([
    function (callback) {
      var collections = 0;
      Person.remove({}, function(err) {
         collections++;
      });
      Horse.remove({}, function(err) {
         collections++;
      });
      Contest.remove({}, function(err) {
         collections++;
      });
      setInterval(function () {
        if (collections === 3) {
          clearInterval(this);
          console.log('collections dropped!');
          callback(null, 'drop collections');
        }
      }, 20);
    },
    function(callback) {
      var counter = 0;
      for (let i = 0; i < BREEDERS; i++) {
        new Person({
          role: roles.BREEDER,
          name: faker.name.firstName(),
          surname: faker.name.lastName()
        })
        .save(function (person) {
          breeders.push(person);
          counter++;
          console.log(counter);
        });
      }
      setInterval(function () {
        if (counter === BREEDERS) {
          console.log(counter + '===' + BREEDERS);
          clearInterval(this);
          callback(null, 'breeders');
        }
      }, 20);
    },
    function(callback) {
      var counter = 0;
      for (let i = 0; i < REFREES; i++) {
        new Person({
          role: roles.REFREE,
          name: faker.name.firstName(),
          surname: faker.name.lastName()
        })
        .save(function (person) {
          breeders.push(person);
          counter++;
          console.log(counter);
        });
      }
      setInterval(function () {
        if (counter === REFREES) {
          console.log(counter + '===' + REFREES);
          clearInterval(this);
          callback(null, 'refrees');
        }
      }, 20);
    },
    function(callback) {
      var counter = 0;
      for (let i = 0; i < HORSES/2; i++) {
        new Horse({
          name: faker.name.firstName(),
          sex: sexes.MARE,
          breeder: breeders.random()._id
        })
        .save(function (horse) {
          horses.push(horse);
          counter++;
          console.log(counter);
        });
      }
      setInterval(function () {
        if (counter === HORSES/2) {
          callback(null, 'horses_mares');
          clearInterval(this);
        }
      }, 20);
    },
    function(callback) {
      var counter = 0;
      for (let i = 0; i < HORSES/2; i++) {
        new Horse({
          name: faker.name.firstName(),
          sex: sexes.STALLION,
          breeder: breeders.random()._id
        })
        .save(function (horse) {
          horses.push(horse);
          counter++;
          console.log(counter);
        });
      }
      setInterval(function () {
        if (counter === HORSES/2) {
          callback(null, 'horses_stallions');
          clearInterval(this);
        }
      }, 20);
    },
    function(callback) {
      var counter = 0;
      for (let i = 0; i < GROUPS; i++) {

      }
      callback(null, 'groups');
    },
    function(callback) {
      var counter = 0;
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
      callback(null, 'contests');
    }
],
function(err, results) {
  if (err) { throw err; }
    console.log(results);
});

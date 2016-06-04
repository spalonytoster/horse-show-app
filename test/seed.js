/* jshint node: true, esversion: 6 */
'use strict';

var faker = require('faker'),
    Person = require('../models/person'),
    Horse = require('../models/horse'),
    Contest = require('../models/contest'),
    roles = require('../config').roles,
    sexes = require('../config').sexes,
    async = require('async'),
    _ = require('lodash');

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

var breeders = [], refrees = [], horses = [], groups = [];
const CONTESTS          = 5;
const GROUPS            = 5 * CONTESTS;
const BREEDERS          = 700,
      HORSES            = 1000,
      HORSES_PER_GROUP  = 10,
      REFREES           = 50,
      REFREES_PER_GROUP = 5;

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
          surname: faker.name.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password()
        })
        .save(function (err, breeder) {
          breeders.push(breeder);
          counter++;
        });
      }
      setInterval(function () {
        if (counter === BREEDERS) {
          clearInterval(this);
          console.log('created ' + breeders.length + ' breeders');
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
          surname: faker.name.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password()
        })
        .save(function (err, refree) {
          refrees.push(refree);
          counter++;
        });
      }
      setInterval(function () {
        if (counter === REFREES) {
          clearInterval(this);
          console.log('created ' + refrees.length + ' refrees');
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
          breeder: {
            _id: breeders.random()._id
          }
        })
        .save(function (err, horse) {
          horses.push(horse);
          counter++;
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
          breeder: {
            _id: breeders.random()._id
          }
        })
        .save(function (err, horse) {
          horses.push(horse);
          counter++;
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
        let group = {
          name: 'Group ' + String.fromCharCode(i%5 + 65),
          contestants: [],
          refrees: []
        };
        for (let j = 0; j < REFREES_PER_GROUP; j++) {
          group.refrees.push({
            _id: refrees.random()._id
          });
        }
        for (let j = 0; j < HORSES_PER_GROUP; j++) {
          var scoreTypes = ['type', 'neck', 'body', 'legs', 'movement'];
          var scores = [];
          scoreTypes.forEach(function (scoreType) {
            for (var k = 0; k < 5; k++) {
              var score = {
                scoreType: scoreType,
                value: Math.floor((Math.random() * 8) + 2),
                refree: refrees[k]
              };
              scores.push(score);
            }
          });

          group.contestants.push({
            horse: {
              _id: horses.random()._id
            },
            number: Math.floor(Math.random() * (GROUPS * HORSES_PER_GROUP) + 1),
            scores: scores
          });
        }

        groups.push(group);
      }
      callback(null, 'groups');
    },
    function(callback) {
      var counter = 0;
      var randomFormat = function () {
        var i = Math.floor((Math.random() * 20) + 1);
        if (i%10 === 0) {
          return i;
        }
        return randomFormat();
      };
      for (let i = 0; i < CONTESTS; i++) {
        var city = faker.address.city();
        var name = '#' + Math.floor(Math.random() * 50) + ' Horse Show';
        var localGroups = [];
        for (let j = 0; j < GROUPS/CONTESTS; j++) {
          localGroups.push(groups[i * (GROUPS/CONTESTS) + j]);
        }
        new Contest({
          name: name,
          nameFormatted: _.kebabCase(name + ' ' + city),
          date: faker.date.past(),
          location: {
            city: city,
            country: faker.address.country()
          },
          format: {
            max: randomFormat(),
            halvesAllowed: Math.random() >= 0.5
          },
          groups: localGroups,
        })
        .save(function (err, contest) {
          if (err) { console.log(err); }
          counter++;
        });
      }
      setInterval(function () {
        if (counter === CONTESTS) {
          clearInterval(this);
          console.log('created ' + CONTESTS + ' contests');
          callback(null, 'contests');
        }
      }, 20);
    }
],
function(err, results) {
  if (err) { throw err; }
    console.log(results);
    console.log('Database seeded sucessfully.\nPress Ctrl-C to exit...');
});

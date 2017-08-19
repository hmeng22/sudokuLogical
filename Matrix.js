import 'lodash'

function Cube() {
  // index, horizontal, vertical, block
  this.index = 0;
  this.x = 0;
  this.y = 0;
  this.z = 0;

  this.value = 0;

  this.candidates = [];
}

Object.assign(Cube.prototype, {
  isEmpty: function() {
    return this.value === 0;
  }
});

function Matrix() {
  this.length = 9;
  this.size = 81;

  this.cubes = this.initCubes();

  // store the possible positions the candidate will be
  // each contains 9 array elements (for each row, col or block)
  // each array element contains 9 arrays (for each number)
  this.rowCandidatesIndexes = [];
  this.colCandidatesIndexes = [];
  this.blockCandidatesIndexes = [];
}

Object.assign(Matrix.prototype, {
  resetMatrix: function(m) {
    this.cubes = this.initCubes();

    // set values
    for (var i = 0; i < this.size; i++) {
      this.cubeFromIndex(i).value = m[i];
    }

    // init candidates
    this.initCandidates();
  },

  // init candidates according to known numbers
  initCandidates: function() {
    for (var i = 0; i < this.size; i++) {
      var c = this.cubeFromIndex(i);

      if (!c.isEmpty()) {
        c.candidates = [];
        this.eliminateHVBCubesCandidate(i, c.value);
      }
    }

    this.updateCandidatesIndexes();
  },

  solve: function() {
    this.killSingles();

    this.findPairs();

    this.findTriples();

    this.findPointingPairs();

    this.findXWings();
  },

  // init cubes
  initCubes: function() {
    var cubes = [];
    for (var i = 0; i < this.size; i++) {
      var c = new Cube();
      c.index = i;
      var xyz = this.indexToXYZ(i);
      c.x = xyz.x;
      c.y = xyz.y;
      c.z = xyz.z;
      c.value = 0;
      c.candidates = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ];
      cubes.push(c);
    }
    return cubes;
  },

  // init candidates indexes
  updateCandidatesIndexes: function() {
    this.rowCandidatesIndexes = [];
    this.colCandidatesIndexes = [];
    this.blockCandidatesIndexes = [];

    var numberarr;
    for (var j = 0; j < this.length; j++) {
      var numberarr = new Array();
      for (var k = 0; k < this.length; k++) {
        numberarr.push([]);
      }
    }
    for (var i = 0; i < this.length; i++) {
      this.rowCandidatesIndexes.push(JSON.parse(JSON.stringify(numberarr)));
      this.colCandidatesIndexes.push(JSON.parse(JSON.stringify(numberarr)));
      this.blockCandidatesIndexes.push(JSON.parse(JSON.stringify(numberarr)));
    }

    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < this.length; j++) {
        var ci = this.XYToIndex(i, j);
        var c = this.cubeFromIndex(ci);

        if (c.isEmpty()) {
          for (var k = 0, l = c.candidates.length; k < l; k++) {
            this.rowCandidatesIndexes[i][c.candidates[k] - 1].push(ci);
            this.colCandidatesIndexes[j][c.candidates[k] - 1].push(ci);
            this.blockCandidatesIndexes[this.XYToZ(i, j)][c.candidates[k] - 1].push(ci);
          }
        }
      }
    }
  },

  // index and XYZ
  indexToXYZ: function(i) {
    var x = parseInt(i / this.length);
    var y = parseInt(i % this.length);
    var z = parseInt(x / 3) * 3 + parseInt(y / 3);
    return {x: x, y: y, z: z}
  },
  XYToIndex: function(x, y) {
    return x * this.length + y;
  },
  XYToZ: function(x, y) {
    return parseInt(x / 3) * 3 + parseInt(y / 3);
  },
  // return all index inside a block
  ZToIndexes: function(z) {
    var zblock = [];
    for (var n = 0; n < this.length; n++) {
      var row = parseInt(n / 3) * 9 + parseInt(z / 3) * 18;
      var col = parseInt(n % 3) + z * 3;
      zblock.push(row + col)
    }
    return zblock;
  },

  // get Cube
  cubeFromIndex: function(i) {
    return this.cubes[i];
  },

  cubeFromXY: function(x, y) {
    return this.cubeFromIndex(this.XYToIndex(x, y));
  },

  cubesFromZ: function(z) {
    var cubes = [];
    var zblock = this.ZToIndexes(z);
    for (var i = 0; i < this.length; i++) {
      cubes.push(this.cubeFromIndex(zblock[i]));
    }
    return cubes;
  },

  // is Cubes in the same row, col, block
  isSameX: function(indexes) {
    if (typeof indexes != 'object' || !(indexes.length > 1)) {
      return false;
    }

    var ix = this.indexToXYZ(indexes[0]).x;

    for (var i = 1, il = indexes.length; i < il; i++) {
      if (ix != this.indexToXYZ(indexes[i]).x) {
        return false;
      }
    }

    return true;
  },
  isSameY: function(indexes) {
    if (typeof indexes != 'object' || !(indexes.length > 1)) {
      return false;
    }

    var ix = this.indexToXYZ(indexes[0]).y;

    for (var i = 1, il = indexes.length; i < il; i++) {
      if (ix != this.indexToXYZ(indexes[i]).y) {
        return false;
      }
    }

    return true;
  },
  isSameZ: function(indexes) {
    if (typeof indexes != 'object' || !(indexes.length > 1)) {
      return false;
    }

    var ix = this.indexToXYZ(indexes[0]).z;

    for (var i = 1, il = indexes.length; i < il; i++) {
      if (ix != this.indexToXYZ(indexes[i]).z) {
        return false;
      }
    }

    return true;
  },

  isSolved: function() {
    for (var i = 0; i < this.size; i++) {
      if (this.cubeFromIndex(i).isEmpty()) {
        return false;
      }
    }
    return true;
  },

  // candidates
  setCubeValue: function(i, v) {
    var c = this.cubeFromIndex(i);
    if (c.isEmpty()) {
      c.value = v;
      c.candidates = [];
    }
  },
  // eliminate Candidates horizontal, vertical or block except for protectedIndexes
  eliminateHVBCubesCandidate: function(i, v, horizontal = true, vertical = true, block = true, protectedIndexes = []) {
    if (i == 'undefined' || v == 'undefined') {
      return;
    }
    var tempI;
    var tempC;
    var xyz = this.indexToXYZ(i);
    // eliminate un-available candidates
    for (var n = 0; n < this.length; n++) {

      if (horizontal) {
        tempI = this.XYToIndex(xyz.x, (xyz.y + n) % this.length);
        if (!protectedIndexes.includes(tempI)) {
          tempC = this.cubeFromIndex(tempI);
          if (tempC.isEmpty() && tempC.candidates.includes(v)) {
            tempC.candidates.splice(tempC.candidates.indexOf(v), 1);
          }
        }
      }

      if (vertical) {
        tempI = this.XYToIndex((xyz.x + n) % this.length, xyz.y);
        if (!protectedIndexes.includes(tempI)) {
          tempC = this.cubeFromIndex(tempI);
          if (tempC.isEmpty() && tempC.candidates.includes(v)) {
            tempC.candidates.splice(tempC.candidates.indexOf(v), 1);
          }
        }
      }
    }

    if (block) {
      var zblock = this.ZToIndexes(xyz.z);
      for (var n = 0; n < this.length; n++) {
        tempI = zblock[n];
        if (!protectedIndexes.includes(tempI)) {
          tempC = this.cubeFromIndex(tempI);
          if (tempC.isEmpty() && tempC.candidates.includes(v)) {
            tempC.candidates.splice(tempC.candidates.indexOf(v), 1);
          }
        }
      }
    }
  },

  // strategies
  nakedSingles: function() {
    var singles = [];
    for (var i = 0; i < this.size; i++) {
      if (this.cubeFromIndex(i).candidates.length == 1) {
        singles.push({index: i, value: this.cubeFromIndex(i).candidates[0]});
      }
    }
    return singles;
  },
  hiddenSingles: function(candidatesIndexes) {
    var singles = [];
    for (var i = 0; i < this.length; i++) {
      var cIes = candidatesIndexes[i];
      for (var m = 0; m < this.length; m++) {
        if (cIes[m].length == 1) {
          singles.push({
            index: _.clone(cIes[m]),
            value: m + 1
          });
        }
      }
    }
    return singles;
  },

  killSingles: function() {
    // naked Singles & hidden Singles
    var onceMore = true;
    while (onceMore) {
      onceMore = false;

      var singles = _.uniqWith(_.concat(this.nakedSingles(), this.hiddenSingles(this.rowCandidatesIndexes), this.hiddenSingles(this.colCandidatesIndexes), this.hiddenSingles(this.blockCandidatesIndexes)), _.isEqual);
      console.log('Singles : ', singles);
      if (singles.length != 0) {
        onceMore = true;
      }
      for (var i = 0, l = singles.length; i < l; i++) {
        this.setCubeValue(singles[i].index, singles[i].value);
        this.eliminateHVBCubesCandidate(singles[i].index, singles[i].value);
        console.log('Kill singles : ', singles[i].index, singles[i].value);
      }

      this.updateCandidatesIndexes();
    }
  },

  nakedPairs: function(HVB) {
    var pairs = [];
    for (var i = 0; i < this.length; i++) {
      var ac;
      var bc;
      for (var m = 0, ml = this.length - 1; m < ml; m++) {
        if (HVB == 'horizontal' || HVB == 'h' || HVB == 'H') {
          ac = this.cubeFromXY(i, m);
          if (ac.candidates.length == 2) {
            for (var n = m + 1; n < this.length; n++) {
              bc = this.cubeFromXY(i, n);
              if (bc.candidates.length == 2 && _.intersection(ac.candidates, bc.candidates).length == 2) {
                pairs.push({
                  index: [
                    this.XYToIndex(i, m),
                    this.XYToIndex(i, n)
                  ],
                  value: _.clone(bc.candidates)
                });
              }
            }
          }
        }

        if (HVB == 'vertical' || HVB == 'v' || HVB == 'V') {
          ac = this.cubeFromXY(m, i);
          if (ac.candidates.length == 2) {
            for (var n = m + 1; n < this.length; n++) {
              bc = this.cubeFromXY(n, i);
              if (bc.candidates.length == 2 && _.intersection(ac.candidates, bc.candidates).length == 2) {
                pairs.push({
                  index: [
                    this.XYToIndex(m, i),
                    this.XYToIndex(n, i)
                  ],
                  value: _.clone(bc.candidates)
                });
              }
            }
          }
        }
      }

      if (HVB == 'block' || HVB == 'b' || HVB == 'B') {
        var zblock = this.ZToIndexes(i);
        for (var m = 0, ml = this.length - 1; m < ml; m++) {
          ac = this.cubeFromIndex(zblock[m]);
          if (ac.candidates.length == 2) {
            for (var n = m + 1; n < this.length; n++) {
              bc = this.cubeFromIndex(zblock[n]);
              if (bc.candidates.length == 2 && _.intersection(ac.candidates, bc.candidates).length == 2) {
                pairs.push({
                  index: [
                    zblock[m], zblock[n]
                  ],
                  value: _.clone(bc.candidates)
                });
              }
            }
          }
        }
      }
    }

    return pairs;
  },
  hiddenPairs: function(candidatesIndexes) {
    var pairs = [];
    for (var i = 0; i < this.length; i++) {
      var cIes = candidatesIndexes[i];
      for (var m = 0, ml = this.length - 1; m < ml; m++) {
        if (cIes[m].length == 2) {
          for (var n = m + 1; n < this.length; n++) {
            if (cIes[n].length == 2 && _.intersection(cIes[m], cIes[n]).length == 2) {
              pairs.push({
                index: _.clone(cIes[n]),
                value: [
                  m + 1,
                  n + 1
                ]
              });
            }
          }
        }
      }
    }
    return pairs;
  },

  findPairs: function() {
    var pairs;
    pairs = _.uniqWith(_.concat(this.nakedPairs('h'), this.hiddenPairs(this.rowCandidatesIndexes)), _.isEqual);
    console.log('Row Pairs : ', pairs);
    for (var i = 0, l = pairs.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[0], true, false, false, pairs[i].index);
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[1], true, false, false, pairs[i].index);
    }

    pairs = _.uniqWith(_.concat(this.nakedPairs('v'), this.hiddenPairs(this.colCandidatesIndexes)), _.isEqual);
    console.log('Col Pairs : ', pairs);
    for (var i = 0, l = pairs.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[0], false, true, false, pairs[i].index);
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[1], false, true, false, pairs[i].index);
    }

    pairs = _.uniqWith(_.concat(this.nakedPairs('b'), this.hiddenPairs(this.blockCandidatesIndexes)), _.isEqual);
    console.log('Block Pairs : ', pairs);
    for (var i = 0, l = pairs.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[0], false, false, true, pairs[i].index);
      this.eliminateHVBCubesCandidate(pairs[i].index[0], pairs[i].value[1], false, false, true, pairs[i].index);
    }

    this.updateCandidatesIndexes();
  },

  nakedTriples: function(HVB) {
    var triples = [];

    for (var i = 0; i < this.length; i++) {
      for (var pt = 0; pt < 84; pt++) {
        var ac;
        var bc;
        var cc;
        for (var m = 0, ml = this.length - 2; m < ml; m++) {
          if (HVB == 'horizontal' || HVB == 'h' || HVB == 'H') {
            ac = this.cubeFromXY(i, m);
            if ((ac.candidates.length == 2 || ac.candidates.length == 3) && _.difference(ac.candidates, possibleTriples[pt]).length == 0) {
              for (var n = m + 1, nl = this.length - 1; n < nl; n++) {
                bc = this.cubeFromXY(i, n);
                if ((bc.candidates.length == 2 || bc.candidates.length == 3) && _.difference(bc.candidates, possibleTriples[pt]).length == 0) {
                  for (var o = n + 1; o < this.length; o++) {
                    cc = this.cubeFromXY(i, o);
                    if ((cc.candidates.length == 2 || cc.candidates.length == 3) && _.difference(cc.candidates, possibleTriples[pt]).length == 0) {
                      triples.push({
                        index: [
                          this.XYToIndex(i, m),
                          this.XYToIndex(i, n),
                          this.XYToIndex(i, o)
                        ],
                        value: _.clone(possibleTriples[i])
                      });
                    }
                  }
                }
              }
            }
          }

          if (HVB == 'vertical' || HVB == 'v' || HVB == 'V') {
            ac = this.cubeFromXY(m, i);
            if ((ac.candidates.length == 2 || ac.candidates.length == 3) && _.difference(ac.candidates, possibleTriples[pt]).length == 0) {
              for (var n = m + 1, nl = this.length - 1; n < nl; n++) {
                bc = this.cubeFromXY(n, i);
                if ((bc.candidates.length == 2 || bc.candidates.length == 3) && _.difference(bc.candidates, possibleTriples[pt]).length == 0) {
                  for (var o = n + 1; o < this.length; o++) {
                    cc = this.cubeFromXY(o, i);
                    if ((cc.candidates.length == 2 || cc.candidates.length == 3) && _.difference(cc.candidates, possibleTriples[pt]).length == 0) {
                      triples.push({
                        index: [
                          this.XYToIndex(m, i),
                          this.XYToIndex(n, i),
                          this.XYToIndex(o, i)
                        ],
                        value: _.clone(possibleTriples[i])
                      });
                    }
                  }
                }
              }
            }
          }
        }

        if (HVB == 'block' || HVB == 'b' || HVB == 'B') {
          var zblock = this.ZToIndexes(i);
          for (var m = 0, ml = this.length - 2; m < ml; m++) {
            ac = this.cubeFromIndex(zblock[m]);
            if ((ac.candidates.length == 2 || ac.candidates.length == 3) && _.difference(ac.candidates, possibleTriples[pt]).length == 0) {
              for (var n = m + 1, nl = this.length - 1; n < nl; n++) {
                bc = this.cubeFromIndex(zblock[n]);
                if ((bc.candidates.length == 2 || bc.candidates.length == 3) && _.difference(bc.candidates, possibleTriples[pt]).length == 0) {
                  for (var o = n + 1; o < this.length; o++) {
                    cc = this.cubeFromXY(o, i);
                    if ((cc.candidates.length == 2 || cc.candidates.length == 3) && _.difference(cc.candidates, possibleTriples[pt]).length == 0) {
                      triples.push({
                        index: [
                          zblock[m], zblock[n], zblock[o]
                        ],
                        value: _.clone(possibleTriples[i])
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return triples;
  },
  hiddenTriples: function(candidatesIndexes) {
    var triples = [];
    for (var i = 0; i < this.length; i++) {
      var cIes = candidatesIndexes[i];
      for (var m = 0, ml = this.length - 2; m < ml; m++) {
        if (cIes[m].length == 3) {
          for (var n = m + 1, nl = this.length - 1; n < nl; n++) {
            if (cIes[n].length == 3) {
              for (var o = n + 1; o < this.length; o++) {
                if (cIes[o].length == 3 && _.intersection(cIes[m], cIes[n], cIes[o]).length == 3) {
                  triples.push({
                    index: _.clone(cIes[o]),
                    value: [
                      m + 1,
                      n + 1,
                      o + 1
                    ]
                  });
                }
              }
            }
          }
        }
      }
    }
    return triples;
  },

  findTriples: function() {
    var triples;
    triples = _.uniqWith(_.concat(this.nakedTriples('h'), this.hiddenTriples(this.rowCandidatesIndexes)), _.isEqual);
    console.log('Row Triples : ', triples);
    for (var i = 0, l = triples.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[0], true, false, false, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[1], true, false, false, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[2], true, false, false, triples[i].index);
    }

    triples = _.uniqWith(_.concat(this.nakedTriples('v'), this.hiddenTriples(this.colCandidatesIndexes)), _.isEqual);
    console.log('Col Triples : ', triples);
    for (var i = 0, l = triples.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[0], false, true, false, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[1], false, true, false, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[2], false, true, false, triples[i].index);
    }

    triples = _.uniqWith(_.concat(this.nakedTriples('b'), this.hiddenTriples(this.blockCandidatesIndexes)), _.isEqual);
    console.log('Block Triples : ', triples);
    for (var i = 0, l = triples.length; i < l; i++) {
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[0], false, false, true, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[1], false, false, true, triples[i].index);
      this.eliminateHVBCubesCandidate(triples[i].index[0], triples[i].value[2], false, false, true, triples[i].index);
    }

    this.updateCandidatesIndexes();
  },

  // interactions
  findPointingPairs: function() {
    for (var i = 0; i < this.length; i++) {
      var cIes = this.rowCandidatesIndexes[i];
      for (var m = 0; m < this.length; m++) {
        if (this.isSameZ(cIes[m])) {
          console.log('Row Pointing : ', cIes[m], m + 1);
          this.eliminateHVBCubesCandidate(cIes[m][0], m + 1, false, false, true, cIes[m]);
        }
      }

      var cIes = this.colCandidatesIndexes[i];
      for (var m = 0; m < this.length; m++) {
        if (this.isSameZ(cIes[m])) {
          console.log('Col Pointing : ', cIes[m], m + 1);
          this.eliminateHVBCubesCandidate(cIes[m][0], m + 1, false, false, true, cIes[m]);
        }
      }

      var cIes = this.blockCandidatesIndexes[i];
      for (var m = 0; m < this.length; m++) {
        if (this.isSameX(cIes[m])) {
          console.log('Blcok Pointing Row : ', cIes[m], m + 1);
          this.eliminateHVBCubesCandidate(cIes[m][0], m + 1, true, false, false, cIes[m]);
        } else if (this.isSameY()) {
          console.log('Blcok Pointing Col : ', cIes[m], m + 1);
          this.eliminateHVBCubesCandidate(cIes[m][0], m + 1, false, true, false, cIes[m]);
        }
      }
    }

    this.updateCandidatesIndexes();
  },

  // X-Wing
  findXWings: function() {
    for (var m = 0; m < this.length; m++) {
      for (var i = 0; i < this.length; i++) {
        var cIesI = this.rowCandidatesIndexes[i];
        if (cIesI[m].length == 2) {
          for (var j = i + 1; j < this.length; j++) {
            var cIesJ = this.rowCandidatesIndexes[j];
            if (cIesJ[m].length == 2) {
              var aI = cIesI[m][0];
              var bI = cIesI[m][1];
              var aJ = cIesJ[m][0];
              var bJ = cIesJ[m][1];
              if (this.isSameY([aI, aJ]) && this.isSameY([bI, bJ])) {
                console.log('Row X-Wing : ', cIesI[m], cIesJ[m], m + 1);
                this.eliminateHVBCubesCandidate(aI, m + 1, false, true, false, _.concat(cIesI[m], cIesJ[m]));
              }
            }
          }
        }
      }

      for (var i = 0; i < this.length; i++) {
        var cIesI = this.colCandidatesIndexes[i];
        if (cIesI[m].length == 2) {
          for (var j = i + 1; j < this.length; j++) {
            var cIesJ = this.colCandidatesIndexes[j];
            if (cIesJ[m].length == 2) {
              var aI = cIesI[m][0];
              var bI = cIesI[m][1];
              var aJ = cIesJ[m][0];
              var bJ = cIesJ[m][1];
              if (this.isSameX([aI, aJ]) && this.isSameX([bI, bJ])) {
                console.log('Col X-Wing : ', cIesI[m], cIesJ[m], m + 1);
                this.eliminateHVBCubesCandidate(aI, m + 1, true, false, false, _.concat(cIesI[m], cIesJ[m]));
              }
            }
          }
        }
      }
    }

    this.updateCandidatesIndexes();
  },

  // helper
  printMatrix: function() {
    for (var i = 0; i < this.length; i++) {
      var str = '| ';
      for (var j = 0; j < this.length; j++) {
        str += this.cubeFromXY(i, j).value + ' | '
      }
      console.log(str);
    }
  },
  printCandidates: function() {
    for (var i = 0; i < this.length; i++) {
      console.log('--- --- ---')
      for (var j = 0; j < this.length; j++) {
        console.log('I:' + this.XYToIndex(i, j), '(' + i + ',' + j + ') : ', this.cubeFromXY(i, j).candidates.toString());
      }
    }
  },
  printRowCandidatesIndexes: function() {
    for (var i = 0; i < this.length; i++) {
      console.log('--- --- ---');
      for (var j = 0; j < this.length; j++) {
        console.log('Row:' + i, '(' + j + ')', this.rowCandidatesIndexes[i][j].toString());
      }
    }
  },
  printColCandidatesIndexes: function() {
    for (var i = 0; i < this.length; i++) {
      console.log('--- --- ---');
      for (var j = 0; j < this.length; j++) {
        console.log('Col:' + i, '(' + j + ')', this.colCandidatesIndexes[i][j].toString());
      }
    }
  },
  printBlockCandidatesIndexes: function() {
    for (var i = 0; i < this.length; i++) {
      console.log('--- --- ---');
      for (var j = 0; j < this.length; j++) {
        console.log('Block:' + i, '(' + j + ')', this.blockCandidatesIndexes[i][j].toString());
      }
    }
  }
});

// possible triples 84 in total
var possibleTriples = [
  [
    1, 2, 3
  ],
  [
    1, 2, 4
  ],
  [
    1, 2, 5
  ],
  [
    1, 2, 6
  ],
  [
    1, 2, 7
  ],
  [
    1, 2, 8
  ],
  [
    1, 2, 9
  ],
  [
    1, 3, 4
  ],
  [
    1, 3, 5
  ],
  [
    1, 3, 6
  ],
  [
    1, 3, 7
  ],
  [
    1, 3, 8
  ],
  [
    1, 3, 9
  ],
  [
    1, 4, 5
  ],
  [
    1, 4, 6
  ],
  [
    1, 4, 7
  ],
  [
    1, 4, 8
  ],
  [
    1, 4, 9
  ],
  [
    1, 5, 6
  ],
  [
    1, 5, 7
  ],
  [
    1, 5, 8
  ],
  [
    1, 5, 9
  ],
  [
    1, 6, 7
  ],
  [
    1, 6, 8
  ],
  [
    1, 6, 9
  ],
  [
    1, 7, 8
  ],
  [
    1, 7, 9
  ],
  [
    1, 8, 9
  ],
  [
    2, 3, 4
  ],
  [
    2, 3, 5
  ],
  [
    2, 3, 6
  ],
  [
    2, 3, 7
  ],
  [
    2, 3, 8
  ],
  [
    2, 3, 9
  ],
  [
    2, 4, 5
  ],
  [
    2, 4, 6
  ],
  [
    2, 4, 7
  ],
  [
    2, 4, 8
  ],
  [
    2, 4, 9
  ],
  [
    2, 5, 6
  ],
  [
    2, 5, 7
  ],
  [
    2, 5, 8
  ],
  [
    2, 5, 9
  ],
  [
    2, 6, 7
  ],
  [
    2, 6, 8
  ],
  [
    2, 6, 9
  ],
  [
    2, 7, 8
  ],
  [
    2, 7, 9
  ],
  [
    2, 8, 9
  ],
  [
    3, 4, 5
  ],
  [
    3, 4, 6
  ],
  [
    3, 4, 7
  ],
  [
    3, 4, 8
  ],
  [
    3, 4, 9
  ],
  [
    3, 5, 6
  ],
  [
    3, 5, 7
  ],
  [
    3, 5, 8
  ],
  [
    3, 5, 9
  ],
  [
    3, 6, 7
  ],
  [
    3, 6, 8
  ],
  [
    3, 6, 9
  ],
  [
    3, 7, 8
  ],
  [
    3, 7, 9
  ],
  [
    3, 8, 9
  ],
  [
    4, 5, 6
  ],
  [
    4, 5, 7
  ],
  [
    4, 5, 8
  ],
  [
    4, 5, 9
  ],
  [
    4, 6, 7
  ],
  [
    4, 6, 8
  ],
  [
    4, 6, 9
  ],
  [
    4, 7, 8
  ],
  [
    4, 7, 9
  ],
  [
    4, 8, 9
  ],
  [
    5, 6, 7
  ],
  [
    5, 6, 8
  ],
  [
    5, 6, 9
  ],
  [
    5, 7, 8
  ],
  [
    5, 7, 9
  ],
  [
    5, 8, 9
  ],
  [
    6, 7, 8
  ],
  [
    6, 7, 9
  ],
  [
    6, 8, 9
  ],
  [7, 8, 9]
];

export {Matrix};
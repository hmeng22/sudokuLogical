## SudokuLogical

```
>>> Index
	index from 0 to 80. It is 9x9 from Top-Left to Bottom-Right, 81 in Total.

>>> Coordinates
	(X, Y, Z) represents Row X, Column Y, Block Z.

>>> Candidates
	[] contains the possible candidates
	
>>> Candidates Indexes
	candidatesIndexes contains the possible positions of Numbers for each Row, Col, Block.
```

```
*** Expample


```



## Task List

- [x] Naked Singles
- [x] Hidden Singles
- [x] Naked Pairs
- [x] Hidden Pairs
- [x] Naked Triples
- [x] Hidden Triples
- [x] Pointing Pairs
- [x] X-Wing
- [ ] Y-Wing
- [ ] XYZ-Wing



## Basic Usage

```
var m = [0, 1, 2, ... 80];

var matrix = new Matrix();
matrix.resetMatrix(m);

// Singles
matrix.killSingles();

// Pairs
matrix.findPairs();

// Triples
matrix.findTriples();

// Pointing Pairs
matrix.findPointingPairs();

// X-Wings
matrix.findXWings();
```

```
// print Matrix
matrix.printMatrix();

// print Candidates
matrix.printCandidates();
```



## Special Thanks

[sudoku-solutions.com](https://www.sudoku-solutions.com/)

[sudokuwiki.org](http://www.sudokuwiki.org/)

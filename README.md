## Task List

- [x] Naked Singles
- [x] Hidden Singles
- [x] Naked Pairs
- [x] Hidden Pairs
- [x] Naked Triples
- [x] Hidden Triples
- [x] Pointing Pairs
- [x] X-Wing
- [x] Y-Wing
- [x] XYZ-Wing



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

// Y-Wings
matrix.findYWings();

// XYZ-Wings
matrix.findXYZWings();
```

```
// print Matrix
matrix.printMatrix();

// print Candidates
matrix.printCandidates();
```



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

>>> Matrix

| 6 | 3 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | 
| 2 | 1 | 5 | 0 | 0 | 0 | 0 | 7 | 0 | 
| 0 | 4 | 0 | 0 | 0 | 2 | 0 | 0 | 1 | 
| 0 | 0 | 0 | 1 | 9 | 0 | 3 | 0 | 0 | 
| 0 | 0 | 0 | 2 | 0 | 7 | 0 | 0 | 0 | 
| 0 | 0 | 3 | 0 | 5 | 8 | 0 | 0 | 0 | 
| 4 | 0 | 0 | 7 | 0 | 0 | 0 | 3 | 0 | 
| 0 | 8 | 0 | 0 | 0 | 0 | 1 | 6 | 7 | 
| 0 | 0 | 2 | 0 | 0 | 0 | 0 | 4 | 8 | 



>>> Candidates
--- --- ---
I:0 (0,0) :  
I:1 (0,1) :  
I:2 (0,2) :  7,8
I:3 (0,3) :  4,5,8
I:4 (0,4) :  1,4,7,8
I:5 (0,5) :  1,4,5
I:6 (0,6) :  
I:7 (0,7) :  2,5,8
I:8 (0,8) :  2,4,5
--- --- ---
I:9 (1,0) :  
I:10 (1,1) :  
I:11 (1,2) :  
I:12 (1,3) :  3,4,6,8,9
I:13 (1,4) :  3,4,6,8
I:14 (1,5) :  3,4,6,9
I:15 (1,6) :  4,6,8
I:16 (1,7) :  
I:17 (1,8) :  3,4,6
--- --- ---
I:18 (2,0) :  7,8,9
I:19 (2,1) :  
I:20 (2,2) :  7,8,9
I:21 (2,3) :  3,5,6,8,9
I:22 (2,4) :  3,6,7,8
I:23 (2,5) :  
I:24 (2,6) :  5,6,8
I:25 (2,7) :  5,8
I:26 (2,8) :  
--- --- ---
I:27 (3,0) :  5,7,8
I:28 (3,1) :  2,5,6,7
I:29 (3,2) :  4,6,7,8
I:30 (3,3) :  
I:31 (3,4) :  
I:32 (3,5) :  4,6
I:33 (3,6) :  
I:34 (3,7) :  2,5,8
I:35 (3,8) :  2,4,5,6
--- --- ---
I:36 (4,0) :  1,5,8,9
I:37 (4,1) :  5,6,9
I:38 (4,2) :  1,4,6,8,9
I:39 (4,3) :  
I:40 (4,4) :  3,4,6
I:41 (4,5) :  
I:42 (4,6) :  4,5,6,8
I:43 (4,7) :  1,5,8,9
I:44 (4,8) :  4,5,6,9
--- --- ---
I:45 (5,0) :  1,7,9
I:46 (5,1) :  2,6,7,9
I:47 (5,2) :  
I:48 (5,3) :  4,6
I:49 (5,4) :  
I:50 (5,5) :  
I:51 (5,6) :  2,4,6,7
I:52 (5,7) :  1,2,9
I:53 (5,8) :  2,4,6,9
--- --- ---
I:54 (6,0) :  
I:55 (6,1) :  5,6,9
I:56 (6,2) :  1,6,9
I:57 (6,3) :  
I:58 (6,4) :  1,2,6,8
I:59 (6,5) :  1,5,6,9
I:60 (6,6) :  2,5
I:61 (6,7) :  
I:62 (6,8) :  2,5,9
--- --- ---
I:63 (7,0) :  3,5,9
I:64 (7,1) :  
I:65 (7,2) :  9
I:66 (7,3) :  3,4,5,9
I:67 (7,4) :  2,3,4
I:68 (7,5) :  3,4,5,9
I:69 (7,6) :  
I:70 (7,7) :  
I:71 (7,8) :  
--- --- ---
I:72 (8,0) :  1,3,5,7,9
I:73 (8,1) :  5,6,7,9
I:74 (8,2) :  
I:75 (8,3) :  3,5,6,9
I:76 (8,4) :  1,3,6
I:77 (8,5) :  1,3,5,6,9
I:78 (8,6) :  5
I:79 (8,7) :  
I:80 (8,8) :  



>>> Candidates Indexes
--- --- ---
Row:0 (0) 4,5
Row:0 (1) 7,8
Row:0 (2) 
Row:0 (3) 3,4,5,8
Row:0 (4) 3,5,7,8
Row:0 (5) 
Row:0 (6) 2,4
Row:0 (7) 2,3,4,7
Row:0 (8) 
--- --- ---
Row:1 (0) 
Row:1 (1) 
Row:1 (2) 12,13,14,17
Row:1 (3) 12,13,14,15,17
Row:1 (4) 
Row:1 (5) 12,13,14,15,17
Row:1 (6) 
Row:1 (7) 12,13,15
Row:1 (8) 12,14
--- --- ---
Row:2 (0) 
Row:2 (1) 
Row:2 (2) 21,22
Row:2 (3) 
Row:2 (4) 21,24,25
Row:2 (5) 21,22,24
Row:2 (6) 18,20,22
Row:2 (7) 18,20,21,22,24,25
Row:2 (8) 18,20,21
--- --- ---
Row:3 (0) 
Row:3 (1) 28,34,35
Row:3 (2) 
Row:3 (3) 29,32,35
Row:3 (4) 27,28,34,35
Row:3 (5) 28,29,32,35
Row:3 (6) 27,28,29
Row:3 (7) 27,29,34
Row:3 (8) 
--- --- ---
Row:4 (0) 36,38,43
Row:4 (1) 
Row:4 (2) 40
Row:4 (3) 38,40,42,44
Row:4 (4) 36,37,42,43,44
Row:4 (5) 37,38,40,42,44
Row:4 (6) 
Row:4 (7) 36,38,42,43
Row:4 (8) 36,37,38,43,44
--- --- ---
Row:5 (0) 45,52
Row:5 (1) 46,51,52,53
Row:5 (2) 
Row:5 (3) 48,51,53
Row:5 (4) 
Row:5 (5) 46,48,51,53
Row:5 (6) 45,46,51
Row:5 (7) 
Row:5 (8) 45,46,52,53
--- --- ---
Row:6 (0) 56,58,59
Row:6 (1) 58,60,62
Row:6 (2) 
Row:6 (3) 
Row:6 (4) 55,59,60,62
Row:6 (5) 55,56,58,59
Row:6 (6) 
Row:6 (7) 58
Row:6 (8) 55,56,59,62
--- --- ---
Row:7 (0) 
Row:7 (1) 67
Row:7 (2) 63,66,67,68
Row:7 (3) 66,67,68
Row:7 (4) 63,66,68
Row:7 (5) 
Row:7 (6) 
Row:7 (7) 
Row:7 (8) 63,65,66,68
--- --- ---
Row:8 (0) 72,76,77
Row:8 (1) 
Row:8 (2) 72,75,76,77
Row:8 (3) 
Row:8 (4) 72,73,75,77,78
Row:8 (5) 73,75,76,77
Row:8 (6) 72,73
Row:8 (7) 
Row:8 (8) 72,73,75,77



--- --- ---
Col:0 (0) 36,45,72
Col:0 (1) 
Col:0 (2) 63,72
Col:0 (3) 
Col:0 (4) 27,36,63,72
Col:0 (5) 
Col:0 (6) 18,27,45,72
Col:0 (7) 18,27,36
Col:0 (8) 18,36,45,63,72
--- --- ---
Col:1 (0) 
Col:1 (1) 28,46
Col:1 (2) 
Col:1 (3) 
Col:1 (4) 28,37,55,73
Col:1 (5) 28,37,46,55,73
Col:1 (6) 28,46,73
Col:1 (7) 
Col:1 (8) 37,46,55,73
--- --- ---
Col:2 (0) 38,56
Col:2 (1) 
Col:2 (2) 
Col:2 (3) 29,38
Col:2 (4) 
Col:2 (5) 29,38,56
Col:2 (6) 2,20,29
Col:2 (7) 2,20,29,38
Col:2 (8) 20,38,56,65
--- --- ---
Col:3 (0) 
Col:3 (1) 
Col:3 (2) 12,21,66,75
Col:3 (3) 3,12,48,66
Col:3 (4) 3,21,66,75
Col:3 (5) 12,21,48,75
Col:3 (6) 
Col:3 (7) 3,12,21
Col:3 (8) 12,21,66,75
--- --- ---
Col:4 (0) 4,58,76
Col:4 (1) 58,67
Col:4 (2) 13,22,40,67,76
Col:4 (3) 4,13,40,67
Col:4 (4) 
Col:4 (5) 13,22,40,58,76
Col:4 (6) 4,22
Col:4 (7) 4,13,22,58
Col:4 (8) 
--- --- ---
Col:5 (0) 5,59,77
Col:5 (1) 
Col:5 (2) 14,68,77
Col:5 (3) 5,14,32,68
Col:5 (4) 5,59,68,77
Col:5 (5) 14,32,59,77
Col:5 (6) 
Col:5 (7) 
Col:5 (8) 14,59,68,77
--- --- ---
Col:6 (0) 
Col:6 (1) 51,60
Col:6 (2) 
Col:6 (3) 15,42,51
Col:6 (4) 24,42,60,78
Col:6 (5) 15,24,42,51
Col:6 (6) 51
Col:6 (7) 15,24,42
Col:6 (8) 
--- --- ---
Col:7 (0) 43,52
Col:7 (1) 7,34,52
Col:7 (2) 
Col:7 (3) 
Col:7 (4) 7,25,34,43
Col:7 (5) 
Col:7 (6) 
Col:7 (7) 7,25,34,43
Col:7 (8) 43,52
--- --- ---
Col:8 (0) 
Col:8 (1) 8,35,53,62
Col:8 (2) 17
Col:8 (3) 8,17,35,44,53
Col:8 (4) 8,35,44,62
Col:8 (5) 17,35,44,53
Col:8 (6) 
Col:8 (7) 
Col:8 (8) 44,53,62



--- --- ---
Block:0 (0) 
Block:0 (1) 
Block:0 (2) 
Block:0 (3) 
Block:0 (4) 
Block:0 (5) 
Block:0 (6) 2,18,20
Block:0 (7) 2,18,20
Block:0 (8) 18,20
--- --- ---
Block:1 (0) 4,5
Block:1 (1) 
Block:1 (2) 12,13,14,21,22
Block:1 (3) 3,4,5,12,13,14
Block:1 (4) 3,5,21
Block:1 (5) 12,13,14,21,22
Block:1 (6) 4,22
Block:1 (7) 3,4,12,13,21,22
Block:1 (8) 12,14,21
--- --- ---
Block:2 (0) 
Block:2 (1) 7,8
Block:2 (2) 17
Block:2 (3) 8,15,17
Block:2 (4) 7,8,24,25
Block:2 (5) 15,17,24
Block:2 (6) 
Block:2 (7) 7,15,24,25
Block:2 (8) 
--- --- ---
Block:3 (0) 36,38,45
Block:3 (1) 28,46
Block:3 (2) 
Block:3 (3) 29,38
Block:3 (4) 27,28,36,37
Block:3 (5) 28,29,37,38,46
Block:3 (6) 27,28,29,45,46
Block:3 (7) 27,29,36,38
Block:3 (8) 36,37,38,45,46
--- --- ---
Block:4 (0) 
Block:4 (1) 
Block:4 (2) 40
Block:4 (3) 32,40,48
Block:4 (4) 
Block:4 (5) 32,40,48
Block:4 (6) 
Block:4 (7) 
Block:4 (8) 
--- --- ---
Block:5 (0) 43,52
Block:5 (1) 34,35,51,52,53
Block:5 (2) 
Block:5 (3) 35,42,44,51,53
Block:5 (4) 34,35,42,43,44
Block:5 (5) 35,42,44,51,53
Block:5 (6) 51
Block:5 (7) 34,42,43
Block:5 (8) 43,44,52,53
--- --- ---
Block:6 (0) 56,72
Block:6 (1) 
Block:6 (2) 63,72
Block:6 (3) 
Block:6 (4) 55,63,72,73
Block:6 (5) 55,56,73
Block:6 (6) 72,73
Block:6 (7) 
Block:6 (8) 55,56,63,65,72,73
--- --- ---
Block:7 (0) 58,59,76,77
Block:7 (1) 58,67
Block:7 (2) 66,67,68,75,76,77
Block:7 (3) 66,67,68
Block:7 (4) 59,66,68,75,77
Block:7 (5) 58,59,75,76,77
Block:7 (6) 
Block:7 (7) 58
Block:7 (8) 59,66,68,75,77
--- --- ---
Block:8 (0) 
Block:8 (1) 60,62
Block:8 (2) 
Block:8 (3) 
Block:8 (4) 60,62,78
Block:8 (5) 
Block:8 (6) 
Block:8 (7) 
Block:8 (8) 62
```



## Special Thanks

[sudoku-solutions.com](https://www.sudoku-solutions.com/)

[sudokuwiki.org](http://www.sudokuwiki.org/)

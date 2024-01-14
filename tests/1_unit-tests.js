const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
suite('Unit Tests', () => {
    test('Logic maneja una cadena de rompecabezas válida de 81 caracteres', function(done){
       /*let complete = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
       assert.equal(solver.completeSudoku(validPuzzle),complete);
       done();*/
       assert.equal(solver.validate(validPuzzle), "Valid");
       done();
    });

    test('La lógica maneja una cadena de rompecabezas con caracteres no válidos (no del 1 al 9 o .)', function(done){
        let invalidSudoku = '1.5..7.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.completeSudoku(invalidSudoku), false);
        done();
    });

    test('La lógica maneja una cadena de rompecabezas que no tiene 81 caracteres de longitud', function(done){
        let invalidSudoku = '.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.validate(invalidSudoku),"Expected puzzle to be 81 characters long");
        done(); 
    });

    test('La lógica maneja una ubicación de fila válida', function(done){
        assert.equal(solver.checkRowPlacement(validPuzzle,'A',3,9), true);
        done();
    });

    test('La lógica maneja una ubicación de fila no válida', function(done){
        assert.equal(solver.checkColPlacement(validPuzzle,'B',3,9), false);
        done();
    });

    test('La lógica maneja una ubicación de columna válida', function(done){
        assert.equal(solver.checkColPlacement(validPuzzle,'A',2,3), true);
        done();
    });

    test('La lógica maneja una ubicación de columna no válida', function(done){
        assert.equal(solver.checkColPlacement(validPuzzle,'A',2,9), false);
        done();
    });

    test('La lógica maneja la ubicación de una región válida (cuadrícula de 3x3)', function(done){
        assert.equal(solver.checkRegionPlacement(validPuzzle,'A',3,9), true);
        done();
    });

    test('La lógica maneja la ubicación de una región no válida (cuadrícula de 3x3)', function(done){
        assert.equal(solver.checkRegionPlacement(validPuzzle,'A',3,5), false);
        done();
    });

    test('Las cadenas de rompecabezas válidas pasan el solucionador', function(done){
        let board = solver.stringToBoard(validPuzzle);
        assert.equal(solver.solveSudoku(board), board);
        done();
    });

    test('Las cadenas de rompecabezas no válidas fallan en el solucionador', function(done){
        let invalidPuzzle = '1.3..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let board = solver.stringToBoard(invalidPuzzle);
        assert.equal(solver.solveSudoku(board), false);
        done();
    });

    test('Solver devuelve la solución esperada para un rompecabezas incompleto', function(done){
       assert.equal(solver.completeSudoku(validPuzzle), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
       done();
    });
});

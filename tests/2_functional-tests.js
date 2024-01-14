const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
suite('Functional Tests', () => {
    test('Resolver un rompecabezas con una cadena de rompecabezas válida', function(done){
        chai    
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: validPuzzle})
            .end(function(err,res){
                assert.equal(res.status,200);
                assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                done();
            });
    });

    test('Resolver un rompecabezas al que le falta una cadena', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({})
            .end(function(err,res){
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('Resolver un rompecabezas con caracteres no válidos', function(done){
        let invalidPuzzle = 'A.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        chai    
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle})
            .end(function(err,res){
                assert.equal(res.status,200);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });

    test('Resolver un rompecabezas con longitud incorrecta', function(done){
        let invalidPuzzle = '.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        chai    
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle})
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
                done();
            });
    });

    test('Resuelva un rompecabezas que no se puede resolver', function(done){
        let invalidPuzzle = '1.7..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        chai    
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle})
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });

    test('Verifique la ubicación de un rompecabezas con todos los campos', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate:'A2', value: 3})
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con conflicto de ubicación única', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate:'B2', value: 3})
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 1)
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con múltiples conflictos de ubicación', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate:'B3', value: 3})
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length,2);
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con todos los conflictos de ubicación', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate:'A3', value: 1})
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length,3);
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas al que le faltan campos obligatorios', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({})
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con caracteres no válidos', function(done){
        let invalidPuzzle='E.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: 3 })
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con una longitud incorrecta', function(done){
        let invalidPuzzle='.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: 3 })
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con coordenadas de ubicación no válidas', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'XYZ', value: 3 })
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.error, 'Invalid coordinate');
            done();
        });
    });

    test('Verifique la ubicación de un rompecabezas con un valor de ubicación no válido', function(done){
        chai    
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: 'P' })
        .end(function(err,res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.error, 'Invalid value');
            done();
        });
    })
});


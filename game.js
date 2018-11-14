const field = document.getElementById('field');
const fieldcontext = field.getContext('2d');

fieldcontext.fillStyle = '#F0F8FF';
fieldcontext.fillRect(0, 0, field.width, field.height);

fieldcontext.lineWidth = 0.08;
fieldcontext.strokeStyle="#8FBC8F";

fieldcontext.scale(20, 20);

field.addEventListener('click', function(event) {
	let rect = field.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / 20);
    let y = Math.floor((event.clientY - rect.top) / 20);

	if(!game.inProgress && x != 31 && x != 0 && y != 31 && y != 0){		
	    board.matrix[x][y] = 1;
	    fieldcontext.fillStyle = 'black';
		fieldcontext.fillRect(x, y, 1, 1);
		fieldcontext.strokeRect(x, y, 1, 1,);
	}     
}, false);

const LiveRules = function(survive, born) {
	this.surviveRules = survive.split(' ').filter(Number);
	this.bornRules = born.split(' ').filter(Number);
}

const Board = function(size = 32) {
	this.matrix = [];
	this.size = size;
	for(let i = 0; i < size; i++){		
		this.matrix[i] = [];
		for(let j = 0; j < size; j++){
			this.matrix[i][j] = 0;
		}
	}
}

Board.prototype.nextBoardState = function() {
	const nextMatrixState = [];
	for (let i = 0; i < this.size; i++) {
		nextMatrixState[i] = [];
	    for (let j = 0; j < this.size; j++) {
			nextMatrixState[i][j] = 0;
		}
	}

	for (let i = 0; i < this.size; i++) {
		this.matrix[0][i] = this.matrix[30][i];
		nextMatrixState[0][i] = this.matrix[30][i];
		this.matrix[31][i] = this.matrix[1][i];
		nextMatrixState[31][i] = this.matrix[1][i];
		this.matrix[i][0] = this.matrix[i][30];
		nextMatrixState[i][0] = this.matrix[i][30];
		this.matrix[i][31] = this.matrix[i][1];
		nextMatrixState[i][31] = this.matrix[i][1];
	}
	let born = false;
	let survive = false;
	for (let i = 1; i < this.size - 1; i++) {
	    for (let j = 1; j < this.size - 1; j++) {
	    	for (let b = 0; b < rules.bornRules.length; b++) {
	    		if (neighboursQuantity(this.matrix, i, j) == rules.bornRules[b] && this.matrix[i][j] != 1) {
					born = true;
	    		}
	    	}
	    	for (let s = 0; s < rules.surviveRules.length; s++) {
	    		if (neighboursQuantity(this.matrix, i, j) == rules.surviveRules[s] && this.matrix[i][j] == 1) {
					survive = true;
	    		}
	    	}
	    	if ((born == true) || (survive == true)) {
	    		nextMatrixState[i][j] = 1; 
	    		born = false; 
	    		survive = false;
	    	} else {
	    		nextMatrixState[i][j] = 0; 
	    		born = false; 
	    		survive = false;
	    	}
		}
	}	

	function neighboursQuantity(arr, i, j) {
		let quantity = 0;
		
		for (let x = -1; x < 2; x++) {
			for (let y = -1; y < 2; y++) {
				if ((arr[i + x][j + y] === 1) && ( x != 0 || y != 0)){
					quantity++;
				}
			}
		}
		return quantity;
	}
	return nextMatrixState
}


const Game = function(board) {
	this.board = board;
	this.inProgress = false;
}


Game.prototype.start = function() {
	rules = new LiveRules(document.getElementById('survive').value, document.getElementById('born').value)
	document.getElementById("start").disabled = true;
	document.getElementById("speed").disabled = true;
	document.getElementById("survive").disabled = true;
	document.getElementById("born").disabled = true;
	document.getElementById("reset").disabled = false;
	this.inProgress = true;
	const prevStates = [];
	const process = function() {
		drawMatrix(board.nextBoardState(), board.size);
		board.matrix = board.nextBoardState();
	}
	living = setInterval(function() {
		process();
		if(repeats(board.nextBoardState(), prevStates) || repeats(board.matrix, prevStates)) {
			clearInterval(living);
			game.reset();
			alert('End')
		}

		prevStates.push(board.matrix);
		
	}, 2000 / document.getElementById('speed').value);
	}

Game.prototype.reset = function() {
	document.getElementById("start").disabled = false;
	document.getElementById("speed").disabled = false;
	document.getElementById("survive").disabled = false;
	document.getElementById("born").disabled = false;
	board.matrix = board.matrix.map( y => {
		return y.map( x => {
			return 0;
		});
	});
	this.inProgress = false;
	clearInterval(window.living);
	drawMatrix(board.matrix);
}

function drawMatrix(matrix, size = 32) {
	fieldcontext.lineWidth = 0.08;
	
	for (let i = 1; i < size - 1; i++) {
		for (let j = 1; j < size - 1; j++) {
			if (matrix[i][j] == 0) {
				fieldcontext.fillStyle = '#F0F8FF';
				fieldcontext.fillRect(i, j, 1, 1);
				fieldcontext.strokeRect(i, j, 1, 1,);
			} else {
				fieldcontext.fillStyle = 'black';
				fieldcontext.fillRect(i, j, 1, 1);
				fieldcontext.strokeRect(i, j, 1, 1,);
			}
		}
	}
}

function repeats(arr1, arr2) {
	if (arr2.some(arr => !( arr > arr1 || arr < arr1 ))) {
		return true;
	}
	return false;
}

const board = new Board();

game = new Game(board);

drawMatrix(board.matrix, board.size);
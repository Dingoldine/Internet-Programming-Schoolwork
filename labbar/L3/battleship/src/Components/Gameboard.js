import React, { Component } from "react";
import "./Gameboard.css";
import Box from "./Box";

//Gameboard Component
class Gameboard extends Component {

	constructor(props){
		super(props);
		this.placedShips = 0;
		this.maxNumberOfShips = 5;
		this.numberOfShots = 0;
		this.gridSize = 5;


		this.handleClick = this.handleClick.bind(this);
		this.takeShot = this.takeShot.bind(this);

		this.state = {
			//Fill the grid 
			"grid": Array(this.gridSize).fill().map(x => Array(this.gridSize).fill("Empty")),
		};
	}


	//called for everytime the component recieves props
	componentWillReceiveProps(nextProps) {

		//If mode = initial set everything to initial values, happens when parent is reset		
		if (nextProps.mode === "Initial") {
			this.setState({ "grid": Array(this.gridSize).fill().map(x => Array(this.gridSize).fill("Empty")) });
			this.placedShips = 0;
			this.numberOfShots = 0;
		}
		//if parent send in all of these we know gridB shoud fill itself with shiips automatically
		else if (nextProps.mode === "Automatic" && nextProps.player === "PlayerB" && nextProps.phase === "Selection"){
			this.automaticFill();
		}
		//if this is true we emulate a click by shooting at a random grid-square 
		else if(nextProps.shootAtOwnBoard){
			this.shootAtRandom();
		}
	}

	//Fills gridB with random ships at random places
	automaticFill(){
		const g = this.state.grid;

		var i = 0;
		var j = 0;

		while(this.placedShips < 5){
			var ship = Math.random() < 0.5 ? "vertical" : "horizontal";

			if (ship === "vertical") {
				i = Math.floor(Math.random() * (this.gridSize - 1));
				j = Math.floor(Math.random() * (this.gridSize));
				if (this.state.grid[i][j] === "Empty" && this.state.grid[i+1][j] === "Empty"){
					this.placedShips++;
					g[i][j] = "Occupied";
					g[i+1][j] = "Occupied";			    
				}

			}
			else{
				i = Math.floor(Math.random() * (this.gridSize));
				j = Math.floor(Math.random() * (this.gridSize-1));
				if (this.state.grid[i][j] === "Empty" && this.state.grid[i][j+1] === "Empty"){
					this.placedShips++;
					g[i][j] = "Occupied";
					g[i][j+1] = "Occupied";

				}
			}
		}

		this.setState({"grid":g}); 	
	}

	//Shoots at a random grid-square
	shootAtRandom(){
		var x = Math.floor(Math.random() * (this.gridSize));
		var y = Math.floor(Math.random() * (this.gridSize));
		const g = this.state.grid;

		this.numberOfShots++;

		if (this.state.grid[x][y] === "Occupied"){
			this.props.setSmallMessage("Your ship got hit! total shots: " + this.numberOfShots);
			this.props.setMessage("Your turn!");		
			g[x][y] = "Hit";
			this.setState({"grid":g});
			this.checkIfWin();
		}

		else{
			this.props.setSmallMessage("Computer missed your ships! total shots " + this.numberOfShots);
			this.props.setMessage("Your turn!");
		}

		this.props.shootAtPlayerA();
	}

	//Check if all ships on the board has been hit, in that case winner is anounced and handleWin in parent is called
	checkIfWin(){
		const g = this.state.grid;
		var hits = 0;

		for(var i = 0; i < this.gridSize; i++) {
			for(var j = 0; j < this.gridSize; j++) {
				if (g[i][j] === "Hit") {
					hits++;
				}
			}
		}

		if(hits === this.maxNumberOfShips*2){
			var theWinner = "";

			if(this.props.id === "gridA"){
				theWinner = "PlayerB";
				this.props.handleWin(theWinner);
			}
			else{
				theWinner = "PlayerA";
				this.props.handleWin(theWinner);
			}

		}

	}

	giveClearSignal(){
		let bool = true;
		if (this.placedShips === 5){
			this.props.recieveClearSignal(bool);
		}
		else
			this.props.recieveClearSignal(!bool);
	}
	
	//Handles placement and removal of ships, makes sure we cannot place them ontop of others or outside of grid borders
	handleClick(x, y){

		const g = this.state.grid;

		if(this.props.shipType === "horizontal"){
			//check bounds
			if(y+1 > this.gridSize -1){
				this.props.setMessage("out of bounds");
			}

			else if(this.props.whoseTurn === this.props.player){
				if (this.state.grid[x][y] === "Empty" && this.state.grid[x][y+1] === "Empty"){
					if(this.placedShips < this.maxNumberOfShips){
						this.placedShips++;
						this.giveClearSignal();
						this.props.setMessage("Successfully placed a ship. total: " + this.placedShips);
						g[x][y] = "Occupied";
						g[x][y+1] = "Occupied";
						this.setState({"grid":g});
					}
					else{
						this.props.setMessage("Already placed " + this.maxNumberOfShips.toString()+ " ships");
						
					}		  
				}

				else if(this.state.grid[x][y] === "Occupied" && this.state.grid[x][y+1] === "Occupied"){
					g[x][y] = "Empty";
					g[x][y+1] = "Empty";
					this.placedShips--;
					this.props.setMessage("Removed a ship. total: " + this.placedShips);
					this.giveClearSignal();
					this.setState({"grid":g});
				}

			}

			else{
				this.props.setMessage("Place the ships on your own board fool..");
			}
		}

		else if(this.props.shipType === "vertical"){
		//console.log("clicked!" + "row " + x.toString() + " col " + y.toString());
			if(x+1 > this.gridSize-1){
				this.props.setMessage("out of bounds");
			}

			else if(this.props.whoseTurn === this.props.player){

				if (this.state.grid[x][y] === "Empty" && this.state.grid[x+1][y] === "Empty"){
					if(this.placedShips < this.maxNumberOfShips){
						this.placedShips++;
						this.giveClearSignal();
						this.props.setMessage("Successfully placed a ship. total: " + this.placedShips);
						g[x][y] = "Occupied";
						g[x+1][y] = "Occupied";
						this.setState({"grid":g});
					}
					else{
						this.props.setMessage("Already placed " + this.maxNumberOfShips.toString()+ " ships");
						
					}	  
				}

				else if(this.state.grid[x][y] === "Occupied" && this.state.grid[x+1][y] === "Occupied"){
					g[x][y] = "Empty";
					g[x+1][y] = "Empty";
					this.placedShips--;
					this.props.setMessage("Removed a ship. total: " + this.placedShips);
					this.giveClearSignal();
					this.setState({"grid":g}); 
				}
			}

			else{
				this.props.setMessage("Place the ships on your own board fool..");
			}


		}
	}


	//Handles a click on a gridsquare, checks if hit or miss, behaves different depending on game mode , pvp or pvc 
	takeShot(x, y){

		//if game mode is pvp
		if (this.props.mode === "Manual"){
			if(this.props.whoseTurn === this.props.player){
				this.props.setMessage("Wrong Side! You shoot at your own ships!");
			}
			else{
				const g = this.state.grid;

				this.numberOfShots++;

				if (this.state.grid[x][y] === "Occupied"){
					this.props.setSmallMessage(this.props.player + " ship got hit! total shots: "  + this.numberOfShots)
					this.props.setMessage(this.props.player +"'s turn");
					g[x][y] = "Hit";
					this.setState({"grid":g});
					this.checkIfWin();

				}
				else{
					this.props.setSmallMessage("miss! total shots:" + this.numberOfShots);
					this.props.setMessage(this.props.player +"'s turn");
				}
				this.props.switchTurn();
			}
		}

		//if Game mode is pvc
		else{
			if(this.props.id === "gridB"){

				const g = this.state.grid;

				this.numberOfShots++;

				if (this.state.grid[x][y] === "Occupied"){
					this.props.setSmallMessage("You hit a ship! total shots: "  + this.numberOfShots);
					g[x][y] = "Hit";
					this.setState({"grid":g});
					this.checkIfWin();

				}
				else{
					this.props.setSmallMessage("miss! total shots:" + this.numberOfShots);
				}

				this.props.shootAtPlayerA();
			}
		}
	}

	//renders the grid 
	render() {
		const g = this.state.grid;
		//loop through the squares in each row and generate a new Square component,
		//passing in props to the Square component in the nested map() function
		const board = g.map((row, i) => { return (
			<div className = "row" key={"row_"+i}>
				{row.map((col, j) => {
					//Sets important props for the below  gridsquare component, determines how they will appear on the screen 
					const occupied = (g[i][j] === "Empty") ? false:true;
					const hit = (g[i][j] === "Hit") ? true:false;
					//return Square component, passing in the following as props:
					//a value for the key which React needs (I think) and
					//a function to handle clicks with grid coordinates passed in as arguments
					return (
					//The gridsquare component 
						<Box 
							handleClick={()=>this.handleClick(i,j)} 
							number ={(i*this.gridSize) + j} 
							key={i+"_"+j} 
							phase = {this.props.phase} 
							mode = {this.props.mode}
							occupied = {occupied}
							takeShot={()=>this.takeShot(i,j)}
							hit ={hit}
							makeInvisible = {this.props.makeInvisible}
							id = {this.props.id}
						/>
					);
				}
				)
				}
			</div>);


		});

		return (
			<div id={this.props.id}>
				{board}
			</div>	
		);

	}
}


export default Gameboard;

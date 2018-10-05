import React, { Component } from "react";
import "./App.css";
import Gameboard from "./Components/Gameboard";
import Console from "./Components/Console";


//Main application, Parent of all components, controls behavior by changeing its state and passing down informations as props
class App extends Component {

	constructor(){
		super();

		this.handler = this.handler.bind(this);
		this.Secondhandler = this.Secondhandler.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.handleStart = this.handleStart.bind(this);


		this.switchTurn = this.switchTurn.bind(this);
		this.setMessage = this.setMessage.bind(this);
		this.setSmallMessage = this.setSmallMessage.bind(this);
		this.switchTurnPlacingShips = this.switchTurnPlacingShips.bind(this);
		this.recieveClearSignal = this.recieveClearSignal.bind(this);
		this.shipSelection = this.shipSelection.bind(this);
		this.handleWin = this.handleWin.bind(this);
		this.handleStartVsComputer = this.handleStartVsComputer.bind(this);
		this.computerShoots = this.computerShoots.bind(this);


		this.state = {
			message: "Select opponent",
			smallmessage: "",
			mode:  "Initial",
			phase: "Initial",
			whoseTurn: "PlayerA",
			gridAReady: false,
			gridBReady: false,
			fullBoard: false,
			makeInvisible: false,
			shipType: "horizontal",
			shootAtOwnBoard: false
		};
	}

	//Start a new game as mode Player vs Player, "Manual". Goes into the phase of "Selection"
	handler(e) {
		e.preventDefault();
		this.setState({
			message: "Start placing your Ships!",
			mode: "Manual",
			phase: "Selection"
		});
	}

	handleWin(m){
		this.setState({
			message: m + " WINS!!",
			mode: "End",
			phase: "End"
		});
	}

	//Start a new game as mode Player vs Computer, "Automatic".Goes into the phase of "Selection"
	Secondhandler(e) {
		e.preventDefault();
		this.setState({
			message: "Start placing your Ships!",
			mode: "Automatic",
			phase: "Selection"
		});
	}

	//Reset the game, sets state to inital values
	handleReset(e){
		e.preventDefault();
		this.setState({
			message: "Select opponent",
			smallmessage: "",
			mode:  "Initial",
			phase: "Initial",
			whoseTurn: "PlayerA",
			gridAReady: false,
			gridBReady: false,
			fullBoard: false,
			makeInvisible: false,
			shipType: "horizontal",
			shootAtOwnBoard: false
		});
	}

	//Takes the game into the state of "Playing" ie. the shooting down of ships can begin.
	handleStart(){
		this.setState({
			message: "Starting the game! Get ready for battle! PlayerA starts.",
			phase: "Playing",
			whoseTurn: "PlayerA",
			gridBReady: true,
			gridAReady: true,
		});
	}
	
	//Sets the next player who is about to shoot. Only interesting in the case Player vs Player
	switchTurn(){
		var nextPlayer = (this.state.whoseTurn === "PlayerA") ? "PlayerB" : "PlayerA";
		this.setState({
			whoseTurn: nextPlayer,
		});
	}

	//Changes player that places ships on the board, calls for handle start if both is already correctly set
	switchTurnPlacingShips(){
		if(this.state.fullBoard){
			if(this.state.whoseTurn === "PlayerA"){
				this.setState({
					whoseTurn: "PlayerB",
					gridAReady: true,
					makeInvisible: true
				});
			}
			else{
				this.handleStart();
			}

		}
	}

	//Called for only if the game mode is Player vs Computer. The equivalent of switchTurnPlacingShips
	handleStartVsComputer(){
		if(this.state.fullBoard){
			this.handleStart();
		}
	}  

	//Selects if ships are horizontal of not horizontal
	shipSelection(){
		var ship = (this.state.shipType === "horizontal") ? "vertical" : "horizontal";
		this.setState({
			shipType: ship
		});
	}

	//Sets the main message message  
	setMessage(m){
		this.setState({
			message: m
		});
	}

	//Sets the small message 
	setSmallMessage(m){
		this.setState({
			smallmessage: m
		});
	}

	//Called by Gameboard component when ships are correctly set
	recieveClearSignal(bool){
		if (bool) {
			this.setState({
				fullBoard: true
			});
		}
		else{
			this.setState({
				fullBoard: false
			});
		}

	}

	//Sets if a board should "shoot at itself". to emulate an invisible click, the cmoputer shooting on it
	computerShoots(){
		var bool = (this.state.shootAtOwnBoard === true) ? false : true;
		this.setState({
			shootAtOwnBoard: bool
		});
	}

	//Render method, what we return and send in to children components depends on the mode of the game.
	render() {
		
		if (this.state.mode === "Automatic") {
			return (
				<div id = "placeholder">
					<Gameboard mode={this.state.mode} id = "gridA" player = "PlayerA" whoseTurn = {this.state.whoseTurn} 
						switchTurn = {this.switchTurn} phase = {this.state.phase} setMessage = {this.setMessage} 
						recieveClearSignal = {this.recieveClearSignal}
						setSmallMessage = {this.setSmallMessage}
						makeInvisible = {this.state.makeInvisible} shipType = {this.state.shipType} handleWin = {this.handleWin} 
						shootAtOwnBoard = {this.state.shootAtOwnBoard}
						shootAtPlayerA = {this.computerShoots}/>
					
					<Gameboard 
						mode={this.state.mode} 
						id = "gridB" 
						player = "PlayerB" 
						whoseTurn = {this.state.whoseTurn} 
						switchTurn = {this.switchTurn} 
						phase = {this.state.phase}
						setMessage = {this.setMessage}
						setSmallMessage = {this.setSmallMessage}
						recieveClearSignal = {this.recieveClearSignal}
						makeInvisible = {this.state.makeInvisible}
						shipType = {this.state.shipType}
						handleWin = {this.handleWin}
						shootAtPlayerA = {this.computerShoots}
					/>

					<Console 
						mode = {this.state.mode} 
						phase ={this.state.phase}
						smallmessage = {this.state.smallmessage} 
						message = {this.state.message} 
						resetHandler = {this.handleReset} 
						startHandler = {this.handleStart}
						switchTurn = {this.handleStartVsComputer}
						whoseTurn = {this.state.whoseTurn}
						shipSelection = {this.shipSelection}
						buttonLabel = {this.state.shipType}/>     
				</div>
			);

		}
		
		else if(this.state.mode === "Manual"){
			return (
				<div id = "placeholder">
					<Gameboard mode={this.state.mode} id = "gridA" player = "PlayerA" whoseTurn = {this.state.whoseTurn} 
						switchTurn = {this.switchTurn} phase = {this.state.phase} setMessage = {this.setMessage} setSmallMessage = {this.setSmallMessage}
						recieveClearSignal = {this.recieveClearSignal}
						makeInvisible = {this.state.makeInvisible} shipType = {this.state.shipType} handleWin = {this.handleWin} />
					
					<Gameboard 
						mode={this.state.mode} 
						id = "gridB" 
						player = "PlayerB" 
						whoseTurn = {this.state.whoseTurn} 
						switchTurn = {this.switchTurn} 
						phase = {this.state.phase}
						setMessage = {this.setMessage}
						setSmallMessage = {this.setSmallMessage}
						recieveClearSignal = {this.recieveClearSignal}
						makeInvisible = {this.state.makeInvisible}
						shipType = {this.state.shipType}
						handleWin = {this.handleWin}
					/>

					<Console  
						mode = {this.state.mode}
						phase ={this.state.phase} 
						message = {this.state.message} 
						smallmessage = {this.state.smallmessage}
						resetHandler = {this.handleReset} 
						startHandler = {this.handleStart}
						switchTurn = {this.switchTurnPlacingShips}
						whoseTurn = {this.state.whoseTurn}
						shipSelection = {this.shipSelection}
						buttonLabel = {this.state.shipType} 
					/> 

				</div>
			);

		}
		else
			return (
				<div id = "placeholder">
					<Gameboard mode={this.state.mode} id = "gridA" player = "None"/>
					<Gameboard mode={this.state.mode} id = "gridB" player = "None"/>
					<Console  
						mode = {this.state.mode} 
						phase ={this.state.phase} 
						handler = {this.handler} 
						Secondhandler = {this.Secondhandler} 
						message = {this.state.message} 
						smallmessage = {this.state.smallmessage}
						resetHandler = {this.handleReset} 
						switchTurn = {this.switchTurnPlacingShips}
						whoseTurn = {this.state.whoseTurn}/>     
				</div>
			);
	}
}

export default App;

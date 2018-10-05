import React, { Component } from "react";
import Button from "./Button";
import "./Console.css";
import Event from "./Event";

//A console component, parent is main app, children are the event component and all the buttons
class Console extends Component {

//Consile changes appearance based on props set by parent
	render() {
		if (this.props.mode === "Initial"){
			return (
				<div className = "Console">
					<div id = "eventLogger">
						<Event message = {this.props.message}/>
					</div>
					<div id = "sidebar">
						<Button label="vs Computer" handleClick={this.props.Secondhandler}/>
						<Button label="vs Friend" handleClick={this.props.handler}/>
						<Button label="Reset Game" handleClick={this.props.resetHandler}/>
					</div>
				</div>
			);
		}
		else if (this.props.phase === "Playing"){
			return (
				<div className = "Console">
					<div id = "eventLogger">
						<Event message = {this.props.message}/>
						<Event message = {this.props.smallmessage}/>
					</div>
					<div id = "sidebar">
						<Button label="Reset Game" handleClick={this.props.resetHandler}/>
					</div>
				</div>
			);
		}
		else if (this.props.phase === "Selection"){
			return (
				<div className = "Console">
					<div id = "eventLogger">
						<Event message = {this.props.message}/>
						<Event message = {this.props.smallmessage}/>
					</div>
					<div id = "sidebar">
						<Button label="Reset Game" handleClick={this.props.resetHandler}/>
						<Button label="Done" handleClick={this.props.switchTurn}/>
						<Button label={this.props.buttonLabel} handleClick={this.props.shipSelection}/>
					</div>
				</div>
			);
		}
		else{
			return (
				<div className = "Console">
					<div id = "eventLogger">
						<Event message = {this.props.message}/>
						<Event message = {this.props.smallmessage}/>
					</div>
					<div id = "sidebar">
						<Button label="Reset Game" handleClick={this.props.resetHandler}/>
					</div>
				</div>
			);
		}
	}
}

export default Console;
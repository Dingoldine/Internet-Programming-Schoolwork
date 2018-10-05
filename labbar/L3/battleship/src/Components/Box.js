import React, { Component } from "react";

//A box component represening a position on the board
class Box extends Component {

	//returns a square based on what mode the game is in, aswell as if it is occupied or not, hit or not, full of if- statements
	//makes sure that one sides ships are invisible while the other is placing ships etc,
	//also makes sure computers ships are always invisible
	render(){
		if(this.props.phase === "Selection"){
			if (this.props.mode === "Automatic"){
				if (this.props.id === "gridB"){
					return (
						<div className ='gridsquare'>
							<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
						</div>
					);
				}
				else{
					if(this.props.occupied === true){

						return (
							<div className ='gridsquareOccupied'>
								<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
							</div>
						);

					}

					else{

						return (
							<div className ='gridsquare'>
								<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
							</div>
						);

					}
				}
			}

			else{
				if((this.props.occupied === true) && (!this.props.makeInvisible) && (this.props.id === "gridA")){

					return (
						<div className ='gridsquareOccupied'>
							<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
						</div>
					);

				}

				else if((this.props.occupied === true) && (this.props.id === "gridB")){
					return (
						<div className ='gridsquareOccupied'>
							<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
						</div>
					);
				}

				else{	
					return (
						<div className ='gridsquare'>
							<div className='inner' onClick={this.props.handleClick}>{this.props.number}</div>
						</div>
					);
				}
			}
		}

		else if(this.props.phase === "Playing"){
			if(this.props.hit === true){
				return (
					<div className ='gridsquareHit'>
						<div className='inner'>{this.props.number}</div>
					</div>
				);
			}
			else{	
				return (
					<div className ='gridsquare'>
						<div className='inner' onClick={this.props.takeShot}>{this.props.number}</div>
					</div>
				);
			}
		}

		else {

			return (
				<div className ='gridsquare'>
					<div className='inner'>{this.props.number}</div>
				</div>
			);
		}
	}

}

export default Box;


import React, { Component } from "react";


//A button coponent, has a callback fucntion that set something in the top level main app. 
class Button extends Component {


	render() {
		var buttonStyle = {
			margin: "10px 10px 10px 0"
		};

		return (
			<button
				className="btn btn-default"
				style={buttonStyle}
				onClick={this.props.handleClick}>
				
				{this.props.label}</button>
		);
	}
}


export default Button;
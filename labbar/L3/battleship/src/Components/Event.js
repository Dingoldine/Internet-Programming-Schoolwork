import React, { Component } from "react";

//Event component, displayes a message,  a event of whats just happened. 
class Event extends Component {
	render() {
		return (
			<p>{this.props.message}</p>
		);
	}
}

export default Event;

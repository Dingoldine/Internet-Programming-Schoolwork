import React, { Component } from "react";

class ClickabĺeCell extends Component {
	constructor(props){
		super();
		this.state = {
			empty: "yes"
		};
	}

	render() {
		return (
			<h1> {this.props.title} </h1>
		);
	}
}

export default ClickabĺeCell;

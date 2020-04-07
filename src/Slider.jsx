import React from 'react';

class Slider extends React.Component {
	render() {
		return (
			<input
				type="range"
				defaultValue={this.props.defaultValue}
				min={this.props.min}
				max={this.props.max}
				value={this.props.value}
				step={this.props.step}
				onChange={this.props.onChange}
				name={this.props.name}
			/>
		);
	}
}
export default Slider;

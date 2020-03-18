import { connect } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import Slider from './Slider';

function mapStateToProps(state) {
	return {
		height: state.height,
		width: state.width,
		depth: state.depth,
		colour: state.colour
	};
}

const FormWrap = styled.form`
	border: 5px solid fuchsia;
	height: 20%;
	width: 50%;
	display: flex;
	align-items: flex-end;
	justify-content: center;
`;

class FormContainer extends React.Component {
	handleOnChangeHeight = e => {
		this.props.dispatch({
			type: 'UPDATE_HEIGHT',
			newHeight: e.target.value,
			whatever: 'something' //you can pass multiple values through to the reducer. maybe i pass the whole state through? nah that doesn't seem to make sense as its already in redux.
		});
	};

	handleOnChangeWidth = e => {
		this.props.dispatch({
			type: 'UPDATE_WIDTH',
			newValue: e.target.value
			// valueType: e.target.parent.name
		});
	};

	render() {
		return (
			<FormWrap>
				<label>
					<Slider
						type="range"
						// min={this.props.min}
						min={1}
						// max={this.props.max}
						max={10}
						value={this.props.height}
						// step={this.props.step}
						step={0.1}
						// onChange={e => {
						// 	this.props.dispatch({
						// 		type: 'UPDATE_HEIGHT',
						// 		newTest: e.target.value
						// 	});
						// }}
						onChange={this.handleOnChangeHeight}
					/>
					TEST PARAM
				</label>
				<label>
					<Slider
						type="range"
						// min={this.props.min}
						min={0.3}
						// max={this.props.max}
						max={5}
						value={this.props.width}
						// step={this.props.step}
						step={0.1}
						// onChange={e => {
						// 	this.props.dispatch({
						// 		type: 'UPDATE_HEIGHT',
						// 		newTest: e.target.value
						// 	});
						// }}
						onChange={this.handleOnChangeWidth}
					/>
					TEST PARAM
				</label>
			</FormWrap>
		);
	}
}

export default connect(mapStateToProps)(FormContainer);

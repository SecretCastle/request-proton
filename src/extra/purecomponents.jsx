import React, { PureComponent, Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * 
 * 这里PurComponent 和 Component 的区别很重要啊，有助于优化性能
 * 
 * 差别：
 * 1、在传入的props相同时，PurComponent 在 shouldComponentUpdate 做了一层判断，如果props相同，则不渲染。。。。。参考官网解释
 *    注意这里只是浅比较，如果存在深层次的差异的话，可能出现问题，这个需要在项目中发现问题.
 * 2、而Component则只要props发生变化，则就立即渲染
 * 
 *
 */

class ExtraText extends Component {
	constructor() {
		super();
		this.state = {
			name : 'chen'
		};
	}

	changesth = () => {
		this.setState({
			name: 'my name is CHN_ROLL',
		});
	}

	render() {
		console.log('main render');
		return (
			<div>
				<ChildTest name={this.state.name}/>
				<ChildTestNotPur name={this.state.name}/>
				<button onClick={this.changesth}>click me</button>
			</div>
		);
	}
}

class ChildTest extends PureComponent {
	render() {
		console.log('PurComponent Render');
		return (
			<div>{this.props.name}</div>
		);
	}
}

class ChildTestNotPur extends Component {
	render() {
		console.log('Component Render');
		return (
			<div>{this.props.name}</div>
		);
	}
}


ReactDOM.render(
	<ExtraText />,
	document.getElementById('app')
);
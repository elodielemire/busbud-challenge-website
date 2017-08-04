import React from 'react';

class SortButton extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.category = 'price'; // when loading the tickets, they are already sorted by time
  }

  handleClick () {
    this.props.clickHandler(this.category);
    this.category = this.category === 'price' ? 'time' : 'price';
  }

  render () {
    return (
      <div id='sortButton'>
        <div className='col-xs-12'>
          <div className='button' onClick={this.handleClick}><i className='glyphicon glyphicon-sort'></i>Sort the results by {this.category}</div>
        </div>
    </div>
    )
  };
}

export default SortButton;

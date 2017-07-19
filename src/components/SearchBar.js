import React from 'react';

class SearchBar extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.props.clickHandler();
  }

  render () {
    return (
      <form id='searchBar' autoComplete='off' noValidate=''>
        <div className='row'>
          <div className='citiesInput col-xs-12 col-sm-5'>
            <input className='form-control' type='text' value='New York City' onChange={()=>{}} required disabled placeholder='From'></input>
            <i className='glyphicon glyphicon-arrow-right'></i>
            <input className='form-control' type='text' value='Montreal' onChange={()=>{}} required disabled placeholder='To'></input>
          </div>
          <div className='has-feedback-right col-xs-5 col-sm-3'>
            <i className='form-control-feedback glyphicon glyphicon-calendar'></i>
            <input className='form-control' type='text' value='07-29-2017' onChange={()=>{}} required placeholder='Departure date'></input>
          </div>
          <div className='has-feedback-right col-xs-3 col-sm-2'>
            <i className='form-control-feedback glyphicon glyphicon-user'></i>
            <input className='form-control' type='text' onChange={()=>{}} required value='1' placeholder='Passengers'></input>
          </div>
          <div className='has-feedback-right col-xs-4 col-sm-2'>
            <button type='button' onClick={this.handleClick} className='go'>GO !</button>
          </div>
        </div>
    </form>
    )
  };
}

export default SearchBar;

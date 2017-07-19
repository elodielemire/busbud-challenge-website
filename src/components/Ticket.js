import React from 'react';
import moment from 'moment';
import Details from './Details';

class Ticket extends React.Component {
  constructor (props) {
    super(props);
    this.state = {showDetails: false};
    this.showDetails = this.showDetails.bind(this);
  }

  showDetails () {
    this.setState({showDetails: !this.state.showDetails});
  }

  render () {
    const langDatas = this.props.langDatas;
    const hideStr = this.props.langDatas.hide;
    const detailsStr = this.props.langDatas.details;

    const ticketData = this.props.dataToTransfer;
    const datasToShow = {
      depTime: moment(ticketData.departure_time).format('hh:mm A'),
      arrTime: moment(ticketData.arrival_time).format('hh:mm A'),
      duration: ticketData.duration,
      classCat: ticketData.class,
      price: ticketData.prices.total / 100,
      operator: ticketData.operatorElement,
      destCity: ticketData.destCityElement,
      originCity: ticketData.originCityElement,
      originLocation: ticketData.originLocationElement,
      destLocation: ticketData.destLocationElement
    };
    return (
      <div id='ticket'>
        <div className='row mainRow'>
          <div className='col-xs-4 col-sm-3 col1'>
            <h4>{datasToShow.depTime}</h4>
            <br></br>
            <br></br>
            <h4>{datasToShow.arrTime}</h4>
          </div>
          <div className='col-xs-8 col-sm-6 col2'>
            <h5>{datasToShow.originLocation.name}</h5>
            <p>{datasToShow.originCity.name}</p>
            <i className='glyphicon glyphicon-arrow-down'></i>
            <h5>{datasToShow.destLocation.name}</h5>
            <p>{datasToShow.destCity.name}</p>
          </div>
          <div className='col-xs-12 col-sm-3 col3'>
            <p>{datasToShow.operator.name}</p>
            <br></br>
            <h4>${datasToShow.price}</h4>
            <br></br>
            <div className='showDetails' onClick={this.showDetails}><i className={this.state.showDetails ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'}></i>{this.state.showDetails ? hideStr : detailsStr}</div>
          </div>
        </div>
        {this.state.showDetails ? <Details className='row'
          ticketData={ticketData}
          operator={datasToShow.operator}
          price={datasToShow.price}
          duration={datasToShow.duration}
          classCat={datasToShow.classCat}
          destLocation={datasToShow.destLocation}
          originLocation={datasToShow.originLocation}
          langDatas={langDatas.Details}
          /> : null}
      </div>
    );
  }
}

export default Ticket;

import React from 'react';
import moment from 'moment';

class Details extends React.Component {
  constructor (props) {
    super(props);
    this.goToBusbud = this.goToBusbud.bind(this);
  }

  goToBusbud () {
    window.open(this.props.ticketData.links.deeplink, '_blank');
  }
  render () {
    const duration = this.props.duration;
    const langDatas = this.props.langDatas;
    const hoursDur = Math.floor(duration / 60);
    const minDur = duration % 60;
    const depTime = moment(this.props.ticketData.departure_time).format('MMMM Do YYYY hh:mm A');
    const arrTime = moment(this.props.ticketData.arrival_time).format('MMMM Do YYYY hh:mm A');

    return (
      <div id='details'>
        <div className='row'>
          <div className='subRow'>
            <div className='col-xs-7 col-sm-10'>
              <h4>${this.props.price} USD</h4>
              <p>{langDatas.oneway}</p>
            </div>
            <div className='col-xs-5 col-sm-2'>
              <br></br>
              <button className='buy' onClick={this.goToBusbud}>{langDatas.buy}</button>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 col-sm-4'>
            <h4>{this.props.operator.name}</h4>
            <p>{langDatas.class} : {this.props.classCat}</p>
            <p>{langDatas.duration} : {hoursDur}h{minDur}</p>
            {this.props.ticketData.amenities.toilet && <p><i className='glyphicon glyphicon-ok'></i> {langDatas.toilet}</p>}
            {this.props.ticketData.amenities.wifi && <p><i className='glyphicon glyphicon-ok'></i> {langDatas.wifi}</p>}
            {this.props.ticketData.amenities.power_outlets && <p><i className='glyphicon glyphicon-ok'></i> {langDatas.power}</p>}
            {this.props.ticketData.amenities.ac && <p><i className='glyphicon glyphicon-ok'></i> {langDatas.ac}</p>}
            {this.props.ticketData.amenities.tv && <p><i className='glyphicon glyphicon-ok'></i> {langDatas.tv}</p>}
          </div>
          <div className='col-xs-6 col-sm-4'>
            <h4>{langDatas.departure}</h4>
            <p>{depTime}</p>
            <p>{this.props.originLocation.name}</p>
            <p className='address'>{this.props.originLocation.address[0]}</p>
            <p className='address'>{this.props.originLocation.address[1]}</p>
            <p className='address'>{this.props.originLocation.address[2]}</p>
          </div>
          <div className='col-xs-6 col-sm-4'>
            <h4>{langDatas.arrival}</h4>
            <p>{arrTime}</p>
            <p>{this.props.destLocation.name}</p>
            <p className='address'>{this.props.destLocation.address[0]}</p>
            <p className='address'>{this.props.destLocation.address[1]}</p>
            <p className='address'>{this.props.destLocation.address[2]}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;

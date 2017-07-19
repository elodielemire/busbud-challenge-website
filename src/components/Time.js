import React from 'react';

let eventDate = new Date('Aug 04 16:00:00 2017');

class Time extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      timeLeftStr: this.calculateTimeLeft(),
      background: '#FBEE40'
    };
  }

  calculateTimeLeft () {
    let diffSec = (eventDate - new Date()) / 1000;
    let timeLeftStr = '';
    let secondsInOneDay = 60 * 60 * 24;
    if (diffSec > 0) {
      let days, hours, mn, s;
      days = Math.floor(diffSec / secondsInOneDay);
      hours = Math.floor((diffSec - (days * secondsInOneDay)) / 3600);
      mn = Math.floor((diffSec - ((days * secondsInOneDay + hours * 3600))) / 60);
      s = Math.floor(diffSec - ((days * secondsInOneDay + hours * 3600 + mn * 60)));
      timeLeftStr = this.props.langDatas.timeLeft + ' ' + days.toString() + ' ' + this.props.langDatas.days + ' ' + hours.toString() + ' ' + this.props.langDatas.hours + ' ' + mn.toString() + ' mn ' + s.toString() + ' s ';
    } else { // If the event is finished
      timeLeftStr = this.props.langDatas.sorry;
      this.setState({
        background: 'red'
      });
    }
    return timeLeftStr;
  }

  componentDidMount () {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.intervalID);
  }

  tick () {
    this.setState({
      timeLeftStr: this.calculateTimeLeft()
    });
  }

  render () {
    return (
      <div id='time' style={{backgroundColor: this.state.background}}>
        {this.state.timeLeftStr}
      </div>
    );
  }
}

export default Time;

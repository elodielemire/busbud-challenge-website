import React, { Component } from 'react';
import '../stylesheet/App.css';
import moment from 'moment';
// Images
import busImg from '../img/bus.gif';
import nycImg from '../img/nyc.jpg';
import githubIcon from '../img/github-logo.gif';
import osheagaImg from '../img/osheaga.jpg';
import osheagaLogo from '../img/logo-osheaga.png';
import busbudLogo from '../img/logo-busbud.png';
import frFlag from '../img/fr-flag.png';
import usFlag from '../img/us-flag.png';
// Components
import Time from './Time';
import Ticket from './Ticket';
import SearchBar from './SearchBar';
import SortButton from './SortButton';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      lang: 'en',
      ticketsAreReady: false,
      busHasCrossed: false,
      errorMessageClass: 'hideError'
    };
    this.sortResultsBy = this.sortResultsBy.bind(this);
    this.associateTables = this.associateTables.bind(this);
    this.loopThroughTables = this.loopThroughTables.bind(this);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.fetchDatas = this.fetchDatas.bind(this);
    this.pollDatas = this.pollDatas.bind(this);
    this.langDatas = require('../i18n/en.json');
    this.ticketsAreShown = false;
    this.departureTimes = [];
    var todaysDate = new Date();
    var tomorrowsDate = todaysDate.setDate(todaysDate.getDate() + 1);
    this.searchDate = moment(tomorrowsDate).format('YYYY-MM-DD');
  }

  componentDidMount () {
    // show the tickets once the bus crossed the screen
    this.refs.app.addEventListener('animationend', () => {
      this.setState({busHasCrossed: true, busMovingClass: 'animated'});// position the bus on the right side
    });
  }

  switchLanguage (e) {
    var langClicked = e.target.getAttribute('data-lang');
    this.langDatas = require('../i18n/' + langClicked + '.json');
    this.setState({lang: langClicked});
  }

  fetchDatas () {
    var pathParams = {
      origin: 'dr5reg',
      destination: 'f25dvk',
      outbound_date: this.searchDate
    };
    var apiUrl = 'https://napi.busbud.com/x-departures/' + pathParams.origin + '/' + pathParams.destination + '/' + pathParams.outbound_date;
    const myHeaders = {
      'Accept': 'application/vnd.busbud+json; version=2; profile=https://schema.busbud.com/v2/',
      'X-Busbud-token': 'PARTNER_JSWsVZQcS_KzxNRzGtIt1A'
    };
    const queryParams = {
      headers: myHeaders,
      adult: 1,
      child: 0,
      senior: 0,
      lang: 'en',
      currency: 'USD'
    };

    // Nothing happens if the tickets are already shown
    if (!this.ticketsAreShown) {
      fetch(apiUrl, queryParams)
      .then(data => data.json())
      .then(dataJson => {
        if (dataJson.error) {
          if (dataJson.error.details.indexOf('date_in_the_past') >= 0) {
            this.showError(this.langDatas.errorMessages.outboundDate); // Specific message for outbound date error
          } else {
            this.showError('Sorry an error has occured : ' + dataJson.error.details); // if the Json has any other error element, the datails will be logged on the page
          }
        } else if (dataJson.complete && dataJson.departures && dataJson.cities && dataJson.operators && dataJson.locations) {
          this.setState({
            departuresData: dataJson.departures,
            citiesData: dataJson.cities,
            operatorsData: dataJson.operators,
            locationsData: dataJson.locations,
            errorMessageClass: 'hideError',
            busMovingClass: 'animating'
          }, () => this.sortResultsBy('time'));
        } else { // if there's no error element but complete is false or any of the datas is missing
          this.pollDatas(pathParams, apiUrl, queryParams, dataJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  pollDatas (pathParams, apiUrl, queryParams, previousData) {
    const pollApiUrl = apiUrl + '/poll';
    const pollQueryParams = queryParams;
    pollQueryParams.index = 0;
    fetch(pollApiUrl, pollQueryParams)
      .then(data => data.json())
      .then(dataJson => {
        if (!dataJson.complete) {
          this.setState({
            busMovingClass: 'animating'
          });
          this.pollDatas(pathParams, apiUrl, queryParams, previousData);
        } else if (dataJson.departures && dataJson.cities && dataJson.operators && dataJson.locations) {
          this.setState({
            departuresData: dataJson.departures,
            citiesData: previousData.cities,
            operatorsData: dataJson.operators,
            locationsData: previousData.locations,
            errorMessageClass: 'hideError'
          }, () => this.sortResultsBy('time'));
        } else {
          this.showError(this.langDatas.errorMessages.unknownError); // For example: sometimes complete is true but the cities were not loaded
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  showError (errorMessage) {
    this.errorMessage = errorMessage;
    this.setState({errorMessageClass: 'showError'});
  }

  sortResultsBy (criteria) {
    var arrayToSort = this.state.departuresData;
    if (criteria === 'time') {
      arrayToSort.sort(function (a, b) {
        return a.departure_time.slice(11, 19).replace(/:/g, '') - b.departure_time.slice(11, 19).replace(/:/g, '');
      });
    } else if (criteria === 'price') {
      arrayToSort.sort(function (a, b) {
        return a.prices.total - b.prices.total;
      });
    }
    this.associateTables(arrayToSort);
  }

  associateTables (departuresArray) {
    departuresArray.map(departureElement => { // loop through all the departures elements and add the other tables to it
      this.departureTimes.push(departureElement.departure_time);

      this.loopThroughTables(this.state.operatorsData, departureElement.operator_id, departureElement);
      departureElement.operatorElement = departureElement.provisioryElement;

      this.loopThroughTables(this.state.locationsData, departureElement.destination_location_id, departureElement);
      departureElement.destLocationElement = departureElement.provisioryElement;

      this.loopThroughTables(this.state.locationsData, departureElement.origin_location_id, departureElement);
      departureElement.originLocationElement = departureElement.provisioryElement;

      this.loopThroughTables(this.state.citiesData, departureElement.destLocationElement.city_id, departureElement);
      departureElement.destCityElement = departureElement.provisioryElement;

      this.loopThroughTables(this.state.citiesData, departureElement.originLocationElement.city_id, departureElement);
      departureElement.originCityElement = departureElement.provisioryElement;

      delete departureElement.provisioryElement;
    });
    // Then push the sorted array that contains every elements into the state
    this.setState({
      departuresData: departuresArray,
      ticketsAreReady: true
    });
    this.ticketsAreShown = true;
  }

  loopThroughTables (tableToLoop, linkWithDeparture, departureElement) {
    tableToLoop.map(indexElement => {
      if (linkWithDeparture === indexElement.id) {
        departureElement.provisioryElement = indexElement; // Once the matching element is found, it's stored as a provisiory item that will be injected in departureElement
      }
    });
  }

  render () {
    return (
      <div id='App' ref='app'>
        <div className='header'>
          <div className='flags'>
            <img onClick={this.switchLanguage} className={this.state.lang !== 'en'} data-lang='en' alt='US flag' src={usFlag}></img>
            <img onClick={this.switchLanguage} className={this.state.lang === 'en'} data-lang='fr' alt='French flag' src={frFlag}></img>
          </div>
          <Time langDatas={this.langDatas.Time}></Time>
          <div className='headerPictures'>
            <img className='polaroid ny col-xs-3' alt='nyc street' src={nycImg}></img>
            <a href='https://www.osheaga.com/fr'><img className='logo  col-xs-6' alt='osheaga logo' src={osheagaLogo}></img></a>
            <img className='polaroid osheaga col-xs-3' alt='osheaga crowd' src={osheagaImg}></img>
          </div>
          <div className='busArea'>
            <img className={this.state.busMovingClass} alt='busbud bus' src={busImg}></img>
          </div>
        </div>
        <div className='container headline'>
          <h2>{this.langDatas.headline.wannaGo}</h2>
          <h3><a href='https://www.busbud.com/en-ca'><img className='busbudLogo' alt='busbud logo' src={busbudLogo}></img></a>{this.langDatas.headline.findBus}</h3>
        </div>
        <SearchBar searchDate={this.searchDate} clickHandler={this.fetchDatas}></SearchBar>
        <div className={this.state.errorMessageClass}>
          <p>{this.errorMessage}</p>
        </div>
        {(this.state.ticketsAreReady && this.state.busHasCrossed) ?
          <div className='container tickets'>
            <SortButton clickHandler={this.sortResultsBy}></SortButton>
            {this.state.departuresData.map(function (departureElement, i) {
              return <Ticket key={i} dataToTransfer={departureElement} langDatas={this.langDatas.Ticket}></Ticket>;
              }.bind(this))
            }
          </div>
          : <div className='body'></div>
        }
        <div className='footer'>
          <img src={githubIcon} alt='github icon'></img>
          <p>{this.langDatas.footer.credits} <a href='https://www.busbud.com/en-ca'>busbud</a> | <a href='https://github.com/busbud/coding-challenge-frontend-b'>Challenge repo</a> | <a href='https://github.com/elodielemire/busbud-challenge-website'>Project repo</a></p>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import '../stylesheet/App.css';
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

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      lang: 'en',
      ticketsAreReady: false,
      busHasCrossed: false,
      loadingErrorClass: 'hideError'
    };
    this.sortByTime = this.sortByTime.bind(this);
    this.associateTables = this.associateTables.bind(this);
    this.loopThroughTables = this.loopThroughTables.bind(this);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.fetchDatas = this.fetchDatas.bind(this);
    this.pollDatas = this.pollDatas.bind(this);
    this.langDatas = require('../i18n/en.json');
    this.ticketsAreShown = false;
    this.departureTimes = [];
  }

  componentDidMount () {
    // show the tickets once the bus crossed the screen
    this.refs.app.addEventListener('animationend', () => {
      this.busMovingClass = 'animated'; // position the bus on the right side
      this.setState({busHasCrossed: true});
    });
  }

  switchLanguage (e) {
    var langClicked = e.target.getAttribute('data-lang');
    this.langDatas = require('../i18n/' + langClicked + '.json');
    this.setState({lang: langClicked});
  }

  fetchDatas () {
    const pathParams = {
      origin: 'dr5reg',
      destination: 'f25dvk',
      outbound_date: '2017-07-29'
    };
    const apiUrl = 'https://napi.busbud.com/x-departures/' + pathParams.origin + '/' + pathParams.destination + '/' + pathParams.outbound_date;
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
        console.log('fetch', dataJson, dataJson.complete);
        // Check if every data is here because sometimes complete was true but the cities were not loaded
        if (dataJson.complete && dataJson.departures && dataJson.cities && dataJson.operators && dataJson.locations) {
          this.setState({
            departuresData: dataJson.departures,
            citiesData: dataJson.cities,
            operatorsData: dataJson.operators,
            locationsData: dataJson.locations,
            loadingErrorClass: 'hideError'
          }, () => this.sortByTime());
        } else {
          this.pollDatas(pathParams, apiUrl, queryParams, dataJson);
        }
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
        console.log('poll', dataJson, dataJson.complete && dataJson.departures && dataJson.operators && previousData.cities && previousData.locations);
        if (dataJson.complete && dataJson.departures && dataJson.operators && previousData.cities && previousData.locations) {
          this.setState({
            departuresData: dataJson.departures,
            citiesData: previousData.cities,
            operatorsData: dataJson.operators,
            locationsData: previousData.locations,
            loadingErrorClass: 'hideError'
          }, () => this.sortByTime());
        } else {
          // when the city is not loaded it will never be except if we reload the page
          this.setState({loadingErrorClass: 'showError'});
        }
      });
  }

  sortByTime () {
    var arrayToSort = this.state.departuresData.slice(0);
    arrayToSort.sort(function (a, b) {
      return a.departure_time.slice(11, 19).replace(/:/g, '') - b.departure_time.slice(11, 19).replace(/:/g, '');
    });
    // this.setState({departuresData: arrayToSort});
    this.associateTables(arrayToSort);
  }

  associateTables (departuresArray) {
    this.busMovingClass = 'animating';
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
            <img className={this.busMovingClass} alt='busbud bus' src={busImg}></img>
          </div>
        </div>
        <div className='container headline'>
          <h2>{this.langDatas.headline.wannaGo}</h2>
          <h3><a href='https://www.busbud.com/en-ca'><img className='busbudLogo' alt='busbud logo' src={busbudLogo}></img></a>{this.langDatas.headline.findBus}</h3>
        </div>
        <SearchBar clickHandler={this.fetchDatas}></SearchBar>
        <div className={this.state.loadingErrorClass}>
          <p>{this.langDatas.loadingError.sorry}</p>
        </div>
        {(this.state.ticketsAreReady && this.state.busHasCrossed) ?
          <div className='container tickets'>
            {this.state.departuresData.map(function (departureElement, i) {
              return <Ticket key={i} dataToTransfer={departureElement} langDatas={this.langDatas.Ticket}></Ticket>;
              }.bind(this))
            }
          </div>
          : <div className='body'></div>
        }
        <div className='footer'>
          <img src={githubIcon} alt='github icon'></img>
          <p>{this.langDatas.footer.credits} <a href='https://www.busbud.com/en-ca'>busbud</a> | <a href='https://github.com/busbud/coding-challenge-frontend-b'>Challenge repo</a> | <a href='https://github.com/elodielemire/nyc-osheaga-bus'>Project repo</a></p>
        </div>
      </div>
    );
  }
}

export default App;
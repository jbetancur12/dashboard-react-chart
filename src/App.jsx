import React, { Component } from 'react';
import moment from 'moment';
import Greeting from './Components/Greeting';
import LineChart from './Components/LineChart';

import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import './App.css';

class App extends Component {
  state = {
    greeting: 'Estadísticas COVID-19',
    countries: [],
    filteredCountries: [],
    country: '',
    countrySlug: '',
    isListHidden: true,
    startDate: '',
    endDate: '',
    countryData: [],
  };
  componentDidMount() {
    fetch('https://api.covid19api.com/countries').then((resp) =>
      resp.json().then((json) => {
        this.setState({ countries: json });
      }),
    );
  }

  changeCountryHandler = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredCountries = this.state.countries.filter((country) =>
      country.Slug.includes(value),
    );
    this.setState({ filteredCountries, isListHidden: false });
  };

  selectCountryHandler = (event) => {
    const country = event.target.dataset.countryName;
    const countrySlug = event.target.dataset.countrySlug;
    this.setState({ country, countrySlug, isListHidden: true });
  };

  changeDateHandler = (event) => {
    const key = event.target.name;
    const value = moment(event.target.value).toISOString();

    this.setState({
      [key]: value,
    });
  };

  getCountryData = () => {
    fetch(
      `https://api.covid19api.com/country/${this.state.countrySlug}?from=${this.state.startDate}&to=${this.state.endDate}`,
    ).then((resp) =>
      resp.json().then((json) => {
        this.setState({ countryData: json });
      }),
    );
  };

  render() {
    return (
      <div className='App bg-dark'>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Greeting greeting={this.state.greeting} />
            </Col>
            <Col xs={12} md={4}>
              <Form className='p-3 bg-light shadow rounded'>
                <FormGroup className='position-relative'>
                  <Label className='text-dark'>País:</Label>
                  <Input
                    type='text'
                    name='country'
                    id='country'
                    placeholder='Escribe el nombre del país'
                    onChange={this.changeCountryHandler}
                    value={this.state.country}
                  />
                  <ListGroup className='text-dark'>
                    {this.state.filteredCountries &&
                      this.state.filteredCountries.map((country, index) => (
                        <ListGroupItem
                          key={index}
                          data-country-name={country.Country}
                          data-country-slug={country.Slug}
                          onClick={this.selectCountryHandler}
                          className={`${
                            this.state.isListHidden ? 'd-none' : ''
                          }`}
                        >
                          {country.Country}
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                </FormGroup>{' '}
                <FormGroup className='position-relative'>
                  <Label className='text-dark'>Desde:</Label>
                  <Input
                    type='date'
                    name='startDate'
                    id='startDate'
                    onChange={this.changeDateHandler}
                  />
                </FormGroup>{' '}
                <FormGroup className='position-relative'>
                  <Label className='text-dark'>Hasta:</Label>
                  <Input
                    type='date'
                    name='endDate'
                    id='endDate'
                    onChange={this.changeDateHandler}
                  />
                </FormGroup>
                <Button
                  color='secondary'
                  className='btn-block'
                  type='button'
                  onClick={this.getCountryData}
                >
                  Ver gráfica
                </Button>
              </Form>
            </Col>
            <Col xs={12} md={8}>
              <LineChart countryData={this.state.countryData} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;

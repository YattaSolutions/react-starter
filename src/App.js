import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';


class App extends Component {
   constructor() {
      super();
      this.state = {
         selected: null
      };
   }

   render() {
      const details = this.state.selected ? <CustomerDetail customer={this.state.selected}/> : null;

      return (
            <MuiThemeProvider>
               <div className="App">
                  <header className="App-header">
                     <img src={logo} className="App-logo" alt="logo"/>
                     <h1 className="App-title">Kunden&uuml;bersicht</h1>
                  </header>
                  <p className="App-intro">
                     Hier finden Sie eine Übersicht der im System vorhandenen Kunden.
                  </p>

                  <CustomerList key="kundenliste"/>
                  {details}
               </div>
            </MuiThemeProvider>
      );
   }
}

export default App;

class CustomerList extends React.Component {
   constructor() {
      super();
      this.state = {
         customers: []
      };
   }

   componentDidMount() {
      fetch('http://localhost:9090/backend/customers?projection=overview&size=10').then(results => {
         return results.json();
      }).then(data => {
         console.log(data._embedded.customers);
         this.setState({customers: data._embedded.customers});
      });
   }

   render() {
      return (
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHeaderColumn>Name</TableHeaderColumn>
                     <TableHeaderColumn>Kundennummer</TableHeaderColumn>
                     <TableHeaderColumn>Anzahl K&auml;fe</TableHeaderColumn>
                     <TableHeaderColumn>Aktion</TableHeaderColumn>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {this.state.customers.map(customer => {
                     return <CustomerListEntry customer={customer} key={customer.customerId}/>;
                  })}
               </TableBody>
            </Table>
      );
   }
}

function CustomerListEntry(props) {
   return (
         <TableRow>
            <TableRowColumn>{props.customer.name}</TableRowColumn>
            <TableRowColumn>{props.customer.customerId}</TableRowColumn>
            <TableRowColumn>{props.customer.numPurchases}</TableRowColumn>
            {/* <TableRowColumn><FlatButton label="Details"/></TableRowColumn> */}
            <TableRowColumn><a href={'/kundendetails/' + props.customer.customerId}>Details</a></TableRowColumn>
         </TableRow>
   );
}

class CustomerDetail extends React.Component {
   componentDidMount() {
      fetch('http://localhost:9090/backend/customers/search/findByCustomerId?customerId=' + this.props.customer.customerId).then(results => {
         return results.json();
      }).then(data => {
         console.log(data._embedded.customers);
         this.setState({customers: data._embedded.customers});
      });
   }

}

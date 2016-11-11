const React = require('react')
const medwiseApi = 'https://matrix-api-staging.medwiseadvisor.com'
const bundle = require('./create-bundle')
const { take, filter, toLower, append, path, lensPath,
  head, set, compose } = require('ramda')
let terms = null

const App = React.createClass({
  getInitialState() {
    return {
      token: '',
      query: '',
      terms: [],
      patient: {
        medications: [{
          rxcui: '993688',
          name: 'wellbutrin 100 mg oral tablet'
        },{
          rxcui: '197591',
          name: 'diazepam 5 mg oral tablet'
        },{
          rxcui: '891878',
          name: 'Morphine Sulfate 15 MG Oral Tablet'
        }, {
          rxcui: '1111343',
          name: 'olopatadine 2 MG/ML Ophthalmic Solution'
        }],
        allergies: []
      },
      matrix: ''
    }
  },
  getToken () {

  },
  handleChange (e) {
    this.setState({query: e.target.value})
  },
  submitForm (e) {
    e.preventDefault()
    fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${this.state.query}`)
       .then(res => res.json())
       .then(data => {
         const terms = append({
           name: path(['idGroup', 'name'], data),
           rxcui: head(path(['idGroup', 'rxnormId'], data))
         }, path(['terms'], this.state))
         this.setState({ terms })
      })
  },
  addMed(term) {
    return e => {
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${term}`)
         .then(res => res.json())
         .then(data => {
             const meds = append({
               name: path(['idGroup', 'name'], data),
               rxcui: head(path(['idGroup', 'rxnormId'], data))
             }, path(['state', 'patient', 'medications'], this))

           this.setState(
             compose(
               set(lensPath(['query']), ''),
               set(lensPath(['terms']), []),
               set(lensPath(['patient', 'medications']), meds)
             )(this.state)
           )
        })
    }
  },
  addAlr(term) {
    return e => {
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${term}`)
         .then(res => res.json())
         .then(data => {
           const alrs = append({
             name: path(['idGroup', 'name'], data),
             rxcui: head(path(['idGroup', 'rxnormId'], data))
           }, path(['state', 'patient', 'allergies'], this))

           this.setState(
           compose(
             set(lensPath(['query']), ''),
             set(lensPath(['terms']), []),
             set(lensPath(['patient', 'allergies']), alrs)
           )(this.state)
           )
         })
    }

  },
  clearPatient () {
    this.setState(
      set(lensPath(['patient']), {
        medications: [],
        allergies: []
      }, this.state)
    )
  },
  generateMatrix () {
  
  },
  render () {
    const listMed = med => <li key={med.rxcui}>{med.rxcui} -  {med.name}</li>
    const listAlr = alr => <li key={alr.rxcui}>{alr.name}</li>

    return (
      <div className="pa4">
        <form onSubmit={this.submitForm}>
          <input className="w-80 pa3 br2" placeholder="Type Medication Strength Route and Form"
            onChange={this.handleChange}
            value={this.state.query} />
        </form>
        <ul>
          {
            this.state.terms.map(t =>
              <li key={t.rxcui}>
                <button onClick={this.addMed(t.name)}>Add Medication</button>
                <button onClick={this.addAlr(t.name)}>Add Allergy</button>
                - {t.name}
              </li>
            )
          }
        </ul>
        <hr />
        <h2>Virtual Patient</h2>
        <button onClick={this.clearPatient}>Clear Patient</button>
        <button onClick={this.getToken}>Get Token</button>
        <button onClick={this.generateMatrix} disabled={this.state.token === ''}>Generate Matrix</button>
        <h3>Medications</h3>
        <ul>{this.state.patient.medications.map(listMed)}</ul>
        <h3>Allergies</h3>
        <ul>{this.state.patient.allergies.map(listAlr)}</ul>
        <h3>Matrix</h3>
        <iframe className="w-100" height="700px" src={this.state.matrix}>
        </iframe>
      </div>
    )
  }
})
module.exports = App

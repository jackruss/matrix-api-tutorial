// create a FHIR JSON Bundle.
const { concat, map } = require('ramda')

const bundle = (patient) => {
  const resources = concat(
    map(m => ({
      "resource": {
        "resourceType": "medicationStatement",
        "identifier": [
          {
            "label": "EMRNAME",
            "value": "2256780310605791382"
          }
        ],
        "medication": {
          "name": m.name,
          "code": {
            "coding": [
              {
                "code": m.rxcui,
                "system": "urn:oid:2.16.840.1.113883.6.88",
                "display": m.name,
                "primary": true
              }
            ],
            "text": "RxNorm"
          },
          "isBrand": false,
          "kind": "product"
        }
      }
    }), patient.medications),
    map(a => ({
      "resource": {
        "resourceType": "AllergyIntolerance",
        "identifier": [
          {
            "label": "RXCUI",
            "value": a.rxcui
          }
        ],
        "id": "medication",
        "substance": {
          "coding": [
            {
              "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
              "code": a.rxcui,
              "display": a.name
            }
          ]
        },
        "status": "unconfirmed",
        "criticality": "CRITU",
        "category": "medication",
        "recordedDate": "2010-03-01"
      }
    }), patient.allergies)
  )
  return {
    "resourceType": "Bundle",
    "type": "collection",
    "entry": [...resources]
  }
}

module.exports = bundle

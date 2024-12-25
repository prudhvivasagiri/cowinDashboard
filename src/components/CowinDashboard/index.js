import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.progress,
    vaccinationData: [],
    vaccinationAgeList: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const updatedVaccinationData = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const updatedVaccinationAge = data.vaccination_by_age.map(each => ({
        age: each.age,
        count: each.count,
      }))
      const updatedVaccinationGender = data.vaccination_by_gender.map(each => ({
        count: each.count,
        gender: each.gender,
      }))
      this.setState({
        vaccinationData: updatedVaccinationData,
        vaccinationAgeList: updatedVaccinationAge,
        vaccinationByGender: updatedVaccinationGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProgressView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderSuccesView = () => {
    const {vaccinationData, vaccinationAgeList, vaccinationByGender} =
      this.state
    return (
      <div>
        <VaccinationCoverage data={vaccinationData} />
        <VaccinationByGender genderData={vaccinationByGender} />
        <VaccinationByAge ageData={vaccinationAgeList} />
      </div>
    )
  }

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccesView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.progress:
        return this.renderProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="nav-logo"
          />
          <h1 className="nav-name">Co-WIN</h1>
        </nav>
        <div className="charts-container">
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard

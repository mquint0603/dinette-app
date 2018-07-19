import React, {Component} from "react";
import API from "../../utils/API";
import NavBar from "../../components/NavBar";
import Wrapper from "../../components/Wrapper";
import Modal from "../../components/Modal"
import "./Roulette.css";

class Roulette extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roulettePick: {result:{
                            name: "name",
                            address_components: "address"}},
            value: "",
            modalArray: ["photo", "name", "address", [1,2], "phone", "rating", [1,2]],
            visibility: "hiddenRoulette"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    search = () => {
        API.searchRestaurants()
        .then(res => {
            // this.setState({results: res.data})
            this.randomPick(res.data)
        })  
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        API.getRestaurants(this.state.value)
            .then(res => {
                if(res.status !== 200) {
                    throw new Error(res.statusText)
                }
                if (res.data !== "No Results Found"){
                    this.setState({...this.state,results: res.data})
                } else {
                    console.log("no results found")
                    this.setState({...this.state,results: ["No Results Found"]})
                }
                // this.setState({visibility: "", results: res.data})
                this.randomPick(res.data)
            })
            
    }

    randomPick = (data) => {
        let pick = data[Math.floor(Math.random()*data.length)]
        this.setState({roulettePick: pick, visibility: ""})
        console.log(pick)
    }

    populateModal(photoRef, name, location, hours, phone, rating, review){
        let photo = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference="+ photoRef + "&key=AIzaSyA4KGHuQl-PcJZUjZoeY_KDEuDLYf43BWI"
        let reviewsArray = []
        review.forEach(revObj => {
            let individualReview = []
            individualReview.push(revObj.author_name, revObj.author_url, revObj.rating, revObj.relative_time_description, revObj.text)
            reviewsArray.push(individualReview)
        })
        let modalInfo = [photo, name, location, hours, phone, rating, reviewsArray];
        console.log(modalInfo)
        this.setState({modalArray: modalInfo})
    }

    render () {

        let roulettePick = this.state.roulettePick
        // let displayResults = rouletteResults.result
        console.log(this.state.modalArray)

        return(
            <Wrapper>
                <NavBar />
                <br/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <form onSubmit={this.handleSubmit}>
                                <div className="search_box green row">
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="searchLocation" value={this.state.value} onChange={this.handleChange} placeholder="Search by ZIP or landmark"></input>
                                    </div>
                                    <div className="col-sm-3">
                                        <button className="btn btn-lg save text-white yellow" id="searchLocation" onClick={this.searchLocation}>Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br/>
                    <div className={"row " + this.state.visibility}>
                        <div className="col-md-12 pick-card orange">
                                <h2 className="text-white text-center">Your Pick</h2>
                                <br/>
                                <div className="result-block">
                                    <div className="form-check">
                                        <label className="form-check-label" htmlFor="defaultCheck">
                                        <h5 href="#searchModal" data-toggle="modal" data-target="#detailsModal" onClick={() => this.populateModal(roulettePick.result.photos[0].photo_reference, roulettePick.result.name, roulettePick.result.address_components[0].short_name + " " + roulettePick.result.address_components[1].short_name + " " + roulettePick.result.address_components[3].short_name, roulettePick.result.opening_hours.weekday_text, roulettePick.result.formatted_phone_number, roulettePick.result.rating, roulettePick.result.reviews)}>{roulettePick.result.name}</h5>
                                            <p className="address">{roulettePick.result.address_components[0].short_name + " " + roulettePick.result.address_components[1].short_name + " " + roulettePick.result.address_components[3].short_name}</p>
                                        </label> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <Modal
                    key = {this.state.restName}
                    photo = {this.state.modalArray[0]}
                    restName = {this.state.modalArray[1]}
                    address = {this.state.modalArray[2]}
                    hours = {this.state.modalArray[3]}
                    phone = {this.state.modalArray[4]}
                    rating = {this.state.modalArray[5]}
                    reviews = {this.state.modalArray[6]}
                />
            </Wrapper>
        )
    }
}

export default Roulette;
import React, { Component } from "react";
import "./Search.css"
import API from "../../utils/API"
import Wrapper from "../../components/Wrapper"
import Modal from "../../components/Modal"

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rouletteResults: [],
            roulettePick: {result:{
                name: "name",
                address_components: "address"}},
            results: [],
            value: "",
            modalArray: [[1,2], "name", "address", [1,2], "phone", "rating", [1,2]],
            visibility: "hidden",
            rouletteVisable: "hidden",
            loading: "hidden",
            votingArray: [],
            savedArray: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRoulette = this.handleRoulette.bind(this);
    }

    

    handleChange(event){
        this.setState({value: event.target.value})
        // console.log(this.state.value)
    }

    controlSpinner(){

    }
    
    handleSubmit(event){
        // console.log("Data was submitted: ", this.state.value);
        this.setState({loading: "visible", visibility:"hidden", rouletteVisable:"hidden"})
        event.preventDefault();
        API.getRestaurants(this.state.value)
            .then(res => {
                // console.log(res.statusText)
                if(res.status !== 200) {
                    throw new Error(res.statusText)
                }
                // console.log(res)
                if (res.data !== "No Results Found"){
                    this.setState({...this.state,results: res.data})
                } else {
                    console.log("no results found")
                    this.setState({...this.state,results: ["No Results Found"]})
                }
                this.setState({visibility: "", loading: "hidden"})

            })
    }

    handleRoulette(event){
        // console.log("Data was submitted: ", this.state.value);
        this.setState({loading: "visible", visibility:"hidden", rouletteVisable:"hidden"})
        event.preventDefault();
        API.getRestaurants(this.state.value)
            .then(res => {
                // console.log(res.statusText)
                if(res.status !== 200) {
                    throw new Error(res.statusText)
                }
                // console.log(res)
                if (res.data !== "No Results Found"){
                    this.setState({...this.state,r: res.data})
                } else {
                    console.log("no results found")
                    this.setState({...this.state,results: ["No Results Found"]})
                }
                this.randomPick(res.data)

            })
    }

    randomPick = (data) => {
        console.log("roulette picked")
        let pick = data[Math.floor(Math.random()*data.length)]
        this.setState({roulettePick: pick, rouletteVisable: "", loading: "hidden"})
        console.log(pick)
    }

    createFireBaseVoteSession(){
        let restaurantsArray = sessionStorage.getItem("restaurants")
        console.log(restaurantsArray, ' is restaurantsArray')
        let voteObject = {
            // username: this.props.user.local.userName,
            username: "dummy owner",
            restaurantsArr: restaurantsArray
        }
            
        // API.makeVoteSession(sessionStorage.getItem("restaurants"))
        API.makeVoteSession(voteObject)
    }

    

    populateModal(photos, name, location, hours, phone, rating, review){
        let photosArray = []
        if(!photos){
            photosArray = [1]
        } else {
            photos.forEach(photo => {
                let url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference="+ photo.photo_reference + "&key=AIzaSyA4KGHuQl-PcJZUjZoeY_KDEuDLYf43BWI"
                photosArray.push(url)
            })
        }
        // let photo = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference="+ photoRef + "&key=AIzaSyA4KGHuQl-PcJZUjZoeY_KDEuDLYf43BWI"
        let reviewsArray = []
        review.forEach(revObj => {
            let individualReview = []
            individualReview.push(revObj.author_name, revObj.author_url, revObj.rating, revObj.relative_time_description, revObj.text)
            reviewsArray.push(individualReview)
        })
        let modalInfo = [photosArray, name, location, hours, phone, rating, reviewsArray];
        // console.log(modalInfo)
        this.setState({modalArray: modalInfo})
        console.log(this.state.modalArray[0[0]])
    }
    


    addToSessionStorage = (value) => {
        console.log("What we are adding to Session Storage: ", value, " (should be a JSON object, currently, it is: ", typeof value,")")
        sessionStorage.setItem("voted", []) 
        let savedArray = []
        let storage = JSON.parse(sessionStorage.getItem("restaurants"))

        //if there's something in session storage but it's not an array
        if (sessionStorage.getItem("restaurants") && !Array.isArray(storage)){
            savedArray.push(storage, value)
            sessionStorage.setItem("restaurants", JSON.stringify(savedArray))
        //if there's something in session storage and it is an array
        } else if (sessionStorage.getItem("restaurants") && Array.isArray(storage) && storage.length <= 5) {
            savedArray = storage
            //if value is not already in saved, pushes it
            if (savedArray.includes(value) === false){
                savedArray.push(value)
            //if value was already in saved and is now unchecked, delete from saved
            } else {
                let index = savedArray.indexOf(value)
                savedArray.splice(index, 1)
            }
            sessionStorage.setItem("restaurants", JSON.stringify(savedArray))
        //if there's nothing in session storage yet
        } else if (!sessionStorage.getItem("restaurants")){
            sessionStorage.setItem("restaurants", JSON.stringify(value))
        }   
        console.log(sessionStorage)
        this.loadSessionStorage()
    }

    loadSessionStorage = () => {
        let stringToVote = sessionStorage.getItem("restaurants")
        let noStateVotingArray = JSON.parse(stringToVote)
        this.setState({ votingArray: noStateVotingArray })
    }

    render () {
        let roulettePick = this.state.roulettePick
        let results;
        let displayRoulette
        if (this.state.results[0] === "No Results Found" ){
            console.log(this.state.results,"************************")
            results = (
                this.state.results.map(result => (
                    <h3 className="text-center text-white">{result}</h3>
                ))
            )
            displayRoulette = (
                <h5 className="text-center">No Results Found</h5>
            )
        } else {
            results = (
                this.state.results.map(restaurant => (
                    <div key = {restaurant.result.name} className="result-block">
                        <div className="form-check">
                            <label className="form-check-label">
                                <h5 className="restName" href="#searchModal" data-toggle="modal" data-target="#detailsModal" onClick={() => this.populateModal(restaurant.result.photos, restaurant.result.name, restaurant.result.address_components[0].short_name + " " + restaurant.result.address_components[1].short_name + " " + restaurant.result.address_components[3].short_name, restaurant.result.opening_hours.weekday_text, restaurant.result.formatted_phone_number, restaurant.result.rating, restaurant.result.reviews)}>
                                {restaurant.result.name}
                                </h5>
                                <p className="details">details</p>
                                <p className="address">{restaurant.result.address_components[0].short_name + " " + restaurant.result.address_components[1].short_name + " " + restaurant.result.address_components[3].short_name}</p>
                            </label>
                            <input className="form-check-input" data-state="unchecked" type="checkbox" onClick= {() => this.addToSessionStorage(restaurant.result)} value={restaurant.result.name} id="defaultCheck"></input>
                        </div>
                    </div>
                ))
            )

            displayRoulette = (
                <div>
                    <h5 href="#searchModal" data-toggle="modal" data-target="#detailsModal" onClick={() => this.populateModal(roulettePick.result.photos, roulettePick.result.name, roulettePick.result.address_components[0].short_name + " " + roulettePick.result.address_components[1].short_name + " " + roulettePick.result.address_components[3].short_name, roulettePick.result.opening_hours.weekday_text, roulettePick.result.formatted_phone_number, roulettePick.result.rating, roulettePick.result.reviews)}>{roulettePick.result.name}</h5>
                    <p className="details">details</p>
                    <p className="address">{roulettePick.result.address_components[0].short_name + " " + roulettePick.result.address_components[1].short_name + " " + roulettePick.result.address_components[3].short_name}</p>
                </div>
            )
        }
        return(
        <Wrapper>
            <br/>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <form onSubmit={this.handleSubmit}>
                            <div className="search_box green row">
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="searchLocation" value={this.state.value} onChange={this.handleChange} placeholder="Search by ZIP or landmark"></input>
                                </div>
                                <div className="col-sm-2 search-col">
                                    <button className="btn btn-lg text-white yellow"  id="search" onClick={this.handleSubmit}>Search</button>
                                    
                                </div>
                                <div className="col-sm-2 roulette-col">
                                    <button className="btn btn-lg text-white orange" id="roulette" onClick={this.handleRoulette}>Roulette</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <br/>
                {/* <iframe src="https://giphy.com/embed/3o7bu3XilJ5BOiSGic" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/youtube-loading-gif-3o7bu3XilJ5BOiSGic">via GIPHY</a></p> */}
                <div className="row justify-content-center spinner-div">
                    <img className={this.state.loading} src="../../spinner.svg" alt=""/>
                </div>

                <div className={"row " + this.state.visibility}>

                    <div className="col-md-12 orange" id="search-results-card">
                        <h3 className="text-white text-center">Search Results</h3>
                        <br/>                               
                        {results}
                    </div>
                </div>
                <div className={"row " + this.state.rouletteVisable}>
                    <div className="col-md-12 pick-card orange">
                            <h2 className="text-white text-center">Your Pick</h2>
                            <br/>
                            <div className="result-block">
                                <div className="form-check">
                                    <label className="form-check-label" htmlFor="defaultCheck">
                                    {displayRoulette}
                                    </label> 
                                </div>
                            </div>
                        </div>
                    </div>
                <br/>
                <div className="row orange">
                {this.state.votingArray.length >= 1 && this.state.votingArray.length < 6 ? (
                        this.state.votingArray.map(restaurant => (
                            <div className="col-md-12">
                            <div key={restaurant.id} className="result-block">
                            {restaurant.name}
                            </div>
                            </div>
                            
                        ))
                    ) : (
                            <div>
                            </div>
                        )}
</div>
                    {this.state.votingArray.length > 1 && this.state.votingArray.length < 6  ? (
                        <div className="row">
                            <div className="col-sm-12 justify-content-center">
                                <div className="btn btn-lg yellow text-white">
                                    <a href="/ballot">
                                        <button  id="saveRestaurants" onClick={this.createFireBaseVoteSession}>Add to Group Vote</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                            <div className="row">
                            </div>
                        )}
                        
            </div>
            
            <Modal
                key = {this.state.modalArray[1]}
                photos = {this.state.modalArray[0]}
                firstPhoto = {this.state.modalArray[0][0]}
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

export default Search;
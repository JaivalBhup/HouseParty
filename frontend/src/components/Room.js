import React, { Component } from 'react'
import {Grid, Button, Typography} from '@material-ui/core'
import CreateRoom from "./CreateRoom"
import MusicPlayer from './MusicPlayer'
export class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            votes: 2,
            guestCanPause: false,
            isHost: false,
            showSetting:false,
            spotifyAuthentication: false,
            song: {}
        }
        this.leaveRoom = this.leaveRoom.bind(this)
        this.getRoom = this.getRoom.bind(this)
        this.updateShowSettings = this.updateShowSettings.bind(this)
        this.settingsView = this.settingsView.bind(this)
        this.authenticateSpotify = this.authenticateSpotify.bind(this)
        this.getCurrentSong = this.getCurrentSong.bind(this)
        this.roomCode = this.props.match.params.roomCode
        this.getRoom()
        this.getCurrentSong()
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000)

    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    getCurrentSong(){
        fetch('/spotify/current-song')
            .then((response)=>{
                if(!response.ok){
                    return {}
                }
                else{
                    return response.json()
                }
            })
            .then((data)=>{
                this.setState({song:data})        
                console.log(data)
            }
        )
    }
    authenticateSpotify(){
        fetch('/spotify/is-authenticated')
            .then((response)=>response.json())
            .then((data)=>{
                this.setState({
                    spotifyAuthentication: data.status
                })
                if(!data.status){
                    fetch('/spotify/get-auth-url')
                        .then((response)=>response.json())
                        .then((data)=>{
                            window.location.replace(data.url)
                        })
                }
            })
    }
    updateShowSettings(value){
        this.setState({
            showSetting: value
        })
    }
    getRoom(){
        fetch('/api/get-room?code='+this.roomCode)
            .then((response)=>{
                if(!response.ok){
                    this.props.leaveRoomCallBack();
                    this.props.history.push('/')
                }
                return response.json()
            })
            .then((data)=>{
                this.setState({
                    votes: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                }
                )
                if(this.state.isHost){
                    console.log("Authentication checked")
                    this.authenticateSpotify()
                }
            })
    }
    leaveRoom(){
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }
        fetch('/api/leave-room',requestOption)
            .then((response)=>{
                if(response.ok){
                    this.props.leaveRoomCallBack()
                    this.props.history.push('/')
                }
            })
    }
    settingsView(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <CreateRoom 
                        update = {true} 
                        votes={this.state.votes} 
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallBack = {this.getRoom}
                    />
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant = "contained" color = "secondary" onClick = {()=>this.updateShowSettings(false)}>
                        Close
                    </Button> 
                </Grid>
            </Grid>
        )
    }
    render() {
        if(this.state.showSetting){
            return this.settingsView()
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs = {12} align = 'center'>
                    <Typography variant="h6" component="h6">
                    Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.isHost ? (<Grid item xs = {12} align = "center">
                                        <Button variant = "contained" color = "primary" onClick = {()=>this.updateShowSettings(true)}>
                                            Settings
                                        </Button>
                                    </Grid>):null
                                    }
                <Grid item xs = {12} align = 'center'>
                    <Button variant="contained" color="secondary" onClick={this.leaveRoom}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default Room

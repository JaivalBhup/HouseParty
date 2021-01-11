import React, { useState } from 'react'
import {TextField, Button, Grid, Typography} from "@material-ui/core"
import {Link} from 'react-router-dom'

class JoinRoom extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            roomCode: "",
            error: ""
        }
        this.roomCodeChanged = this.roomCodeChanged.bind(this)
        this.enterRoomPressed = this.enterRoomPressed.bind(this)
    }
    roomCodeChanged(e){
        this.setState({
            roomCode: e.target.value
        })
    }
    enterRoomPressed(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                code: this.state.roomCode
            })
        }
        fetch('/api/join-room', requestOptions)
            .then((response)=>{
                if(response.ok){
                    this.props.history.push(`/room/${this.state.roomCode}`)
                }
                else{
                    this.setState({
                        roomCode: "",
                        error: "Room Not Found"})
                }
            })
            .catch((e)=>{
                console.log(e)
            })
    }
    render(){     
        return (
        <Grid spacing = {1} container>
            <Grid item xs = {12} align="center">
                    <Typography variant = "h4" component = "h4">
                        Join A Room
                    </Typography>
            </Grid>
            <Grid item xs = {12} align="center"> 
                    <TextField
                        error = {this.state.error}
                        label = "Code"
                        placeholder = "Enter Room Code"
                        value = {this.state.roomCode}
                        helperText  = {this.state.error}
                        variant = "outlined"
                        onChange = {this.roomCodeChanged}
                    />
            </Grid>
            <Grid item xs = {12} align="center">
                <Button variant = "contained" color = "primary" onClick = {this.enterRoomPressed}>Enter</Button>
            </Grid>
            <Grid item xs = {12} align="center">
                    <Button variant = "contained" color = "secondary" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
        )
    }
}

export default JoinRoom

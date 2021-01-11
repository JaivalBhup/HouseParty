import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import JoinRoom from "./JoinRoom"
import CreateRoom from "./CreateRoom"
import Room from "./Room"
import {Grid, Button, ButtonGroup, Typography} from '@material-ui/core'
import info from './info'
function homePage(){
    return(
        <Grid container spacing = {3}>
            <Grid item xs = {12} align = 'right' >
                <Button color="default" to="/info" component = {Link}>
                    ?
                </Button>
            </Grid>
            <Grid item xs = {12} align = 'center'>
                <Typography variant = "h3" compact="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid item xs = {12} align = 'center'>
                <ButtonGroup disableElevation variant="contained" color='primary'>
                    <Button color ="primary" to="/join" component={Link}>
                        Join A Room
                    </Button>
                    <Button color ="secondary" to="/create" component={Link}>
                        Create A Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}

function HomePage() {
    const [roomCode, setRoomCode] = useState(null)
    useEffect(async()=>{
        async function fetchCode(){
            await fetch('/api/user-in-room')
                .then((response)=>response.json())
                .then((data)=>{
                    setRoomCode(data.code)
                    console.log(data.code)
                })
        }
        fetchCode()
    })
    function clearRoom(){
        setRoomCode(null)
    }
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={()=>{
                    return !roomCode? (homePage()):(<Redirect to ={`/room/${roomCode}`}/>)
                }}/>
                <Route path="/info" component={info}/>
                <Route path="/join" component={JoinRoom}/>
                <Route path="/create" component={CreateRoom}/>
                <Route path="/room/:roomCode" render={
                    (props)=>{
                        return <Room {...props}  
                                leaveRoomCallBack = {clearRoom}
                            />
                        }
                }/>
            </Switch>
        </Router>
    )
}

export default HomePage

import React, { useState } from 'react'
import {Grid, Typography, Card, IconButton, LinearProgress} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import PauseIcon from '@material-ui/icons/Pause'
import {Collapse} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

function MusicPlayer(props) {
    const [subError, setSubError] = useState("")
    const [song, setSong] = useState(props)

    const songProgress = (props.time/props.duration)*100
    function pauseSong(){
        const requestOptions = {
            method:"PUT",
            headers: {"Content-Type": "application/json"}
        }
        fetch('/spotify/pause', requestOptions)
            .then((response)=>{
                return response.json()
            })
            .then((data)=>{
                if(data.hasOwnProperty('error')){
                    setSubError(data.error)
                }
            })
    }
    function skipSong(){
        const requestOptions = {
            method : 'POST',
            headers : {'Content-Type':'application/json'}
        }
        fetch('/spotify/skip', requestOptions)
            .then((response)=>{
                return response.json()
            })
            .then((data)=>{
                if(data.hasOwnProperty('error')){
                    setSubError(data.error)
                }
            })
    }
    function playSong(){
        const requestOptions = {
            method:"PUT",
            headers: {"Content-Type": "application/json"}
        }
        fetch('/spotify/play', requestOptions)
            .then((response)=>{
                return response.json()
            })
            .then((data)=>{
                if(data.hasOwnProperty('error')){
                    setSubError(data.error)
                }
            })
    }
    return (
        <Card>
           <Grid container alignItems = 'center'>
           <Grid item xs={12} align="center">
                <Collapse in={subError != ""}>
                    {(<Alert severity = "error" onClose={()=>{setSubError("")}}>{subError}</Alert>)}
                </Collapse>
                </Grid>
                <Grid item align='center' xs={4}>
                    <img src={props.img_url} height ='100%' width = "100%"/>
                </Grid>
                <Grid item align='center' xs={8}>
                    <Typography component="h5" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography component="h5" variant="subtitle1" color="textSecondary" >
                        {props.artist}
                    </Typography>
                    <div>
                        <IconButton onClick={()=>{props.is_playing ? pauseSong():playSong() }}>
                            {props.is_playing ? <PauseIcon/>: <PlayArrowIcon/>}
                        </IconButton>
                        <IconButton onClick={()=>skipSong()}><SkipNextIcon/>{props.votes} /{" "}{props.votes_needed}</IconButton>
                    </div>
                </Grid>
            </Grid> 
            <LinearProgress variant="determinate" value={songProgress}/>
        </Card>
    )
}

export default MusicPlayer

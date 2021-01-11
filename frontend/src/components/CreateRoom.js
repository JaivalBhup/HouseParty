import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Link} from "react-router-dom"  
import {Collapse} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'


class CreateRoom extends React.Component {
    static defaultProps = {
        guestCanPause : true,
        votes : 2,
        update: false,
        roomCode: null,
        updateCallBack:()=>{}
    }
    constructor(props){
        super(props)
        this.state = {
            guestCanPause : this.props.guestCanPause,
            votes : this.props.votes,
            succMsg: "",
            errMsg: ""
        }
        this.createRoom = this.createRoom.bind(this) 
        this.updateRoom = this.updateRoom.bind(this)
        this.toggleGuestCanPause = this.toggleGuestCanPause.bind(this)
        this.changeVotes = this.changeVotes.bind(this)
    }
    changeVotes(e){
        this.setState({
            votes:  e.target.value
        })
    }
    toggleGuestCanPause(e){
        this.setState({
            guestCanPause: e.target.value==='true'?true:false
        })
    }
    createRoom(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votes,
                guest_can_pause: this.state.guestCanPause
            })
        }
        fetch('/api/create-room', requestOptions)
            .then((response)=>response.json())
            .then((data)=> this.props.history.push('/room/'+data.code))
    }
    updateRoom(){
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votes,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode
            })
        }
        fetch('/api/update-room', requestOptions)
            .then((response)=>{
                if(response.ok){
                    this.setState({
                        succMsg:"Room Updated Successfully"
                    })
                }else{
                    this.setState({
                        errMsg:"Error Updating the room"
                    })
                }
                this.props.updateCallBack();
            })
       
    }
    renderButtons(){
        if(this.props.update){
            return (
                <>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick = {this.updateRoom}>
                        Update
                    </Button>
                </Grid>
                </>
            )
        }
        return (
            <>
            <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick = {this.createRoom}>
                        Create
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </>
        )
    }
    render(){
        const title = this.props.update ? "Update Room" : "Create Room"
        return (
            
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errMsg!=""||this.state.succMsg!=""}>
                        {this.state.succMsg!=""?
                            (<Alert severity="success" onClose={()=>{this.setState({succMsg:"",errMsg:""})}}>{this.state.succMsg}</Alert>):
                            (<Alert severity = "error" onClose={()=>{this.setState({succMsg:"",errMsg:""})}}>{this.state.errMsg}</Alert>)}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title} 
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Can Control The Playback
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue = {this.props.guestCanPause.toString()} onChange={this.toggleGuestCanPause} >
                            <FormControlLabel 
                                value = 'true' 
                                control={<Radio color="primary"/>}
                                label = 'Play/Pause'
                                labelPlacement="bottom"/>
                            <FormControlLabel 
                                value = 'false' 
                                control={<Radio color="secondary"/>}
                                label = 'No Control'
                                labelPlacement="bottom"/>

                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                        required="true"
                        type = "Number"
                        defaultValue = {this.state.votes}
                        inputProps={{
                            min: 1,
                            style:{textAlign:"center"}
                        }}
                        onChange = {this.changeVotes}
                        />
                        <FormHelperText>
                            <div align="center">Minimum Votes to skip a song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.renderButtons()}
            </Grid>
        )
    }
}

export default CreateRoom

import React, {useEffect, useState} from 'react'
import {Grid, Button, Typography, IconButton} from '@material-ui/core'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import {Link} from 'react-router-dom'

function info(props) {
    return (
        <Grid container spacing={1}>
            <Grid item xs = {12} align = 'right' >
                <Button color="default" to="/" component = {Link}>
                    Home
                </Button>
            </Grid>
            <Grid item xs={12} align='center'>
                <Typography variant = 'h4' component='h4'>
                    What is House Party?
                </Typography>
            </Grid>
        </Grid>
    )
}

export default info

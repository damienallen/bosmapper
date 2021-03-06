import React from 'react'
import { createUseStyles } from 'react-jss'
import focusIcon from '../assets/focus.svg'

const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    focus: {
        zIndex: 500
    }
})

export const Crosshair: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <img src={focusIcon} className={classes.focus} alt="+" />
        </div>
    )
}


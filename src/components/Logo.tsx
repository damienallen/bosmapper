import React from 'react'
import { createUseStyles } from 'react-jss'


const useStyles = createUseStyles({
    container: {
        width: '100%',
        padding: '22px 0',
        background: '#ddd',
        color: '#333',
        textAlign: 'center',
        fontSize: '1.4em'
    }
})

export const Logo: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <b>bos</b>mapper
        </div>
    )
}

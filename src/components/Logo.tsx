import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%',
        padding: '22px 0',
        background: (props: StyleProps) => props.background,
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.4em',
        opacity: 0.8
    }
})

interface StyleProps {
    background: 'string',
}

export const Logo: React.FC = observer(() => {
    const { settings } = useStores()

    const backgroundColor = settings.authenticated ? '#FFA63A' : '#78a658'
    const styleProps = {
        background: backgroundColor,
    }
    const classes = useStyles(styleProps)

    return (
        <div className={classes.container}>
            <b>bos</b>mapper
        </div>
    )
})

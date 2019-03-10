
import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Grid, CardHeader, Avatar } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core';

export default class Login extends React.Component<{authBackendNames: Array<string>}> {

    render() {

        return (
            <Grid container justify="center" alignItems="center" spacing={0} direction="column" style={{ minHeight: '100vh' }}>
                <Card>
                    <CardHeader
                        title="Login to Pabu"
                        titleTypographyProps={{variant: 'h5'}}
                        subheader="Choose a provider"
                        avatar={<Avatar src="/static/images/pabu-head.png"/>}
                    />
                    <CardContent>
                        <List component="nav">
                            {this.props.authBackendNames.map(name => {
                                    return <ListItem button key={name} component="a" href={`/auth/${name}/login`}>
                                                <ListItemIcon>
                                                    <FontAwesomeIcon icon={{prefix: 'fab', iconName: name as IconName}}/>
                                                </ListItemIcon>
                                                <ListItemText primary={name} className="auth-list-text" />
                                            </ListItem>
                                }
                            )}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

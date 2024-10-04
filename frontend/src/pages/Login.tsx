import React, { useState, useContext } from 'react';
import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            await login(username, password);
            setError(null);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Grid centered>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Segment>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button color="blue" fluid size="large">
                            Login
                        </Button>
                    </Form>
                </Segment>
                {error && <Message negative>{error}</Message>}
            </Grid.Column>
        </Grid>
    );
};

export default Login;

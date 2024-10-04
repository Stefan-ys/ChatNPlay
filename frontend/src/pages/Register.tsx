import React, { useState } from 'react';
import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            await register(username, email, password, confirmPassword);
            setError(null);
        } catch (err) {
            setError('Registration failed. Please check your details.');
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
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button color="green" fluid size="large">
                            Register
                        </Button>
                    </Form>
                </Segment>
                {error && <Message negative>{error}</Message>}
            </Grid.Column>
        </Grid>
    );
};

export default Register;

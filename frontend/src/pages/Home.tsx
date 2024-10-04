import React from 'react';
import { Container, Header, Button, Icon, Segment, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <Container textAlign="center" style={{ padding: '50px 0' }}>
            <Segment padded="very" textAlign="center">
                <Header as="h1" icon>
                    <Icon name="graduation cap" circular />
                    <Header.Content>Welcome to Quizzard</Header.Content>
                </Header>
                <p style={{ fontSize: '1.2em' }}>
                    Quizzard is the ultimate platform for quizzes and knowledge sharing. Compete with others, track your progress, and expand your knowledge!
                </p>
                <Image centered size="medium" src="/images/welcome.png" alt="Welcome image" />

                <Segment style={{ marginTop: '30px' }}>
                    <Button as={Link} to="/login" color="blue" size="large">
                        <Icon name="sign-in" />
                        Login
                    </Button>
                    <Button as={Link} to="/register" color="green" size="large">
                        <Icon name="signup" />
                        Register
                    </Button>
                </Segment>
            </Segment>
        </Container>
    );
};

export default Home;

import React, { useState } from 'react';
import { Form, Button, Segment, Message } from 'semantic-ui-react';

interface AuthForm {
  isLogin: boolean;
  onSubmit: (username: string, password: string, email?: string) => void;
}

const AuthForm: React.FC<AuthForm> = ({ isLogin, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (isLogin) {
      onSubmit(username, password);
    } else {
      onSubmit(username, password, email);
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isLogin && (
          <Form.Input
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <Form.Input
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button primary>{isLogin ? 'Login' : 'Register'}</Button>
      </Form>
    </Segment>
  );
};

export default AuthForm;

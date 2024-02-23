import { useState, type ChangeEvent } from 'react';
import './Login.css';

export default function () {
  const [fields, setFields] = useState({
    email: '',
    password: '',
  });

  const onChanged = (field: 'email' | 'password') => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFields({
        ...fields,
        [field]: e.currentTarget.value,
      });
    };
  };

  const onSubmit = () => {
    //if all fields valid -accept
    if (Object.values(fields).some(field => !field)) {
      return;
    }

    //handle details
  };

  return (
    <div className="form-container">
      <form className="login-form" action="" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={fields.email}
          onChange={onChanged('email')}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={fields.password}
          onChange={onChanged('password')}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

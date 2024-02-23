import { useState, type ChangeEvent } from 'react';
import './SignUpCard.css';

export default function () {
  const [fields, setFields] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  });

  const onChanged = (field: 'email' | 'password' | 'repeatPassword') => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFields({
        ...fields,
        [field]: e.currentTarget.value,
      });
    };
  };

  const passwordsMatch =
    !!fields.password && fields.password === fields.repeatPassword;
  const passwordValid = fields.password.match(/\w{8}/);

  const onSubmit = () => {
    //if all fields valid -accept
    if (Object.values(fields).some(field => !field)) {
      return;
    }

    if (!passwordsMatch) {
      return;
    }

    if (!passwordValid) {
      return;
    }

    //handle details
  };

  return (
    <div className="form-container">
      <form className="signup-form" action="" onSubmit={onSubmit}>
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
        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          onChange={onChanged('repeatPassword')}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

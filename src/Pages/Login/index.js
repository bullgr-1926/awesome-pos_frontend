import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../components/HelperFunctions";
import queryString from "query-string";
import "./index.css";

const Login = () => {
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
    errors: {},
  });

  let history = useHistory();

  const onChange = (e) => {
    let keyName = e.target.name;
    let value = e.target.value;
    setLoginUser((previous) => {
      return {
        ...previous,
        [keyName]: value,
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: loginUser.email,
      password: loginUser.password,
    };

    login(queryString.stringify(user)).then((res) => {
      if (res) {
        history.push("/dashboard");
      }
    });
  };

  return (
    <div className="container fadeIn">
      <div className="row">
        <div className="col-md-6 mt-5 mx-auto">
          <form onSubmit={onSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={loginUser.email}
                required
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={loginUser.password}
                required
                onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-lg btn-secondary btn-block"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

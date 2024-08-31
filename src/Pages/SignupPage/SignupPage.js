import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("UserAdmin");
  const [invitationCode, setInvitationCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/signup", { name, email, password, role, invitationCode })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div>
            <label>
              <input
                type="radio"
                name="role"
                value="UserAdmin"
                checked={role === "UserAdmin"}
                onChange={() => setRole("UserAdmin")}
              />
              UserAdmin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="SuperAdmin"
                checked={role === "SuperAdmin"}
                onChange={() => setRole("SuperAdmin")}
              />
              SuperAdmin
            </label>
          </div>
          {role === "SuperAdmin" && (
            <input
              type="text"
              placeholder="Invitation Code"
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          )}
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>
      <div className="btn-container">
        <p>Already have an Account?</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;

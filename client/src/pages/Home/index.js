import React from "react";
import { Link } from "@reach/router";

export default function index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <h1>Home</h1>
    </div>
  );
}

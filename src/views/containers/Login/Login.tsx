import "./Login-style.css";

export const Login = () => {
  return (
    <div className={"login-container"}>
      {/* Left Side */}
      <div className={"leftSide"}>
        <div className={"header"}>Help Desk Ticketing System</div>
        <form>
          <div className={"formGroup"}>
            <input type="email" placeholder="@ Email" required />
          </div>
          <div className={"formGroup"}>
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit">SIGN IN</button>
        </form>
      </div>

      {/* Right Side */}
      <div className={"rightSide"}>
        <div className={"welcome"}>Welcome Back!</div>
        <div className={"message"}>
          To keep connected with us please sign in with your email address and password
        </div>
      </div>
    </div>
  );
};
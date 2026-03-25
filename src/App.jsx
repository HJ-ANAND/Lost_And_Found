import "./App.css";

function App() {
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">CampusPath AI</h1>
        <button className="btn">Get Started</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2>Your Personalized Career Roadmap 🚀</h2>
        <p>
          Connect your GitHub, enter your skills, and let AI generate a
          step-by-step roadmap to land your dream role.
        </p>
      </section>
    </div>
  );
}

export default App;
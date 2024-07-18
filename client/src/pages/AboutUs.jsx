const AboutUs = () => {
  const linkedIn = "https://www.linkedin.com/in/hussainalaradi";
  const gitHub = "https://github.com/HussainALAradi5";
  const email = "hussainaradi.ha@gmail.com";
  return (
    <div className="aboutUs">
      <h1>About Us</h1>
      <p>
        im happy to introduce smooth service and nice UX to my precious customer
        with my book store.
      </p>
      <div className="contactLinks">
        <a href={linkedIn} className="contactLink linkedin">
          LinkedIn
        </a>
        <a href={gitHub} className="contactLink github">
          GitHub
        </a>
        <a href={email} className="contactLink email">
          Email Us
        </a>
      </div>
    </div>
  );
};

export default AboutUs;

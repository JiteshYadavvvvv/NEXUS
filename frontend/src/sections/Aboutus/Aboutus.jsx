import React from 'react'
import about from "../../assets/About/about.png"
import './aboutus.css'

const ContentBlock = ({ title, content, alignment = "left" }) => {
  return (
    <div className="vision-mission-card">
      <div className={`vision-mission-header ${alignment === "right" ? "align-right" : "align-left"}`}>
        <div className="vision-mission-header-wrapper">
          <h3 className="vision-mission-title">{title}</h3>
        </div>
      </div>
      
      <div className="vision-mission-body">
        <p className="vision-mission-description">{content}</p>
      </div>
    </div>
  )
}

const AboutUs = () => {
  return (
    <section id="about" className="aboutus-section" style={{ 
      backgroundImage: `url("/background.svg")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      backgroundSize: 'cover'
    }}>
      <div className="content-wrapper">
        <h1 className="aboutus-title">ABOUT US</h1>

        <div className="main-content">
          <div className="image-container">
            <img src={about} alt="About Us Illustration" className="aboutus-image" />
          </div>

          <div className="text-content">
            <div>
              <h2 className="sync-title">NEXUS</h2>
              <div className="color-lines">
                <div className="color-line-sky" />
                <div className="color-line-blue" />
              </div>
              <p className="sync-description">
                <b>AIT NEXUS </b> is a central hub for all college clubs.
                Our Platform unifies various student organizations under one roof.
                We aim to foster collaboration, streamline event management, and enhance communication among club members and the wider student body.
              </p>
            </div>

            <ContentBlock
              title="VISION"
              content="To create vibrant and connected campus where every student can effortlessly find their community, explore their passions through a centralized, accessible club network."
              alignment="right"
            />

            <ContentBlock
              title="MISSION"
              content="To empower clubs with digital tools for data management and event promotion,while providing students with a seamless,one-stop platform to engage with all college extra-curricular activities."
              alignment="left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs

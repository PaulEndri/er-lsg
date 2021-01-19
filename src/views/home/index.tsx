import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";
import { IS_DESKTOP } from "../../components/isDesktop";
import { PageComponent } from "../../components/page";

const HomeView = () => {
  return (
    <PageComponent title="Eternal Return Lumia Survival Guide">
      <Container textAlign="center">
        <div
          style={{
            display: "flex",
            flexDirection: IS_DESKTOP ? "row" : "column",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Header
            as={Link}
            to="/wiki"
            size="large"
            inverted={true}
            className="fancy-hover"
            style={{
              marginBottom: 0,
              height: "100%",
              backgroundColor: "rgba(51, 51, 51, 0.7)",
              padding: "8% 5% 8% 5%",
              border: "2px inset rgba(255, 255, 255, 0.1)",
              borderRight: IS_DESKTOP ? "3px groove rgba(200, 200, 200, 0.4)" : "",
              borderLeft: IS_DESKTOP ? "" : "3px groove rgba(200, 200, 200, 0.4)",
              textShadow: "0px 1px 4px rgba(255, 255, 255, 0.9)",
              background: "radial-gradient(rgba(51, 51,51,1), rgba(11, 11, 11, 0.5))",
            }}
          >
            <span style={{ paddingLeft: "-2rem" }}>Information</span>
            <br />
            <span style={{ paddingLeft: "3rem" }}>Center</span>
          </Header>
          <Header
            as={Link}
            to="/planner"
            size="large"
            inverted={true}
            className="fancy-hover"
            style={{
              height: "100%",
              backgroundColor: "rgba(51, 51, 51, 0.7)",
              padding: "8% 5% 8% 5%",
              marginTop: IS_DESKTOP ? "-4px" : "4px",
              border: "2px inset rgba(255, 255, 255, 0.1)",
              borderLeft: "3px groove rgba(200, 200, 200, 0.4)",
              textShadow: "0px 1px 4px rgba(255, 255, 255, 0.9)",
              background: "radial-gradient(rgba(51, 51,51,1), rgba(11, 11, 11, 0.5))",
            }}
          >
            <span style={{ paddingRight: "2rem" }}>Survival</span>
            <br />
            <span style={{}}>Planner</span>
          </Header>
          <Header
            as={Link}
            to="/about"
            size="large"
            inverted={true}
            className="fancy-hover"
            style={{
              height: "100%",
              backgroundColor: "rgba(51, 51, 51, 0.7)",
              padding: "8% 5% 8% 5%",
              marginTop: "-4px",
              border: "2px inset rgba(255, 255, 255, 0.1)",
              borderLeft: "3px groove rgba(200, 200, 200, 0.4)",
              textShadow: "0px 1px 4px rgba(255, 255, 255, 0.9)",
              background: "radial-gradient(rgba(51, 51,51,1), rgba(11, 11, 11, 0.5))",
            }}
          >
            <span style={{ paddingRight: "2rem" }}>About</span>
            <br />
            <span style={{}}>the Site</span>
          </Header>
        </div>
        <Segment color="black" inverted={true} style={{ maxWidth: "700px", margin: "auto" }}>
          <Header>Notice</Header>
          <p>
            If you're viewing this on a mobile device, I'm sorry we're still working on mobile. If
            you find some messed up data or images check the <Link to="/about">About</Link> page for
            ways to report it
          </p>
        </Segment>
        <Segment color="black" inverted={true} style={{ maxWidth: "700px", margin: "auto" }}>
          <Header>Official Eternal Return News and Updates</Header>
          <a href="https://steamcommunity.com/app/1049590/allnews/">
            Visit the official Eternal Return steam news page for all updates regarding Eternal
            Return
          </a>
        </Segment>
      </Container>
    </PageComponent>
  );
};

export default HomeView;

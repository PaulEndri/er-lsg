import React from "react";
import { Button, Container, Header, Icon, List, Segment } from "semantic-ui-react";
import { PageComponent } from "../../components/page";

const AboutView = () => {
  return (
    <PageComponent title="Eternal Return Lumia Survival Guide">
      <Container textAlign="center">
        <Segment.Group style={{ marginTop: "2em" }}>
          <Segment color="black" inverted style={{ borderRadius: 0 }}>
            <Header>About the App</Header>
            <p>
              This app is meant to be a free tool for players of Eternal Return: Black Survival to
              treat as one stop shop for all their information and theory crafting needs.
            </p>
          </Segment>
          <Segment color="black" inverted style={{ borderRadius: 0 }}>
            <Segment.Group horizontal style={{ border: 0, background: "transparent" }}>
              <Segment textAlign="center" basic inverted vertical style={{ maxWidth: "250px" }}>
                <Header inverted>Roadmap</Header>
                <p>This app could not have been made without the following tools</p>
                <List
                  inverted
                  items={[
                    <a style={{ display: "block" }} href="https://playeternalreturn.com/">
                      Eternal Return: Black Surival
                    </a>,
                    <a style={{ display: "block" }} href="https://developer.eternalreturn.io/">
                      The Official Eternal Return Api
                    </a>,
                    <a
                      style={{ display: "block" }}
                      href="https://www.npmjs.com/package/erbs-client"
                    >
                      The Eternal Return Node Client
                    </a>,

                    <a style={{ display: "block" }} href="https://app.netlify.com/">
                      Netlify
                    </a>,
                    <a style={{ display: "block" }} href="https://eternalreturn.gamepedia.com/">
                      The official Eternal Return Wiki
                    </a>,
                  ]}
                />
              </Segment>
              <Segment inverted basic compact textAlign="center" style={{ maxWidth: "350px" }}>
                <Header inverted size="large">
                  <Icon size="huge" name="discord" /> Discord Bot
                </Header>
                <p>
                  Want all the information you find here in your discord server? There's a companion
                  discord bot to this application. Click the button below to have the Wickline Bot
                  join your server
                </p>

                <Button
                  as="a"
                  color="purple"
                  href="https://discord.com/oauth2/authorize?client_id=795035609563136027&scope=bot"
                >
                  Click here for Wickeline!
                </Button>
              </Segment>
              <Segment inverted>
                <Header inverted>Roadmap</Header>
                <a href="https://trello.com/b/Ysa0kgGf/erlsg">Official ER:LSG Roadmap</a>
              </Segment>
              <Segment color="black" inverted style={{ borderRadius: 0 }}>
                <Header>Found a bug?</Header>
                <p>
                  Feel free to send an email to{" "}
                  <a href="mailto:jrs.abrecan@gmail.com">the site administrator</a> or contact him
                  on discord: Paul Endri#2569
                </p>
              </Segment>
            </Segment.Group>
          </Segment>
        </Segment.Group>
      </Container>
    </PageComponent>
  );
};

export default AboutView;

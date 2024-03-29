import React from "react";
import { Button, Container, Header, Icon, List, Segment } from "semantic-ui-react";
import { IS_DESKTOP } from "../../components/isDesktop";
import { PageComponent } from "../../components/page";

const AboutView = () => {
  return (
    <PageComponent title="Eternal Return Lumia Survival Guide">
      <Container textAlign="center">
        <Segment.Group style={{ marginTop: "2em" }}>
          <Segment color="black" inverted={true} style={{ borderRadius: 0 }}>
            <Header>About the App</Header>
            <p>
              This app is meant to be a free tool for players of Eternal Return: Black Survival to
              treat as one stop shop for all their information and theory crafting needs.
            </p>
          </Segment>
          <Segment color="black" inverted={true} style={{ borderRadius: 0 }}>
            <Segment.Group horizontal={IS_DESKTOP} style={{ border: 0, background: "transparent" }}>
              <Segment
                textAlign="center"
                basic
                inverted={true}
                vertical
                style={{ maxWidth: "250px", margin: "auto" }}
              >
                <Header inverted={true}>Thanks To</Header>
                <p>This app could not have been made without the following tools</p>
                <List
                  inverted={true}
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
              <Segment
                inverted={true}
                basic
                compact
                textAlign="center"
                style={{ maxWidth: "350px", margin: "auto" }}
              >
                <Header inverted={true} size="large">
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
              <Segment inverted={true}>
                <Header inverted={true}>Roadmap</Header>
                <a href="https://trello.com/b/Ysa0kgGf/erlsg">Official ER:LSG Roadmap</a>
              </Segment>
              <Segment color="black" inverted={true} style={{ borderRadius: 0 }}>
                <Header>Found a bug?</Header>
                <p>
                  Feel free to send an email to{" "}
                  <a href="mailto:jrs.abrecan@gmail.com">the site administrator</a> or contact him
                  on discord: Paul Endri#2569
                </p>
              </Segment>
            </Segment.Group>
            <Segment inverted={true} color="black" textAlign="center">
              <Header inverted={true}>Appreciate the work?</Header>
              <p style={{ width: "300px", margin: "auto" }}>
                If you appreciate the site and want to say thanks or want to help out, you can feel
                free to to donate using any of the following ways. All donations will go towards
                server and maintenance costs
              </p>
              <div>
                <Button
                  color="blue"
                  icon="paypal"
                  as="a"
                  href="https://paypal.me/paulendri?locale.x=en_US"
                >
                  <Icon name="paypal" />
                  PayPal
                </Button>
                <Button color="green" as="a" href="https://cash.app/$paulendri">
                  <Icon name="dollar sign" />
                  Cashapp
                </Button>
              </div>
            </Segment>
          </Segment>
        </Segment.Group>
      </Container>
    </PageComponent>
  );
};

export default AboutView;

import { Loadout } from "erbs-sdk";
import React, { useState } from "react";
import { Header, Segment, Form } from "semantic-ui-react";

const DEFAULT_WEIGHTS = {
  Weapon: 1,
  Chest: 1,
  Head: 1,
  Arm: 1,
  Leg: 1,
  Accessory: 1,
};

type Props = {
  loadout: Loadout;
  defaultWeights: typeof DEFAULT_WEIGHTS;
  updateWeights: (val) => null;
};

export const RouteCustomizerComponent: React.FC<Props> = ({
  loadout,
  defaultWeights = DEFAULT_WEIGHTS,
  updateWeights,
}) => {
  const [weights, setWeights] = useState(defaultWeights);

  const handleWeightChange = (weight) => (e) => {
    const newWeights = {
      ...weights,
      [weight]: e.target.value,
    };
    if (updateWeights) {
      updateWeights(newWeights);
    }
    setWeights(newWeights);
  };
  return (
    <>
      <Segment
        style={{
          border: 0,
        }}
        raised
        inverted
        color="black"
        textAlign="center"
      >
        <Header>Customization</Header>
      </Segment>
      <Segment basic inverted style={{ margin: 0, background: "transparent" }}>
        <Header style={{ textAlign: "center" }}>Equipment Importance</Header>
        <Form
          inverted
          style={{
            display: "flex",
            flexFlow: "wrap column",
            padding: "10px",
          }}
        >
          {Object.keys(defaultWeights).map((weight, idx) => (
            <Form.Field key={weight + idx}>
              <label style={{ textTransform: "capitalize" }}>
                {loadout && loadout[weight.toLowerCase()] && loadout[weight.toLowerCase()].name
                  ? loadout[weight.toLowerCase()].name
                  : weight}
              </label>
              <input
                type="range"
                step={1}
                style={
                  {
                    background: `linear-gradient(to right, #2185d0 0%, #2185d0 ${weights[weight]}%, #fff ${weights[weight]}%, #fff 100%)`,
                    borderRadius: "8px",
                    height: "5px",
                    width: "100%",
                    outline: "none",
                    transition: "background 450ms ease-in",
                    WebkitAppearance: "none",
                    "&::webkitSliderThumb": {
                      WebkitApperance: "none",
                      backgroundColor: "red",
                    },
                  } as any
                }
                min={1}
                max={100}
                value={weights[weight]}
                onChange={handleWeightChange(weight)}
              />
            </Form.Field>
          ))}
        </Form>
      </Segment>
    </>
  );
};

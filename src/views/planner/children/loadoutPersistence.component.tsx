import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dimmer,
  Dropdown,
  Form,
  Icon,
  Input,
  Label,
  Loader,
  Modal,
  Segment,
  Select,
} from "semantic-ui-react";
import { DataContext } from "../../../state/data";

const SimpleLoadoutLookup = ({ getLoadout }) => {
  const [lookup, setLookup] = useState();
  const [error, setError] = useState();

  const handleSubmit = () => {
    getLoadout(lookup)
      .then(() => {
        setError(null);
      })
      .catch((e) => setError(e.message));
  };

  const handleChange = (e, { value }) => {
    setLookup(value);
  };

  return (
    <Segment basic style={{ borderRadius: 0 }} color={error ? "red" : "black"} inverted secondary>
      {error && <Label color="red">{error}</Label>}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Input
            type="text"
            placeholder="Import Loadout (by ID)"
            value={lookup}
            onChange={handleChange}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};
export const LoadoutPersistenceComponent = () => {
  const { getLoadout, user, setSavedLoadouts, ...context } = useContext(DataContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(context.savedLoadouts.length > 0);
  const [selectedDropdown, updateSelectedDropdown] = useState(null);
  const [newName, setNewName] = useState(null);

  //   useEffect(() => {
  //     setLoading(true);
  //     if (!user) {
  //       setSavedLoadouts([]);
  //       setLoading(false);
  //     } else {
  //       getLoadout()
  //         .then(() => {
  //           console.log("Loaded");
  //         })
  //         .catch((e) => {
  //           setError(e);
  //           console.warn("[Ruh Ruh Shaggy]", e);
  //         })
  //         .finally(() => setLoading(false));
  //     }
  //   }, [getLoadout, user, setSavedLoadouts]);

  //   if (!user) {
  //     return <SimpleLoadoutLookup getLoadout={getLoadout} />;
  //   }

  //   if (loading) {
  //     return (
  //       <Segment placeholder>
  //         <Dimmer active={true}>
  //           <Loader />
  //         </Dimmer>
  //       </Segment>
  //     );
  //   }

  const dropDownOptions = [{ text: null, value: null }].concat(
    context.savedLoadouts.map((sl) => ({
      text: sl.name,
      value: sl.id,
    }))
  );
  return (
    <>
      <Segment.Group>
        {error && (
          <Segment basic style={{ borderRadius: 0 }} color="red" inverted>
            {error}
          </Segment>
        )}
        <SimpleLoadoutLookup getLoadout={getLoadout} />
        <Segment basic style={{ borderRadius: 0 }} color="black" inverted secondary>
          <Input fluid>
            <Select
              fluid
              style={{ borderRadius: 0 }}
              placeholder="Saved Loadouts"
              value={selectedDropdown}
              options={dropDownOptions}
              onChange={(e, { value }) => updateSelectedDropdown(value)}
            />
            <Button
              color="yellow"
              style={{ borderRadius: 0 }}
              onClick={() => {
                try {
                  setLoading(true);
                  context.loadLoadout(selectedDropdown);
                } catch (e) {
                  setError(e.message);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Load
            </Button>
          </Input>
        </Segment>
        <Segment basic style={{ borderRadius: 0 }} color="black" inverted secondary>
          {context.currentSavedLoadoutId && (
            <>
              <div>
                <p>{context.loadoutName}</p>
                <Button
                  style={{ marginLeft: "1rem", borderRadius: 0 }}
                  color="green"
                  onClick={() => {
                    try {
                      setLoading(true);
                      context
                        .saveLoadout(context.loadoutName)
                        .then(() => setLoading(false))
                        .catch((e) => setError(e));
                    } catch (e) {
                      setError(e.message);
                    }
                  }}
                >
                  <Icon name="save" />
                  Save
                </Button>
                <Button
                  style={{ marginLeft: "1rem", borderRadius: 0 }}
                  color="red"
                  onClick={() => {
                    try {
                      setLoading(true);
                      context
                        .deleteLoadout(context.currentSavedLoadoutId)
                        .then(() => setLoading(false))
                        .catch((e) => setError(e));
                    } catch (e) {
                      setError(e.message);
                    }
                  }}
                >
                  <Icon name="delete" />
                  Delete
                </Button>
              </div>
              <Modal
                size="small"
                basic
                trigger={
                  <Button
                    color="yellow"
                    fluid
                    style={{ borderRadius: 0 }}
                    onClick={() => {
                      navigator.clipboard.writeText(context.currentSavedLoadoutId);
                    }}
                  >
                    Share Saved Loadout
                    <Icon name="save outline" />
                  </Button>
                }
                header="Copied ID"
                content={`Copied the loadout id to Clipboard: ${context.currentSavedLoadoutId}`}
              />
            </>
          )}
          <Input fluid type="text" placeholder="New Loadout Name">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button
              style={{ borderRadius: 0 }}
              color="green"
              onClick={() => {
                setLoading(true);
                context
                  .saveLoadout(newName)
                  .catch((e) => setError(e.message))
                  .finally(() => setLoading(false));
              }}
            >
              Save New Loadout
            </Button>
          </Input>
        </Segment>
      </Segment.Group>
    </>
  );
};

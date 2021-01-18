import { Loadout } from "erbs-sdk";
import React from "react";
import { Segment, Table } from "semantic-ui-react";
import { interpretStat } from "../../../utilities/interpretStat";

type Props = {
  loadout: Loadout;
};

export const LoadoutStats: React.FC<Props> = ({ loadout }) => {
  const totalStats = {};

  if (!loadout) {
    return null;
  }

  loadout.items
    .filter((x) => x)
    .forEach((item) => {
      Object.entries(item.stats).forEach(([key, val]) => {
        if (totalStats[key]) {
          totalStats[key] += +val;
        } else {
          totalStats[key] = val;
        }
      });
    });

  if (loadout.items.filter((x) => x).length === 0) {
    return (
      <Segment color="black" inverted textAlign="center" placeholder>
        None Yet
      </Segment>
    );
  }
  return (
    <Table inverted structured striped celled compact collapsing={false}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Stat</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(totalStats).map(([statName, val]) => {
          const { name, value } = interpretStat(statName, val);
          return (
            <Table.Row key={statName}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

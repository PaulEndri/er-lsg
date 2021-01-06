import { Character } from 'erbs-sdk';
import React, { FunctionComponent } from 'react';
import { Table } from 'semantic-ui-react';

interface CharacterStatTableProps {
	character: Character;
}
export const CharacterStatTable: FunctionComponent<CharacterStatTableProps> = ({ character }) => {
	let level20Stats = {};

	try {
		level20Stats = (character as any).getStatsForLevel(20);
	} catch (e) {
		console.error(e);
	}

	const { initial, perLevel } = character.stats;

	return (
		<Table celled definition compact structured striped style={{ borderRadius: 0 }}>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell
						style={{
							backgroundColor: 'transparent',
							border: 0,
							boxShadow: 'none'
						}}
					/>
					<Table.HeaderCell>Initial</Table.HeaderCell>
					<Table.HeaderCell>Per Level</Table.HeaderCell>
					<Table.HeaderCell>Level 20</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{Object.keys(initial).map((property) => (
					<Table.Row key={property}>
						<Table.Cell style={{ textTransform: 'capitalize' }}>
							{property.replace(/([A-Z])/g, ' $1').trim()}
						</Table.Cell>
						<Table.Cell>{initial[property]}</Table.Cell>
						<Table.Cell>{perLevel[property] || 0}</Table.Cell>
						<Table.Cell>{level20Stats[property]}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};

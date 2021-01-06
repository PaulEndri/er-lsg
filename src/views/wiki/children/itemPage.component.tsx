import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import { getMiscList, getMiscListKeys } from '../../../utilities/getList';
import { ItemSearchComponent } from './ItemSearch.component';

export const ItemPage = () => {
	const history = useHistory();
	const { id } = useParams() as any;

	return (
		<Container fluid>
			<Menu
				className="attached"
				color="red"
				inverted
				style={{
					borderRadius: 0,
					marginBottom: 0,
					justifyContent: 'center'
				}}
			>
				{getMiscListKeys().map((type) => (
					<Menu.Item
						key={type}
						active={id === type}
						onClick={() => {
							history.push(`/wiki/items/${type}`);
						}}
						color="red"
						style={{
							borderRadius: 0
						}}
					>
						{type}s
					</Menu.Item>
				))}
			</Menu>

			<ItemSearchComponent
				path={`/wiki/items`}
				items={getMiscList(id)}
				title={`${id || 'Item'} Options`}
			/>
		</Container>
	);
};

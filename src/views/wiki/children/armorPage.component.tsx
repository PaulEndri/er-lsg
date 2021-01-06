import { Armors } from 'erbs-sdk';
import React, { useState } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import { getItemList } from '../../../utilities/getList';
import { ItemSearchComponent } from './ItemSearch.component';

export const ArmorPage = () => {
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
				{Object.values(Armors).map((armor) => (
					<Menu.Item
						key={armor}
						active={id === armor}
						onClick={() => {
							history.push(`/wiki/armors/${armor}`);
						}}
						color="red"
						style={{
							borderRadius: 0
						}}
					>
						{armor}
					</Menu.Item>
				))}
			</Menu>

			<ItemSearchComponent
				path={`/wiki/armors`}
				items={getItemList(id)}
				title={`${id || 'Armor'} Options`}
			/>
		</Container>
	);
};

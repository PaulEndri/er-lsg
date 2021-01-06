import { Item } from 'erbs-sdk';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Grid,
	Header,
	Input,
	Search,
	Segment,
	Transition,
	TransitionGroup
} from 'semantic-ui-react';
import { ItemCardComponent } from '../../../components/itemCard.component';
import { ItemModalButton } from '../../../components/itemModalButton.component';
import { BG_HALF } from '../../../utilities/bgImages';

type Props = {
	setSelectedItem?: any;
	items: Item[];
	path?: string;
	selectedItem?: any;
	title: string;
};

export const ItemSearchComponent: React.FC<Props> = ({
	setSelectedItem,
	selectedItem,
	items,
	title,
	path
}) => {
	const history = useHistory();
	const [ searchString, updateSearchString ] = useState(null);
	const [ localItem, setLocalItem ] = useState(null);

	const handleSearchChange = (e, { value }) => {
		console.log('[search]', e, value);
		if (value && value.length > 3) {
			updateSearchString(value.toLowerCase());
		} else if (!value) {
			updateSearchString(null);
		}
	};

	const updateSelected = (id, item) => {
		if (setSelectedItem) {
			setSelectedItem(id, item);
		} else {
			setLocalItem(id);
		}
	};

	const realSelectedItem = selectedItem || localItem;

	return (
		<Grid style={{}}>
			<Grid.Row
				style={{
					borderRadius: 0,
					marginBottom: 0,
					paddingBottom: 0
				}}
				textAlign="center"
			>
				<Grid.Column width={16}>
					<Segment
						fluid
						stacked
						raised
						secondary
						style={{
							borderRadius: 0
						}}
					>
						<Input
							label={{ content: title, color: 'orange' }}
							inline
							placeholder="Search Items"
							onChange={handleSearchChange}
						/>
					</Segment>
				</Grid.Column>
			</Grid.Row>
			<Grid.Row
				fluid
				style={{
					padding: '5rem',
					paddingTop: '10px',
					borderRadius: 0,
					backgroundColor: 'rgba(255, 250, 250, 0.9)',
					marginLeft: 0,
					backgroundImage: BG_HALF
				}}
				textAlign="center"
			>
				{realSelectedItem && (
					<Grid.Column width={6} style={{ marginRight: 0, paddingRight: 0 }}>
						<Transition>
							<ItemCardComponent item={new Item(realSelectedItem)} />
						</Transition>
					</Grid.Column>
				)}
				<Grid.Column
					width={realSelectedItem ? 10 : 16}
					style={{
						paddingTop: 10,
						marginLeft: 0
					}}
					textAlign="center"
				>
					<TransitionGroup duration={100} animation="fade">
						{items
							.filter((item) => {
								if (!searchString) {
									return true;
								}

								return (
									item.name.toLowerCase().includes(searchString) ||
									item.displayName.toLowerCase().includes(searchString)
								);
							})
							.map((item) => (
								<ItemModalButton
									key={item.id}
									id={item.id}
									action={() => {
										if (path) {
											history.push(`${path}/${item.clientType}`);
										}
										updateSelected(item.id, item);
									}}
								/>
							))}
					</TransitionGroup>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

import React, { useContext, useState } from 'react';
import { Segment, Grid, Header, Button, Label, Form, Dropdown } from 'semantic-ui-react';
import { getImageSrc } from '../../../utilities/getImageSrc';
import { Loadout, Locations, Route } from 'erbs-sdk';
import { ItemModalContext } from '../../../state/itemModal';

interface RoutePaneProps {
	loadout: Loadout;
}

const defaultWeights = {
	Weapon: 1,
	Chest: 1,
	Head: 1,
	Arm: 1,
	Leg: 1,
	Accessory: 1
};

export const RoutePaneComponent: React.FC<RoutePaneProps> = ({ loadout }) => {
	const [ routes, setRoutes ] = useState([]);
	const [ weights, updateWeights ] = useState(defaultWeights);
	const [ startingLocation, setStartingLocation ] = useState(null);

	const { setItem } = useContext(ItemModalContext);

	const generateRoute = () => {
		try {
			const route = new Route(loadout);
			setRoutes(route.generate());
		} catch (e) {
			console.error(e);
			setRoutes([]);
		}
	};

	return (
		<Grid>
			<Grid.Row width={11}>
				<Grid.Column mobile={10} tablet={6} computer={6} widescreen={5}>
					<Segment.Group
						style={{
							borderRadius: 0,
							backgroundColor: 'rgba(66, 64, 74, 0.2)',
							marginTop: 14
						}}
					>
						<Segment
							style={{
								border: 0,
								borderRadius: 0
							}}
							raised
							inverted
							color="black"
							textAlign="center"
						>
							<Header>Customization</Header>
						</Segment>
						<Segment
							basic
							inverted
							fluid
							style={{ margin: 0, background: 'transparent' }}
						>
							<Header style={{ textAlign: 'center' }}>Equipment Importance</Header>
							<Form
								inverted
								style={{
									display: 'flex',
									flexFlow: 'wrap column',
									padding: '10px'
								}}
							>
								{Object.keys(defaultWeights).map((weight, idx) => (
									<Form.Field inverted key={weight + idx}>
										<label style={{ textTransform: 'capitalize' }}>
											{loadout &&
											loadout[weight.toLowerCase()] &&
											loadout[weight.toLowerCase()].name ? (
												loadout[weight.toLowerCase()].name
											) : (
												weight
											)}
										</label>
										<input
											type="range"
											step={1}
											style={
												{
													background: `linear-gradient(to right, #2185d0 0%, #2185d0 ${weights[
														weight
													]}%, #fff ${weights[weight]}%, #fff 100%)`,
													borderRadius: '8px',
													height: '5px',
													width: '100%',
													outline: 'none',
													transition: 'background 450ms ease-in',
													WebkitAppearance: 'none',
													'&::webkit-slider-thumb': {
														WebkitApperance: 'none',
														backgroundColor: 'red'
													}
												} as any
											}
											min={1}
											max={100}
											value={weights[weight]}
											onChange={(e) =>
												updateWeights({
													...weights,
													[weight]: e.target.value
												})}
										/>
									</Form.Field>
								))}
							</Form>
						</Segment>
						<Segment
							textAlign="center"
							basic
							fluid
							inverted
							style={{ padding: 8, margin: 0 }}
						>
							<Header>Desired Starting Location</Header>
						</Segment>
						<Segment>
							<Dropdown
								fluid
								placeholder="Automatic"
								value={startingLocation}
								onChange={(e, { value }) => setStartingLocation(value)}
								options={[ { key: '', value: null, text: 'Automatic' } ].concat(
									Object.keys(Locations)
										.filter((loc) => loc !== Locations['Research Center'])
										.map((loc) => ({
											key: loc,
											text: loc,
											value: loc
										}))
								)}
							/>
						</Segment>
						<Segment
							style={{
								border: 0,
								borderRadius: 0,
								backgroundColor: 'rgba(0, 0, 0, 0.5)'
							}}
							raised
						>
							<Button
								fluid
								onClick={generateRoute}
								content="Generate Routes"
								color="green"
							/>
						</Segment>
					</Segment.Group>
				</Grid.Column>
				<Grid.Column width={10}>
					<Grid.Row>
						<Grid.Column width={16}>
							<Segment.Group
								style={{
									borderRadius: 0,
									backgroundColor: 'rgba(66, 64, 74, 0.2)',
									marginTop: 14
								}}
							>
								<Segment basic color="black" inverted textAlign="center" raised>
									<Header>Total Materials Needed</Header>
								</Segment>
								<Segment basic raised stacked>
									<div
										style={{
											width: '100%',
											display: 'flex',
											flexWrap: 'wrap',
											flexDirection: 'row',
											justifyContent: 'center'
										}}
									>
										{Object.entries(loadout.materials)
											.filter(
												([ material ]) =>
													material && material !== 'undefined'
											)
											.map(([ material, quantity ], key) => (
												<div key={key + material} style={{ margin: '5px' }}>
													<Label
														color="teal"
														image
														onClick={() => setItem(material)}
													>
														<img src={getImageSrc(material)} />
														<Label.Detail>{quantity}</Label.Detail>
													</Label>
												</div>
											))}
									</div>
								</Segment>
							</Segment.Group>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={16}>
							<Segment.Group
								style={{
									borderRadius: 0,
									backgroundColor: 'rgba(66, 64, 74, 0.2)',
									marginTop: 14
								}}
							>
								<Segment
									attached="top"
									style={{
										border: 0,
										borderRadius: 0
									}}
									raised
									inverted
									color="black"
									textAlign="center"
								>
									<Header inverted style={{ textTransform: 'capitalize' }}>
										Routes
									</Header>
								</Segment>
								<Segment basic>
									{!routes.length && (
										<Segment
											fluid
											secondary
											inverted
											placeholder
											textAlign="center"
										>
											No Routes Generated
										</Segment>
									)}
									{routes.length > 0 && (
										<div>{JSON.stringify(routes, null, 2)}</div>
									)}
								</Segment>
							</Segment.Group>
						</Grid.Column>
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

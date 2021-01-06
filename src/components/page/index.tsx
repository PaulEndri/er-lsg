import React, { StatelessComponent, ReactNode } from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { BG_THIRD } from '../../utilities/bgImages';
import { SidebarComponent } from '../sidebar';

interface PageProps {
	sidebarItems?: ReactNode;
	title: ReactNode;
	sidebarTitle?: ReactNode;
}

export const PageComponent: StatelessComponent<PageProps> = ({
	sidebarItems,
	title,
	sidebarTitle,
	children
}) => {
	return (
		<Segment basic style={{ padding: 0 }}>
			{sidebarTitle && (
				<SidebarComponent title={sidebarTitle}>{sidebarItems}</SidebarComponent>
			)}
			<div style={{ overflow: 'auto' }}>
				<Segment
					inverted
					raised
					color="red"
					textAlign="center"
					secondary
					padded={false}
					basic
					style={{ marginBottom: 0, padding: 0 }}
				>
					<Header as="h2" style={{ padding: '10px' }}>
						{title}
					</Header>
				</Segment>
				<div
					style={{
						display: 'flow-root',
						overflow: 'auto',
						overflowX: 'hidden',
						maxHeight: window.innerHeight - 90,

						minHeight: window.innerHeight - 180
					}}
				>
					{children}
				</div>
			</div>
		</Segment>
	);
};

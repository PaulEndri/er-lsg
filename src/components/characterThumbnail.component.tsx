import { FunctionComponent, useState } from 'react';
import { getImageSrc } from '../utilities/getImageSrc';

interface CharacterThumbnailProps {
	name: string;
	isActive: boolean;
	onClick?: Function;
	width?: number;
}

const CharacterThumbnailComponent: FunctionComponent<CharacterThumbnailProps> = ({
	name,
	onClick,
	isActive,
	width = 70
}) => {
	const [ hovering, setHovering ] = useState(false);
	const parentStyle = {
		height: `${width + 10}px`,
		width: `${width + 10}px`,
		overflow: 'hidden',
		backgroundColor: 'rgba(200, 200, 200, 0.15)',
		// margin: '3px',
		border: '1px solid rgba(255, 255, 255, 0.1)'
	};

	const containerStyle = {
		overflow: 'hidden',
		transform: 'skew(45deg) scale(1.2)',
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		border: '1px solid ',
		borderColor: 'rgba(200, 200, 200, 0.5)',
		width: `${width + 20}px`,
		height: `${width + 20}px`
	};

	if ((hovering || isActive) && onClick) {
		Object.assign(containerStyle, {
			backgroundColor: 'rgba(200, 200, 200, 1)',
			transform: 'skew(45deg) scale(1.2)',
			borderColor: 'white'
		});

		Object.assign(parentStyle, {
			backgroundColor: 'rgba(255, 190, 16, 0.9)'
		});
	}

	return (
		<div
			style={{
				// padding: 0,
				// margin: 2,
				backgroundColor: 'rgba(255, 255, 255, 0.01)',
				border: '1px solid rgba(255, 255, 255, 0.02)'
			}}
		>
			<div
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				onClick={(e) => (onClick ? onClick(e) : null)}
				style={parentStyle}
				className="test"
			>
				<div style={containerStyle}>
					<img
						style={{
							height: 'auto',
							width: `${width}px`,
							margin: 'auto',
							marginTop: '-5px',
							transform: 'skew(-45deg)'
						}}
						src={getImageSrc(`characters/mini/${name}`)}
						className="ui medium image"
					/>
				</div>
			</div>
		</div>
	);
};

export default CharacterThumbnailComponent;

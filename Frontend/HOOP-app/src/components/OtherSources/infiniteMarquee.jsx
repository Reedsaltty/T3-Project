import { useEffect } from 'react';
import InfiniteMarqueeLib from 'vanilla-infinite-marquee';

function InfiniteMarquee({  dataArray, speed, direction, className }) {
	useEffect(() => {
		const marquee = new InfiniteMarqueeLib({
			element: `.${className}`,
			speed: speed,
			direction: direction,
			smoothEdges: true,
			duplicateCount: 2,
			pauseOnHover: true,
			mobileSettings: {
				direction: direction,
				speed: speed,
			},
		});

		return () => {
			marquee.destroy(); // Clean up the marquee instance on unmount
		};
	}, [speed, direction]);

	return (
		<div className={className}>
			{ dataArray.map((text, index) => (
						<div key={index} style={{ margin: '0 25px' }}>
							{text}
						</div>
				  ))}
		</div>
	);
}

export default InfiniteMarquee;

import React, { FC, ReactNode, useState } from 'react';
import { flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import styled from '~/styles';
import Button from '~/components/button';
import { ZapOff } from 'react-feather';

const Wrapper = styled.div`
	padding: 4rem 2rem;
	text-align: center;
`;

const Heading = styled.h1`
	margin: 0;
	font-size: 2.6rem;
`;

const Subheading = styled.h2`
	font-size: 1.75rem;
`;

const Hero = styled(ZapOff)`
	display: block;
	margin: 4rem auto;
`;

const SelectionButtons = styled.div`
	display: flex;
	justify-content: space-evenly;
	margin: 1.75rem 0;
`;

enum OperatingSystem {
	Linux,
	MacOS,
	Windows,
}

const Welcome: FC = () => (
	<>
		<header>
			<Heading>Welcome to Bukubrow</Heading>
			<Subheading>Communication with the host couldn&apos;t be achieved.</Subheading>
		</header>

		<Hero size={55} />
	</>
);

const Selection: FC<{ selectOS: (os: OperatingSystem) => void }> = (props) => (
	<fieldset>
		<legend>Which operating system are you using?</legend>

		<SelectionButtons>
			<Button onClick={(): void => props.selectOS(OperatingSystem.Linux)}>Linux</Button>
			<Button onClick={(): void => props.selectOS(OperatingSystem.MacOS)}>macOS</Button>
			<Button onClick={(): void => props.selectOS(OperatingSystem.Windows)}>Windows</Button>
		</SelectionButtons>
	</fieldset>
);

const Instructions: FC<{ OS: OperatingSystem }> = (props) => {
	switch (props.OS) {
		case OperatingSystem.Linux:
		case OperatingSystem.MacOS: return (
			<>
				<p>Installing the host and registering it with your browser is required to allow Bukubrow to talk to Buku.</p>

				<p>Please find a precompiled host and instructions at <a href="https://github.com/SamHH/bukubrow-host" target="_blank" rel="noopener noreferrer">samhh/bukubrow-host</a>.</p>
			</>
		);

		case OperatingSystem.Windows: return (
			<>
				<p>Unfortunately, Windows is not yet formally supported by Bukubrow.</p>

				<p>If you&apos;d like to offer your help in achieving support, or otherwise simply +1 it as a feature request, please do so <a href="https://github.com/SamHH/bukubrow-host/issues/5" target="_blank" rel="noopener noreferrer">here</a>.</p>
			</>
		);
	}
};

const Onboarding: FC = () => {
	const [OS, setOS] = useState<Option<OperatingSystem>>(O.none);

	const Content = O.fold<OperatingSystem, ReactNode>(
		() => <Selection selectOS={flow(O.some, setOS)} />,
		(x) => <Instructions OS={x} />,
	)(OS);

	return (
		<Wrapper>
			<Welcome />

			{Content}
		</Wrapper>
	);
};

export default Onboarding;


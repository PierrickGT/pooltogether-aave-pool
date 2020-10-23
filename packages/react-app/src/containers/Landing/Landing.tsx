import React from 'react';
import { Button, Typography } from 'antd';
import { rem } from 'polished';
import styled from 'styled-components';

import { useModal } from 'components/Modal';
import AaveLogo from 'images/AaveLogo';
import { spacingUnit } from 'styles/variables';

const { Title } = Typography;

const LandingContent = styled.section`
    padding: ${spacingUnit(3)} ${spacingUnit(3)} 0;
`;

const StyledTitle = styled(Title)`
    color: white !important;
    max-width: ${rem(800)};
    margin: 0 auto;
`;

const StyledButton = styled(Button)`
    margin: ${spacingUnit(3)} 0;
`;

interface LandingProps {
    toggleWalletModal: () => void;
}

const Landing: React.FC<LandingProps> = ({ toggleWalletModal }) => (
    <LandingContent>
        <AaveLogo />
        <StyledTitle>Welcome to Aave Pool!</StyledTitle>
        <StyledButton type="primary" size="large" onClick={() => toggleWalletModal()}>
            Come on in, the water’s fine!
        </StyledButton>
        <StyledTitle level={2}>Built for the ETH Online Hackathon</StyledTitle>
        <StyledTitle level={3}>
            PoolTogether Pools generate prize money from the accrued interest of yield protocols;
            making for a no-loss money lottery.
        </StyledTitle>
        <StyledTitle level={3}>
            The aptly named Aave Pool indeed uses Aave protocol to generate and pool the yield prize
            money.
        </StyledTitle>
        <StyledTitle level={4}>
            This project is currently only available on Ropsten test network and tickets may only be
            purchased in DAI. With further development, I hope to make Aave Pool tickets available
            for purchase on Mainnet with the option for users to create their own Pool backed by the
            aToken of their choice. Bonus points if you’ve gotten this far and had to read the word
            pool 10 times in less than 133 words, sawry!
        </StyledTitle>
    </LandingContent>
);

export default Landing;

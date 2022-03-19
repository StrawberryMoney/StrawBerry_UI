import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';
import moment from 'moment';
import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import Image from 'material-ui-image';
import Garden from '../../assets/img/garden.png';

import UnlockWallet from '../../components/UnlockWallet';
// import CountDownTimer from '../../components/Countdown';
import Page from '../../components/Page';
import CemeteryCard from './CemeteryCard';
import CemeteryImage from '../../assets/img/background.png';
import { createGlobalStyle } from 'styled-components';
import useGenesisPoolAllocationTimes from '../../hooks/useGenesisPoolAllocationTimes';
import useMeteorPoolAllocationTimes from '../../hooks/useMeteorPoolAllocationTimes';
import ProgressCountdown from './ProgressCountdown';
import useBanks from '../../hooks/useBanks';



import styled from 'styled-components';



const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  family-font: Lobster;
`;


const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Cemetery = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const { from, to } = useGenesisPoolAllocationTimes();
  const { from:mfrom } = useMeteorPoolAllocationTimes();
  const isOver = Date.now() >= to.getTime();
  const isStart = Date.now() >= mfrom.getTime();
  const activeBanks = banks.filter((bank) => !bank.finished);
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          
          {!!account ? (
            <Container maxWidth="lg">
              <Image color="none" style={{ width: "235px", paddingTop: '0px', height: '235px', left: '480px' }} src={Garden} />
              <Typography color="#601611" align="center" variant="h2" gutterBottom>
             
              
              <b><StyledLink style={{ color: '#601611'  }}>Garden</StyledLink></b>
                
              </Typography>
              
              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom>
                  <b><StyledLink style={{ color: '#601611'  }}> Earn BSHARE by staking LP</StyledLink></b>
                  </Typography>
                  <Alert variant="filled" style={{background:'#e3dcb838'}}>
                    {isStart ? 
                      <div><i><StyledLink style={{ color: '#601611'  }}>Pools are live now, Stake LPs to earn more BSHARE, No deposit fee</StyledLink></i></div> : 
                      <>
                        Pools starting at {mfrom.toUTCString()}, No deposit fee.<br/>
                        <div style={{display:'flex'}}>BSHARE reward pools start in: <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={mfrom} description="End Pool" />.</div>
                      </>
                    }
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                {/* <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Earn BERRY by staking BERRY-WAVAX
                  </Typography>
                  <Alert variant="filled" severity="warning">
                    All below pools have ended. Please unstake and collect your rewards.
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div> */}

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                  <b><StyledLink style={{ color: '#601611'  }}> Genesis Pools</StyledLink></b>
                  </Typography>
                  <Alert variant="filled" severity={isOver ? 'info' : 'success'} style={{background:'#e3dcb838'}}>
                    {isOver ? 
                    
                      <div><i><StyledLink style={{ color: '#601611'  }}>All below pools have ended. Please unstake and collect your rewards.</StyledLink></i></div> : 
                      <>
                        Pools starting at {from.toUTCString()} and will run for 2 days with a 1% deposit fee.<br/>
                        <div style={{display:'flex'}}>Time until genesis pools end: <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="End Pool" />.</div>
                        {/* <div>Please refer to <a target="_blank" href="https://berry-finance.gitbook.io/untitled/" rel="noopener noreferrer">documentation</a> docs to understand our protocol's fee model.</div> */}
                      </>
                    }
                  </Alert>
                  {/* <Alert variant="filled" severity="warning">
                    Genesis Pools have ENDED. Please withdraw your funds.
                  </Alert> */}
                  {/* <Typography color="textPrimary" variant="h4" gutterBottom>
                    Decentralized Initial Supply Distribution
                  </Typography> */}
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;

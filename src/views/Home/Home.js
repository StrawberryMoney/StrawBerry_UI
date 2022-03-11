import React, { useMemo } from 'react';
import moment from 'moment';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/background.png';
import BerryImage from '../../assets/img/Strawberry.png';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useGenesisPoolAllocationTimes from '../../hooks/useGenesisPoolAllocationTimes';
import useMeteorPoolAllocationTimes from '../../hooks/useMeteorPoolAllocationTimes';
import ProgressCountdown from '../Cemetery/ProgressCountdown';

import { tomb as tombTesting, tShare as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import TwitterImage from '../../assets/img/twitter.svg';
import DiscordImage from '../../assets/img/discord.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
`;

const Home = () => {
  
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombAvaxLpStats = useLpStats('BERRY-AVAX-LP');
  const tShareAvaxLpStats = useLpStats('BSHARE-AVAX-LP');
  const tombStats = useTombStats();
  console.log('tombstats', tombStats);
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  // const { balance } = useBurnedBSHARES();
  const balance = 0;
  const { from, to } = useGenesisPoolAllocationTimes();
  const { from: mfrom, to: mto } = useMeteorPoolAllocationTimes();
  const isStart = Date.now() >= from.getTime();
  const isOver = Date.now() >= to.getTime();
  const isMStart = Date.now() >= mfrom.getTime();
  const isMOver = Date.now() >= mto.getTime();

  let tomb;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    tomb = tombTesting;
    tShare = tShareTesting;
  } else {
    tomb = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = `https://traderjoexyz.com/trade?outputCurrency=${tomb?.address}#/`
  const buyTShareAddress = `https://traderjoexyz.com/trade?outputCurrency=${tShare?.address}#/`

  const tombLPStats = useMemo(() => (tombAvaxLpStats ? tombAvaxLpStats : null), [tombAvaxLpStats]);
  const tshareLPStats = useMemo(() => (tShareAvaxLpStats ? tShareAvaxLpStats : null), [tShareAvaxLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInAVAX = useMemo(() => (tombStats ? Number(tombStats.tokenInAvax).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInAVAX = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInAvax).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInAVAX = useMemo(() => (tBondStats ? Number(tBondStats.tokenInAvax).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'BERRY-AVAX-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'BSHARE-AVAX-LP' });



  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'BERRY-AVAX-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'BSHARE-AVAX-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justifyContent="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
		  <Image color="none" style={{ width: "235px", paddingTop: '0px', height: '235px' }} src={BerryImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2><StyledLink style={{ color: '#601611' }}>Welcome to Strawberry DAO!</StyledLink></h2>
              <p>Pegged to the price of 0.1 AVAX via seigniorage.</p>
              <p>
							  <StyledLink href="/garden" style={{ color: '#05147c' }} >Stake</StyledLink> your BERRY-AVAX LP tokens to earn BSHARE seigniorage rewards.
              </p>
              <p>To maximize profits, stake your harvested BSHAREs in the <StyledLink href="/smoothies" style={{ color: '#05147c' }} >Smoothies</StyledLink> to earn more BERRY!</p>
              
              { isMStart && !isMOver ? 
                <a href="/garden" style={{fontSize:"18px", fontWeight:"600", color:"#05147c" }}>BSHARE Reward Pools are live now!</a> : !isMStart ?
                <div style={{display:'flex'}}>
                  BSHARE Reward Pools Launch In: <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={mfrom} description="Pool Start" />
                </div> : null 
              }
              <br/>
              { isStart && !isOver ? 
                <a href="/garden" style={{fontSize:"18px", fontWeight:"600", color:"#05147c"}}>Genesis Pools are live now!</a> : !isStart ?
                <div style={{display:'flex'}}>
                  Genesis Pools Launch In: <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={from} description="Pool Start" />
                </div> : null 
              }
            </Box>
          </Paper>
        </Grid>		
        <Grid container justifyContent="center">
            <Box mt={3} mb={1} style={{ padding: '0 10px' }}>
            <Alert variant="filled" severity="warning" style={{background:'#e3dcb838'}}>
                Do your own research before investing. Investing is risky and may result in monetary loss. Strawberry DAO is beta software and may contain bugs. By using Strawberry DAO, you agree that the Strawberry DAO team is not responsible for any financial losses from investing in Strawberry DAO.
            </Alert>
            </Box>
        </Grid>

        <Grid item xs={12} sm={12} align="center">
          <Button target="_blank" href="https://twitter.com/SBerry_money" style={{ margin: '0 10px', backgroundColor:'#1da1f2', padding:'8px 15px' }}>
            <img alt="twitter" src={TwitterImage} className={classes.img} style={{marginRight:'10px'}}/>
            Twitter
          </Button>
          <Button target="_blank" href="https://discord.gg/zMvweQE7WP" style={{ margin: '0 10px', background:'#5865f2', padding:'8px 15px'  }}>
            <img alt="discord" src={DiscordImage} className={classes.img} style={{marginRight:'10px', width: '18px'}}/>
            Discord
          </Button>
          <Button target="_blank" href="https://t.me/SBerry_money" style={{ margin: '0 10px', backgroundColor:'#1da1f2', padding:'8px 15px' }}>
            <img alt="twitter" src={TelegramImage} className={classes.img} style={{marginRight:'10px'}}/>
            Telegram
          </Button>
        </Grid>
        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              {/* <Button color="primary" href="/masonry" variant="contained" style={{ marginRight: '25px' }}>
                Stake Now
              </Button> */}
              {/* <Button href="/cemetery" variant="contained" style={{ marginRight: '25px' }}>
                Stake Now
              </Button> */}
              <Button color="primary" href="/garden" variant="contained" style={{ marginRight: '10px' }}>
                Garden
              </Button>
              <Button color="primary" href="/smoothies" variant="contained" style={{ marginRight: '25px' }}>
                Stake
              </Button>
              <Button
                target="_blank"
                color="primary"
                href={buyTombAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy BERRY
              </Button>
              {/* <Button variant="contained" target="_blank" href={buyTShareAddress} className={classes.button}>
                Buy BSHARE
              </Button> */}
              <Button variant="contained" color="primary" target="_blank" href={buyTShareAddress} style={{ marginRight: '10px' }}>
                Buy BSHARE
              </Button>
              <Button variant="contained" color="primary" target="_blank" href={`https://dexscreener.com/avalanche/${tomb.address}`} style={{ marginRight: '10px' }}>
                BERRY Chart
              </Button>
              <Button variant="contained" color="primary" target="_blank" href={`https://dexscreener.com/avalanche/${tShare.address}`} style={{ marginRight: '10px' }}>
                BSHARE Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* TOMB */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BERRY</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('BERRY');
                }}
                color="default"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TOMB" size={110}/>
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tombPriceInAVAX ? tombPriceInAVAX : '-.----'} AVAX</span>
              </Box>
              <Box>
                <span style={{ fontSize: '18px', alignContent: 'flex-start' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '14px' }}>
                Market Cap: ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tombCirculatingSupply} <br />
                Total Supply: {tombTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} sm={3}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BERRYp</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TOMB" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tombPriceInAVAX ? tombPriceInAVAX : '-.----'} AVAX</span>
              </Box>
              <Box>
                <span style={{ fontSize: '18px', alignContent: 'flex-start' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '14px' }}>
                Market Cap: ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tombCirculatingSupply} <br />
                Total Supply: {tombTotalSupply-140000}
              </span>
            </CardContent>
          </Card>
        </Grid> */}

        {/* TSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BSHARE</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('BSHARE');
                }}
                color="default"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TSHARE" size={110}/>
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tSharePriceInAVAX ? tSharePriceInAVAX : '-.----'} AVAX</span>
              </Box>
              <Box>
                <span style={{ fontSize: '18px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '14px' }}>
                Market Cap: ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply-balance} <br />
                Total Supply: {tShareTotalSupply-balance}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* TBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>BBOND</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('BBOND');
                }}
                color="default"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TBOND" size={110}/>
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tBondPriceInAVAX ? tBondPriceInAVAX : '-.----'} AVAX</span>
              </Box>
              <Box>
                <span style={{ fontSize: '18px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box>
              {/* <span style={{ fontSize: '14px' }}>
                Market Cap: $-.-- <br />
                Circulating Supply: ------ <br />
                Total Supply: ------
              </span> */}
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>BERRY-WAVAX Joe LP</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('BERRY-WAVAX');
                }}
                color="default"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BERRY-AVAX-LP" size={120}/>
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" disabled={false} onClick={onPresentTombZap} variant="contained">
                  Zap In!
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} BERRY /{' '}
                  {tombLPStats?.avaxAmount ? tombLPStats?.avaxAmount : '-.--'} AVAX
                </span>
              </Box>
              <Box style={{ fontSize: '18px' }}>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '14px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {tombLPStats?.totalSupply ? tombLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>BSHARE-WAVAX Joe LP</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('BSHARE-WAVAX');
                }}
                color="default"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE-AVAX-LP" size={120}/>
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" onClick={onPresentTshareZap} variant="contained">
                  Zap In!
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} BSHARE /{' '}
                  {tshareLPStats?.avaxAmount ? tshareLPStats?.avaxAmount : '-.--'} AVAX
                </span>
              </Box>
              <Box style={{ fontSize: '18px' }}>${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '14px' }}>
                Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {tshareLPStats?.totalSupply ? tshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;

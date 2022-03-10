//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createTheme } from '@material-ui/core/styles';

const newTheme = createTheme({
    palette: {
        type: 'dark',
        text: {
            primary: '#000',
        },
        background: {
            default: 'transparent',
            paper: 'transparent',
        },
        primary: {
            light: '#757CE8',
            main: '#003358',
            dark: '#003358',
            contrastText: '#16191E',
        },
        secondary: {
            light: '#757CE8',
            main: '#757CE8',
            dark: '#757CE8',
            contrastText: '#000',
        },
        action: {
            disabledBackground: '#a98fa7 !important',
            active: '#000',
            hover: '#000',
        },
    },
    typography: {
        color: '#E6E9EE',
        fontFamily: ['Montserrat', 'sans-serif'].join(','),
    },
    components: {
        MuiButton: {
            variants: [{
                props: { variant: "standard" },
                style: {
                    border: "1px solid var(--white)"
                }
            }]
        }
    }
});

export default newTheme;
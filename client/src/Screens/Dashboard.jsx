import { Typography } from '@material-ui/core';

const Dashboard = () => (
    <>
        <Typography
            component="h1"
            variant="h4"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
            }}
        >
            This is dashboard
        </Typography>
    </>
);

export default Dashboard;

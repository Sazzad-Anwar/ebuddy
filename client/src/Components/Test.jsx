import { Card } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Col, Container, Row } from 'react-bootstrap';

/* eslint-disable jsx-a11y/media-has-caption */
const Test = () => {
    console.log('hello');
    return (
        <Container className="mt-5">
            <Row>
                <Col xs={12} md={3}>
                    <Card
                        elevation={5}
                        className="mb-0 p-1 border rounded d-flex justify-content-between align-items-center"
                        style={{
                            backgroundColor: '#616161',
                        }}
                    >
                        <InsertDriveFileIcon className="text-white" />
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Test;

/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// import { Typography } from '@material-ui/core';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { Avatar, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import { userLogin } from '../Redux/Actons';

const HomeScreen = () => {
    const { addToast } = useToasts();
    const userData = useSelector((state) => state.userLogin);
    const history = useHistory();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [images, setImages] = useState([]);

    const uploadFile = async (e) => {
        const { files } = e.target;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('uploads', files[i]);
        }

        try {
            const { data } = await axios.post('/api/v1/upload', formData);
            data.map((image) => setImages((preImage) => [...preImage, image.filePath]));
        } catch (error) {
            console.log(error.response);
        }
    };

    const removeFile = async (id) => {
        const uploadId = id.split('/uploads/')[1];
        console.log({ id, uploadId });
        await axios.delete(`/api/v1/upload/${uploadId}`);
        setImages(images.filter((singleImage) => singleImage !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email) {
            addToast('Name or Email can not be null', {
                autoDismiss: true,
                appearance: 'error',
            });
        } else {
            const data = { name, email, photo: images[0] };
            dispatch(userLogin(data));
            history.push('/chat');
        }
    };
    useEffect(() => {
        if (userData && userData.user?.isLoggedIn) {
            history.push('/chat');
        }
    }, [history, userData]);

    return (
        <div className="bg-primary login__screen">
            <Container className="pt-5">
                <h3 className="text-white pt-5 text-center">
                    Welcome to e-chat-Buddy
                    <img className="app__logo ms-2" src="/logo.gif" alt="logo" />
                </h3>
                <Row>
                    <Col lg={4} />
                    <Col xs={12} md={12} lg={4}>
                        <Form onSubmit={handleSubmit} className="my-5">
                            <div className="d-flex justify-content-center align-items-center position-relative photo">
                                <Avatar
                                    alt={name}
                                    src={images[0]}
                                    style={{ height: 150, width: 150 }}
                                />
                                {images[0] && (
                                    <IconButton
                                        className="position-absolute delete__icon"
                                        onClick={() => removeFile(images[0])}
                                    >
                                        <CancelIcon className="text-white" />
                                    </IconButton>
                                )}
                            </div>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label className="text-white">User Name</Form.Label>
                                <Form.Control
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="Enter Name"
                                    htmlFor="name"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="text-white">Email address</Form.Label>
                                <Form.Control
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter email"
                                    htmlFor="email"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="photo">
                                <Form.Label className="text-white">Upload Your Photo</Form.Label>
                                <div className="input-group mb-3">
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={uploadFile}
                                        placeholder="Input Photos"
                                        id="inputGroupFile02"
                                    />
                                </div>
                            </Form.Group>

                            <Button variant="outline-secondary w-100" type="submit">
                                Login
                            </Button>
                        </Form>
                    </Col>
                    <Col lg={4} />
                </Row>
            </Container>
        </div>
    );
};

export default HomeScreen;

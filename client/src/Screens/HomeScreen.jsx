/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// import { Typography } from '@material-ui/core';
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    FormControl,
    Image,
    InputGroup,
    Nav,
    Navbar,
    Row,
} from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { Avatar, Checkbox, FormControlLabel, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CopyrightIcon from '@material-ui/icons/Copyright';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useForm } from 'react-hook-form';
import CloseIcon from '@material-ui/icons/Close';
import { userLogin } from '../Redux/Actons';
import useDebounce from '../Hooks/useDebounce';

const HomeScreen = () => {
    const { addToast } = useToasts();
    const { user, error: responseError } = useSelector((state) => state.userLogin);
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [images, setImages] = useState([]);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const footerRef = useRef(0);
    const [login, setLogin] = useState(true);
    const [isPassword, setIsPassword] = useState(true);
    const debouncedSearchTerm = useDebounce(email, 1000);
    const [show, setShow] = useState(true);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const submitForm = (data) => {
        if (login) {
            dispatch(userLogin(data));
            history.push('/chat');
        } else if (data.password === data.confirmPassword) {
            data.photo = images[0] ?? '';
            dispatch(userLogin(data));
            history.push('/chat');
        }
    };

    const uploadFile = async (e) => {
        const { files } = e.target;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('uploads', files[i]);
        }

        try {
            const { data } = await axios.post('/api/v1/upload', formData);
            data.map((image) => setImages((preImage) => [...preImage, image.filePath]));
            setPhotoUploaded(true);
        } catch (error) {
            console.log(error.response);
        }
    };

    const searchCharacters = async (searchItem) => {
        try {
            const { data } = await axios.get(`/api/v1/user?search=${searchItem}`);
            return data;
        } catch (error) {
            console.log(error.response);
            return null;
        }
    };

    const removeFile = async (id) => {
        const uploadId = id.split('/uploads/')[1];
        console.log({ id, uploadId });
        await axios.delete(`/api/v1/upload/${uploadId}`);
        setImages(images.filter((singleImage) => singleImage !== id));
        setPhotoUploaded(false);
    };

    useEffect(() => {
        if (user && user?.isLoggedIn) {
            history.push('/chat');
        }
        // if (responseError && responseError && !user) {
        //     addToast(responseError, {
        //         appearance: 'error',
        //         autoDismiss: true,
        //     });
        // }
        if (debouncedSearchTerm) {
            const getResult = async () => {
                try {
                    const data = await searchCharacters(debouncedSearchTerm);
                    if (data.isSuccess) {
                        console.log(data.user.photo);
                        setImages([data.user.photo]);
                    }
                } catch (error) {
                    console.log(error.response);
                }
            };
            getResult();
        } else {
            setImages([]);
        }
        window.addEventListener('resize', () => {
            setIsDesktop(window.innerWidth > 991);
        });
        setIsDesktop(window.innerWidth > 991);
    }, [history, user, debouncedSearchTerm, responseError, addToast]);

    return (
        <div className="bg-primary login__screen">
            {login ? (
                <Container>
                    <h3 className="text-white pt-5 text-center">Chat-Buddy</h3>
                    <Row>
                        <Col lg={4} />
                        <Col xs={12} md={12} lg={4}>
                            <Form onSubmit={handleSubmit(submitForm)} className="my-5">
                                <div className="d-flex justify-content-center align-items-center position-relative photo">
                                    <Avatar
                                        alt={email}
                                        src={images[0] ?? '/logo.gif'}
                                        style={{ height: 150, width: 150 }}
                                        className="shadow-lg border border-dark"
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

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="text-white">Email address</Form.Label>
                                    <Form.Control
                                        value={email}
                                        {...register('email', { required: true })}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="Enter email"
                                        htmlFor="email"
                                    />
                                    {errors.email && (
                                        <p className="text-danger py-1">Email is required</p>
                                    )}
                                </Form.Group>

                                <Form.Label className="text-white">Password</Form.Label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="User Password"
                                        aria-label="User Password"
                                        aria-describedby="basic-addon2"
                                        {...register('password', { required: true })}
                                        type={isPassword ? 'password' : 'text'}
                                        htmlFor="email"
                                    />
                                    <InputGroup.Text
                                        id="basic-addon2"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setIsPassword(!isPassword)}
                                    >
                                        {isPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </InputGroup.Text>
                                </InputGroup>
                                {errors.password && (
                                    <p className="text-danger pb-1">Password is required</p>
                                )}

                                {!user && responseError && show && (
                                    <Alert
                                        variant="danger"
                                        className="py-2 text-center d-flex justify-content-between align-items-center"
                                    >
                                        {responseError}{' '}
                                        <CloseIcon
                                            onClick={() => setShow(false)}
                                            className="text-white cursor__pointer"
                                        />
                                    </Alert>
                                )}

                                <Button variant="outline-secondary w-100" type="submit">
                                    Login
                                </Button>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="text-white py-2">Not registered? </p>
                                    <Button
                                        className="text-white py-2"
                                        onClick={() => setLogin(!login)}
                                    >
                                        Register{' '}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                        <Col lg={4} />
                    </Row>
                </Container>
            ) : (
                <Container className="">
                    <h3 className="text-white pt-5 text-center">Chat-Buddy</h3>
                    <Row>
                        <Col lg={4} />
                        <Col xs={12} md={12} lg={4}>
                            <Form onSubmit={handleSubmit(submitForm)} className="my-5">
                                <div className="d-flex justify-content-center align-items-center position-relative photo">
                                    <Avatar
                                        src={images[0] ?? '/logo.gif'}
                                        style={{ height: 150, width: 150 }}
                                        className="shadow-lg border border-dark"
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
                                        {...register('name', { required: true })}
                                        type="text"
                                        placeholder="Enter Name"
                                        htmlFor="name"
                                    />
                                    {errors.name && (
                                        <p className="text-danger py-1">Name is required</p>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="text-white">Email address</Form.Label>
                                    <Form.Control
                                        {...register('email', { required: true })}
                                        type="email"
                                        placeholder="Enter email"
                                        htmlFor="email"
                                    />
                                    {errors.email && (
                                        <p className="text-danger py-1">Email is required</p>
                                    )}
                                </Form.Group>

                                {!photoUploaded && (
                                    <Form.Group className="mb-3" controlId="photo">
                                        <Form.Label className="text-white">
                                            Upload Your Photo
                                        </Form.Label>
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
                                )}

                                <Form.Label className="text-white">Password</Form.Label>
                                <InputGroup className="mb-1">
                                    <FormControl
                                        placeholder="Recipient's username"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        {...register('password', { required: true })}
                                        type={isPassword ? 'password' : 'text'}
                                        htmlFor="email"
                                    />
                                    <InputGroup.Text
                                        id="basic-addon2"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setIsPassword(!isPassword)}
                                    >
                                        {isPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </InputGroup.Text>
                                </InputGroup>
                                {errors.password && (
                                    <p className="text-danger py-1">Password is required</p>
                                )}

                                <Form.Label className="text-white">Confirm Password</Form.Label>
                                <InputGroup className="mb-1">
                                    <FormControl
                                        placeholder="Recipient's username"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        {...register('confirmPassword', { required: true })}
                                        type={isPassword ? 'password' : 'text'}
                                        htmlFor="email"
                                    />
                                    <InputGroup.Text
                                        id="basic-addon2"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setIsPassword(!isPassword)}
                                    >
                                        {isPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </InputGroup.Text>
                                </InputGroup>
                                {errors.confirmPassword && (
                                    <p className="text-danger py-1">Confirm Password is required</p>
                                )}

                                <Button variant="outline-secondary w-100" type="submit">
                                    Register
                                </Button>

                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="text-white py-2">Have account already? </p>
                                    <Button
                                        className="text-white py-2"
                                        onClick={() => setLogin(!login)}
                                    >
                                        Login{' '}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                        <Col lg={4} />
                    </Row>
                </Container>
            )}

            {isDesktop ? (
                <Navbar className="nav__bar fixed-bottom" ref={footerRef} expand="lg">
                    <Container className="d-flex justify-content-between align-items-center">
                        <Nav className=" align-items-center py-2 text-white">
                            Copyright <CopyrightIcon className="me-2" /> {new Date().getFullYear()}{' '}
                            Chat-Buddy. All rights reserved.
                        </Nav>
                        <Nav className="align-items-center text-white">
                            Designed & Developed By Sazzad Bin Anwar
                        </Nav>
                    </Container>
                </Navbar>
            ) : (
                <Navbar className="nav__bar" ref={footerRef} expand="lg">
                    <Container>
                        <Nav className="py-2 text-white">
                            Copyright &copy; {new Date().getFullYear()} All rights reserves to
                            Chat-Buddy
                        </Nav>
                        <Nav className="align-items-center pb-4 text-white">
                            Designed & Developed By Sazzad Bin Anwar
                        </Nav>
                    </Container>
                </Navbar>
            )}
        </div>
    );
};

export default HomeScreen;

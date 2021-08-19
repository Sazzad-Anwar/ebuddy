import { Avatar, Badge, Card } from '@material-ui/core';
import moment from 'moment';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getChatMsg } from '../Redux/Actons';

const Users = ({
    userInfo,
    messages,
    findRoomUser,
    setReplyMsgDetails,
    setDisplayMessages,
    showMobileChat,
}) => {
    const dispatch = useDispatch();

    return (
        <Card
            elevation={10}
            body
            className={
                userInfo?.isActive
                    ? 'bg__green p-2 d-flex align-items-center mb-3'
                    : 'bg-dark p-2 d-flex align-items-center mb-3'
            }
            style={{ cursor: 'pointer' }}
            onClick={async () => {
                findRoomUser(userInfo?.email);
                setReplyMsgDetails('');
                setDisplayMessages(!!showMobileChat);
                await axios.get(`/api/v1/messages?messageSeen=${userInfo?.email}`);
                dispatch(getChatMsg());
            }}
        >
            <Avatar alt={userInfo?.name} src={userInfo?.photo} className="shadow-lg border" />

            <div className="ps-3 ">
                <p className="text-white my-0 fs-6 user__name_list">{userInfo?.name}</p>
                <p className="text-white my-0 last__seen">
                    {userInfo?.isActive
                        ? 'Online'
                        : `Active ${moment(userInfo?.updatedAt).fromNow()}`}
                    {}
                </p>
            </div>
            <Badge
                badgeContent={
                    messages?.filter(
                        (userMessage) => userMessage.from === userInfo?.email && !userMessage.isSeen
                    ).length
                }
                color="primary"
            >
                <ChatBubbleIcon className="ms-5 text-white" />
            </Badge>
        </Card>
    );
};

export default Users;

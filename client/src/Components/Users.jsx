import { Avatar, Badge, Card } from '@material-ui/core';
import moment from 'moment';

const Users = ({
    userInfo,
    messages,
    findRoomUser,
    setReplyMsgDetails,
    setDisplayMessages,
    showMobileChat,
}) => (
    <Card
        elevation={10}
        body
        className={
            userInfo?.isActive
                ? 'bg__green p-2 d-flex align-items-center mb-3'
                : 'bg-dark p-2 d-flex align-items-center mb-3'
        }
        style={{ cursor: 'pointer' }}
        onClick={() => {
            findRoomUser(userInfo?.email);
            setReplyMsgDetails('');
            setDisplayMessages(!!showMobileChat);
        }}
    >
        <Badge
            badgeContent={
                userInfo?.isActive
                    ? messages?.filter((userMessage) => userMessage.from === userInfo?.email).length
                    : 0
            }
            color="primary"
        >
            <Avatar alt={userInfo?.name} src={userInfo?.photo} className="shadow-lg border" />
        </Badge>

        <div className="ps-3 ">
            <p className="text-white my-0 fs-6 user__name_list">{userInfo?.name}</p>
            <p className="text-white my-0 last__seen">
                {userInfo?.isActive ? 'Online' : `Active ${moment(userInfo?.updatedAt).fromNow()}`}
                {}
            </p>
        </div>
    </Card>
);

export default Users;

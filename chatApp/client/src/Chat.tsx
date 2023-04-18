import { useContext, useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import { Box, Button, Slide } from '@material-ui/core';
import axios from 'axios';
import Contact from './Contact';
import MessageBubble from './MessageBubble';
import UnselectedState from './UnselectedState';
import ChatForm from './ChatForm';

type Message = {
  createdAt?: string;
  file?: string | null;
  recipient?: string;
  sender: string | null;
  text?: string;
  updatedAt?: string;
  __v?: number;
  _id: number;
};
export default function Chat() {
  const [ws, setWs] = useState<WebSocket>();
  const [peopleOnline, setPeopleOnline] = useState<any>();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [offlinePeople, setOfflinePeople] = useState<any>({});
  const [isMessageEmpty, setIsMessageEmpty] = useState(false);
  const divUnderMessages: React.MutableRefObject<HTMLElement | undefined> =
    useRef();
  const { loggedInUser, id, setId, setLoggedInUser } = useContext(UserContext);

  useEffect(() => {
    if (selectedUserId) {
      axios.get(`/messages/${selectedUserId}`).then((response) => {
        const { data } = response;
        setMessages(data);
      });
    }
  }, [selectedUserId]);

  function connectToWs() {
    const ws = new WebSocket('ws://chat-app-api-eight.vercel.app/');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArr: any) {
    const people: any = {};

    peopleArr.forEach(({ userId, username }: any) => {
      people[userId] = username;
    });
    setPeopleOnline(people);
  }

  function handleMessage(e: any) {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      setMessages((prev: Message[]) => [...(prev || []), { ...messageData }]);
    }
  }
  const peopleOnlineExcludingSignedUser = { ...peopleOnline };

  id && delete peopleOnlineExcludingSignedUser[id];

  async function handleSendMessage(e: any, file?: any) {
    if (e) {
      e.preventDefault();
    }
    if (newMessageText === '') {
      setIsMessageEmpty(true);
    }
    if (file) {
      if (newMessageText === '') {
        setIsMessageEmpty(false);
      }
      setIsMessageEmpty(false);
    }
    if (newMessageText !== '' || file) {
      await ws?.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
          file
        })
      );
      setNewMessageText('');
      setMessages((prevState: Message[]) => [
        ...(prevState || []),
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now()
        }
      ]);
    }
    if (file) {
      axios
        .get('/messages/' + selectedUserId)
        .then((res) => setMessages(res.data));
    }
  }

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    const div: any = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people').then((res) => {
      const { data } = res;
      const peopleOfflineArr = data
        .filter((person: any) => person._id !== id)
        .filter(
          (person: any) => !Object.keys(peopleOnline).includes(person._id)
        );

      const peopleOffline: any = {};
      peopleOfflineArr.forEach((p: any) => {
        peopleOffline[p._id] = p;
      });
      setOfflinePeople(peopleOffline);
    });
  }, [peopleOnline]);

  const messagesWithoutDuplicates = uniqBy(messages, '_id');

  function logout() {
    axios.post('/logout').then(() => {
      setWs(undefined);
      setId(null);
      setLoggedInUser(null);
    });
  }
  function sendFile(e: any) {
    const reader = new FileReader();
    if (e?.target?.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = () => {
      handleSendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result
      });
    };
    handleSendMessage(e);
  }

  return (
    <Box className='flex h-screen'>
      <Box className='bg-white w-1/3 flex flex-col'>
        <Box className='flex-grow'>
          <Logo />
          {peopleOnline &&
            Object.keys(peopleOnlineExcludingSignedUser).map((userId) => (
              <Contact
                id={userId}
                username={peopleOnlineExcludingSignedUser[userId]}
                onClick={() => setSelectedUserId(userId)}
                selected={selectedUserId === userId}
                online={true}
                key={userId}
              />
            ))}
          {offlinePeople &&
            Object.keys(offlinePeople).map((userId) => (
              <Contact
                id={offlinePeople[userId]._id}
                username={offlinePeople[userId].username}
                onClick={() => setSelectedUserId(userId)}
                selected={selectedUserId === userId}
                online={false}
                key={userId}
              />
            ))}
        </Box>
        <Box className='p-2 text-center'>
          <span className='mr-4 text-lg text-gray-600'>
            Welcome {loggedInUser}
          </span>
          <Button onClick={logout} variant='contained' color='secondary'>
            Logout
          </Button>
        </Box>
      </Box>
      <Box
        className='flex flex-col w-2/3 p-2'
        style={{ backgroundColor: '#3C486B' }}
      >
        <Box className='flex-grow'>
          {selectedUserId ? (
            <Box className='relative h-full'>
              <Box className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {messagesWithoutDuplicates?.map((message: Message) => (
                  <MessageBubble
                    key={message._id}
                    messageId={message._id}
                    sender={message.sender === id}
                    file={message.file}
                    text={message.text}
                  />
                ))}
                <Slide direction='down' ref={divUnderMessages}>
                  <Box className='h-20'></Box>
                </Slide>
              </Box>
            </Box>
          ) : (
            <UnselectedState />
          )}
        </Box>
        {!!selectedUserId && (
          <ChatForm
            onSubmit={handleSendMessage}
            onTextChange={setNewMessageText}
            onFileChange={sendFile}
            value={newMessageText}
            isMessageEmpty={isMessageEmpty}
            setIsMessageEmpty={setIsMessageEmpty}
          />
        )}
      </Box>
    </Box>
  );
}

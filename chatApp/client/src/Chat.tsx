import { useContext, useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import { Box, Button } from '@material-ui/core';
import axios from 'axios';
import Contact from './Contact';
import MessageBubble from './MessageBubble';
import UnselectedState from './UnselectedState';
import ChatForm from './ChatForm';

export default function Chat() {
  const [ws, setWs] = useState<any>();
  const [peopleOnline, setPeopleOnline] = useState<any>();
  const [selectedUserId, setSelectedUserId] = useState<any>();
  const [newMessageText, setNewMessageText] = useState<any>('');
  const [messages, setMessages] = useState<any>();
  const [offlinePeople, setOfflinePeople] = useState({});

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
    const ws = new WebSocket('ws://localhost:4040');
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
      setMessages((prev: any) => [...(prev || []), { ...messageData }]);
    }
  }
  const peopleOnlineExcludingSignedUser = { ...peopleOnline };

  id && delete peopleOnlineExcludingSignedUser[id];

  async function handleSendMessage(e: any, file: any = null) {
    if (e) {
      e.preventDefault();
    }

    await ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file
      })
    );
    setNewMessageText('');
    setMessages((prev: any) => [
      ...(prev || []),
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now()
      }
    ]);
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
    const div = divUnderMessages.current;
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
      setWs(null);
      setId(null);
      setLoggedInUser(null);
    });
  }
  function sendFile(e: any) {
    const reader = new FileReader();
    if (e.target.files[0]) {
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
                {messagesWithoutDuplicates?.map((message: any) => (
                  <MessageBubble
                    key={message._id}
                    id={message._id}
                    sender={message.sender === id}
                    file={message.file}
                    text={message.text}
                  />
                ))}
                <Box className='h-12' ref={divUnderMessages}></Box>
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
          />
        )}
      </Box>
    </Box>
  );
}

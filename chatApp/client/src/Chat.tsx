import { useContext, useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import { Box, TextField, Button, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import Contact from './Contact';
import AttachFileIcon from '@material-ui/icons/AttachFile';

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

  function handleSendMessage(e: any, file: any = null) {
    if (e) {
      e.preventDefault();
    }
    if (file) {
      axios.get(`/messages/${selectedUserId}`).then((response) => {
        const { data } = response;
        setMessages(data);
      });
    }
    ws.send(
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
  }
  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    reader.readAsDataURL(e.target.files[0]);
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
      <Box className='flex flex-col bg-blue-50 w-2/3 p-2'>
        <Box className='flex-grow'>
          {selectedUserId ? (
            <Box className='relative h-full'>
              <Box className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {messagesWithoutDuplicates?.map((message: any) => (
                  <Box
                    key={message._id}
                    className={`${
                      message.sender === id ? 'text-right' : 'text-left'
                    }`}
                  >
                    <Box
                      className={`text-left inline-block p-2 my-2 rounded-lg text-sm ${
                        message.sender === id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      {message.text}
                      {message.file && (
                        <Box>
                          <a href={axios.defaults.baseURL + '/' + message.file}>
                            {message.file}
                          </a>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
                <Box className='h-12' ref={divUnderMessages}></Box>
              </Box>
            </Box>
          ) : (
            <Box className='h-full flex items-center justify-center'>
              <Box className='text-gray-400'>
                &larr; Select A Person From the Sidebar
              </Box>
            </Box>
          )}
        </Box>
        {!!selectedUserId && (
          <form className='flex gap-2' onSubmit={handleSendMessage}>
            <TextField
              variant='outlined'
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              type='text'
              className='bg-white border p-2 flex-grow rounded-sm'
              placeholder='Type your message here'
            />
            <label className='bg-blue-200 p-2 text-grey-200 rounded-sm border-blue-200 cursor-pointer flex items-center justify-center h-14 w-14'>
              <input type='file' className='hidden' onChange={sendFile} />
              <AttachFileIcon style={{ transform: 'rotate(45deg)' }} />
            </label>
            <Button variant='contained' color='primary' type='submit'>
              <SendIcon />
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
}

import { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import { Box, TextField, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default function Chat() {
  const [ws, setWs] = useState<any>();
  const [peopleOnline, setPeopleOnline] = useState<any>();
  const [selectedUserId, setSelectedUserId] = useState<any>();
  const [newMessageText, setNewMessageText] = useState<any>();
  const [messages, setMessages] = useState<any>();
  const divUnderMessages: React.MutableRefObject<HTMLElement | undefined> =
    useRef();
  const { id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
  }, []);

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

  function handleSendMessage(e: any) {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText
      })
    );
    setNewMessageText('');
    setMessages((prev: any) => [
      ...(prev || []),
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        id: Date.now()
      }
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const messagesWithoutDuplicates = uniqBy(messages, 'id');

  return (
    <Box className='flex h-screen'>
      <Box className='bg-white w-1/3'>
        <Logo />
        {peopleOnline &&
          Object.keys(peopleOnlineExcludingSignedUser).map((userId) => (
            <Box
              className={`border-b border-gray-100 flex items-center gap-3 cursor-pointer ${
                userId === selectedUserId ? 'bg-blue-50' : ''
              }`}
              key={userId}
              onClick={() => setSelectedUserId(userId)}
            >
              {userId === selectedUserId && (
                <Box className='w-1 h-14 bg-blue-500 rounded-r-md'></Box>
              )}
              <Box className='py-2 pl-4 gap-2 flex items-center'>
                <Avatar userId={userId} username={peopleOnline[userId]} />
                <Box className='text-grey-700'>{peopleOnline[userId]}</Box>
              </Box>
            </Box>
          ))}
      </Box>
      <Box className='flex flex-col bg-blue-50 w-2/3 p-2'>
        <Box className='flex-grow'>
          {selectedUserId ? (
            <Box className='relative h-full'>
              <Box className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {messagesWithoutDuplicates?.map((message: any) => (
                  <Box
                    className={`${
                      message.sender === id ? 'text-right' : 'text-left'
                    }`}
                  >
                    <Box
                      key={message.id}
                      className={`text-left inline-block p-2 my-2 rounded-lg text-sm ${
                        message.sender === id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      {message.text}
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
            <Button variant='contained' color='primary' type='submit'>
              <SendIcon />
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
}

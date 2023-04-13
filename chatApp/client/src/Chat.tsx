import { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';

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
    <div className='flex h-screen'>
      <div className='bg-white w-1/3'>
        <Logo />
        {peopleOnline &&
          Object.keys(peopleOnlineExcludingSignedUser).map((userId) => (
            <div
              className={`border-b border-gray-100 flex items-center gap-3 cursor-pointer ${
                userId === selectedUserId ? 'bg-blue-50' : ''
              }`}
              key={userId}
              onClick={() => setSelectedUserId(userId)}
            >
              {userId === selectedUserId && (
                <div className='w-1 h-14 bg-blue-500 rounded-r-md'></div>
              )}
              <div className='py-2 pl-4 gap-2 flex items-center'>
                <Avatar userId={userId} username={peopleOnline[userId]} />
                <span className='text-grey-700'>{peopleOnline[userId]}</span>
              </div>
            </div>
          ))}
      </div>
      <div className='flex flex-col bg-blue-50 w-2/3 p-2'>
        <div className='flex-grow'>
          {selectedUserId ? (
            <div className='relative h-full'>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {messagesWithoutDuplicates?.map((message: any) => (
                  <div
                    className={`${
                      message.sender === id ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      key={message.id}
                      className={`text-left inline-block p-2 my-2 rounded-lg text-sm ${
                        message.sender === id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div className='h-12' ref={divUnderMessages}></div>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center'>
              <div className='text-gray-400'>
                &larr; Select A Person From the Sidebar
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className='flex gap-2' onSubmit={handleSendMessage}>
            <input
              multiple
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              type='text'
              className='bg-white border p-2 flex-grow rounded-sm'
              placeholder='Type your message here'
            />
            <button
              className='bg-blue-500 p-2 text-white rounded-sm'
              type='submit'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Text,Box, HStack } from '@chakra-ui/react'
import ProfileModal from '../common/ProfileModal'
import { getSenderFull } from '../../config/ChatLogistics'
import { getSender } from '../../config/ChatLogistics'
import Lottie from "react-lottie";
import animationData from "../../assets/animations/typing.json";

import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons'
import { IconButton, Button } from '@chakra-ui/react'
import UpdateGroupChatModal from '../common/UpdateGroupChatModal'
import { useState } from 'react'
import { Spinner,FormControl,Input } from '@chakra-ui/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import '../../styles/components.css'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;



const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState()
    const toast=useToast()
    const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
     const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false)
  const [istyping,setIsTyping]=useState(false)
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    socket = io(ENDPOINT);
     socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
     socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);
   const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(data)
       
      setMessages(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id)

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat
  },[selectedChat])
  const sendMessage =async(event) => {
    if (event.key === "Enter" && newMessage) {
       socket.emit("stop typing", selectedChat._id);
       
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageContent = newMessage;
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config
        );
        
        setMessages([...messages,data])
       socket.emit("new message",data);
       
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
    
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', selectedChat._id);
      formData.append('content', '');

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/message",
        formData,
        config
      );

      setMessages([...messages, data]);
      socket.emit("new message", data);
      
      toast({
        title: "File sent",
        description: "File uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to upload the file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
   useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
          if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    
  };
  return(
    <>
    {
        selectedChat?(
            <>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                   <UpdateGroupChatModal
                
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                  
                </>
              )}
          </Text>
           <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className='message'>
                <ScrollableChat messages={messages}/>
              </div>
            )}
              <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping?<div> <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /></div>:(<></>)}
              <HStack spacing={2}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <IconButton
                  aria-label="Attach file"
                  icon={<AttachmentIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={uploading}
                  variant="ghost"
                  colorScheme="blue"
                  size="md"
                  className="file-upload-button"
                  title="Attach a file"
                />
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  flex={1}
                  _hover={{ bg: "#D0D0D0" }}
                  _focus={{ bg: "#F0F0F0", borderColor: "blue.400" }}
                  transition="all 0.2s"
                />
              </HStack>
            </FormControl>
          </Box>
            </>
        ):(
             <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
        )
    }
      
    </>
  )
  
}

export default SingleChat


import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
    
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const toast = useToast();
    const history = useHistory();
     const [loading, setLoading] = useState(false);

   
    const [show,setShow]=useState(false)
    const handleClick=()=>{
        setShow(!show)
    }
    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px'  color='black'>
    <FormControl id='email' isRequired>
        <FormLabel color='white'>Email</FormLabel>
        <Input placeholder='enter your name' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel color='white'>Password</FormLabel>
        <InputGroup size='md'>
        <Input type={show?"text":"password"} placeholder='enter your name' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>
    
    
    <Button colorScheme='Blue' style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
       Login

    </Button>
    <Button variant='solid' colorScheme='red' width="100%" onClick={()=>{
    setEmail("guest@gmail.com")
    setPassword("123456")
    
    }}>
    Get Guest User Credentials
    </Button>
"

    
   
    </VStack>
  )
}

export default Login

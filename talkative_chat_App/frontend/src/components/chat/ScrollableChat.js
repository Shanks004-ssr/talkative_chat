import { Avatar, Box, Image, Link, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogistics";
import { ChatState } from "../../Context/ChatProvider";
import { DownloadIcon } from "@chakra-ui/icons";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📄';
  };

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http')) return fileUrl;
    return `http://localhost:5000${fileUrl}`;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="message-item" style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <Box
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: m.fileUrl ? "10px" : "5px 15px",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {m.fileUrl && (
                <VStack spacing={2} align="stretch">
                  {isImage(m.fileType) ? (
                    <Box position="relative">
                      <Image
                        src={getFileUrl(m.fileUrl)}
                        alt={m.fileName || "Image"}
                        maxH="300px"
                        maxW="100%"
                        borderRadius="10px"
                        objectFit="contain"
                        cursor="pointer"
                        onClick={() => window.open(getFileUrl(m.fileUrl), '_blank')}
                      />
                    </Box>
                  ) : (
                    <Box
                      p={3}
                      bg={m.sender._id === user._id ? "#A0D8EF" : "#90EEB0"}
                      borderRadius="10px"
                      border="1px solid"
                      borderColor={m.sender._id === user._id ? "#7BC4DC" : "#7ED8A0"}
                    >
                      <HStack spacing={2}>
                        <Text fontSize="2xl">{getFileIcon(m.fileType)}</Text>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                            {m.fileName || "File"}
                          </Text>
                          {m.fileSize && (
                            <Text fontSize="xs" color="gray.600">
                              {formatFileSize(m.fileSize)}
                            </Text>
                          )}
                        </VStack>
                        <Link
                          href={getFileUrl(m.fileUrl)}
                          download
                          isExternal
                        >
                          <IconButton
                            aria-label="Download file"
                            icon={<DownloadIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          />
                        </Link>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              )}
              {m.content && (
                <Text mt={m.fileUrl ? 2 : 0} wordBreak="break-word">
                  {m.content}
                </Text>
              )}
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
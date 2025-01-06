"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Trash2 } from 'lucide-react'
import { Sponsor } from '../../types/sponsorship'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  timestamp: Date
}

interface SponsorCommunicationProps {
  sponsor: Sponsor
}

export function SponsorCommunication({ sponsor }: SponsorCommunicationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-300px)]">
      {/* Left side - Messages list */}
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Input
            placeholder="Type here to search for Media"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <ScrollArea className="flex-1 border rounded-lg">
          {filteredMessages.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col p-3 rounded-lg cursor-pointer hover:bg-accent ${
                    selectedMessage?.id === message.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate">{message.content}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMessage(message.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(message.timestamp, 'dd/MM/yyyy, HH:mm:ss')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right side - Selected message or new message form */}
      <Card className="h-full">
        {selectedMessage ? (
          <>
            <CardHeader>
              <CardTitle>{format(selectedMessage.timestamp, 'dd/MM/yyyy, HH:mm:ss')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
              >
                <Textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                />
                <Button className="w-full" type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}


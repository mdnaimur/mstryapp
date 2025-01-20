"use client";

import { Loader2, RefreshCcw } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import { ApiRespone } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMsg = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiRespone>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      console.log("some error inside message sent", error);
      const axisError = error as AxiosError<ApiRespone>;
      toast({
        title: "Error",
        description: axisError.response?.data.message,
        variant: "destructive",
      });
      return Response.json(
        {
          success: false,
          message: "Failed to fetch message",
        },
        {
          status: 500,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiRespone>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axisError = error as AxiosError<ApiRespone>;
        toast({
          title: "Error",
          description: axisError.response?.data.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // hanlde switch change

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiRespone>("/api/accept-messages", {
        acceptMsg: !acceptMsg,
      });
      setValue("acceptMessages", !acceptMsg);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axisError = error as AxiosError<ApiRespone>;
      toast({
        title: "Error",
        description: axisError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  const username = session?.user?.username;

  //TODO: do more research for base url copy
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copytoClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL compied",
      description: "Profile URL has been copied clipboard ",
    });
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copytoClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMsg}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMsg ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {" "}
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}{" "}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

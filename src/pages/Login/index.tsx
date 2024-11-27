import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardContent,
  Card,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  credentials: z.string().min(2, {
    message: "Credentials must be at least 10 characters.",
  }),
});

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_URL: string = import.meta.env.VITE_PUBLIC_API_URL;
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    const credentials = localStorage.getItem("credentials");
    if (credentials) {
      navigate("/module");
    }
  }, [navigate]);

  const onSubmit = async (data: any) => {
    try {
      data = {
        credentials: data.credentials,
      };
      const response = await axios.post(`${API_URL}/telelab/enter`, data);
      localStorage.setItem("credentials", response.data.credentials);
      localStorage.setItem("module", response.data.module.number);
      localStorage.setItem(
        "number_of_experiment",
        response.data.module.number_of_experiment
      );
      navigate("/module");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen relative">
      <Card className="w-[22rem] p-2 z-10">
        <CardHeader className="py-4">
          <h1 className="md:text-2xl text-xl font-bold">
            Welcome to the World of Technology
          </h1>
          <p className="text-xs text-gray-400">
            Enter your practicum credentials to continue
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full "
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Praticum Credentials</FormLabel>
                    <FormControl>
                      <Input placeholder="di4darpp84" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-gray-500 text-xs">
          Credentials available in PraktikaTelelab Web
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;

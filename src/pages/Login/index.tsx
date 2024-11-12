import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { BackgroundBeams } from "@/components/ui/background-beams";

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
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const API_URL: string = import.meta.env.VITE_PUBLIC_API_URL;
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/module");
    }
  }, [navigate]);

  const onSubmit = async (data: any) => {
    try {
      data = {
        email: data.email + "@student.its.ac.id",
        password: data.password,
        password_confirmation: data.password,
      };
      const response = await axios.post(`${API_URL}/auth/login`, data);
      localStorage.setItem("token", response.data.data);
      navigate("/module");
    } catch (error: any) {
      console.error("Login failed", error);
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
            Continue with your MyITS account to log in to Telelab PRATIKA!
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
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="502421234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-gray-500 text-xs">
          Don't have an account? Please contact the admin.
        </CardFooter>
      </Card>
      <BackgroundBeams />
    </section>
  );
};

export default LoginPage;

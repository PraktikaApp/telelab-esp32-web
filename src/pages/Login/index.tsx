import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginPage: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [error, setError] = React.useState<string | null>(null); // Error state

  const onSubmit = async (data: any) => {
    try {
      setError(null); // Reset error on each submit
      const response = await axios.post("/api/login", data); // API endpoint
      console.log("Login successful", response.data);
      // Redirect or handle success (You can redirect the user to another page here)
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong."); // Handle error
      console.error("Login failed", error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <Card className="w-[22rem] p-2">
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
                name="username"
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
              {error && (
                <div className="text-red-500 text-sm">{error}</div> // Display error message
              )}
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
    </section>
  );
};

export default LoginPage;

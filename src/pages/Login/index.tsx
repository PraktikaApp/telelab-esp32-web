import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
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
import { postWithParams } from "@/lib/pos2esp";

const formSchema = z.object({
  credentials: z.string().min(2, {
    message: "Credentials must be at least 2 characters.",
  }),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const API_URL: string = import.meta.env.VITE_PUBLIC_API_URL;
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    const credentials = localStorage.getItem("credentials");
    const module_num = localStorage.getItem("module_num");
    if (credentials) {
      navigate(`/module/${module_num}`);
    }
  }, [navigate]);

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const showToast = (
    variant: "default" | "destructive",
    title: string,
    description: string
  ) => {
    toast({ variant, title, description });
  };

  const onSubmit = async (data: any) => {
    try {
      const { data: authResponse } = await axios.post(
        `${API_URL}auth/authenticate`,
        data
      );
      console.log(data);
      const { module_num, credentials } = authResponse.data;
      await postWithParams("/set_module", {
        num_module: module_num,
      });
      saveToLocalStorage("credentials", credentials);
      saveToLocalStorage("module_num", module_num);

      showToast(
        "default",
        "Login Successful",
        "You have successfully logged in."
      );
      navigate(`/module/${module_num}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      showToast("destructive", "Invalid Credentials", errorMessage);
    }
  };

  return (
    <section className="flex flex-col items-center md:justify-center md:mt-0 mt-16  md:min-h-screen relative">
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
                name="credentials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practicum Credentials</FormLabel>
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
              <Button
                type="button"
                className="w-full"
                variant="destructive"
                onClick={() => navigate("/test")}
              >
                Test Module
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

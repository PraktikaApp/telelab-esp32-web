import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  moduleNumber: z.number().min(0).max(5, {
    message: "Module number must be between 0 and 5.",
  }),
  experimentNumber: z.number().min(1, {
    message: "Please select an experiment.",
  }),
});

const modules = [
  { id: 0, name: "Module 0", experiments: [1, 2, 3] },
  { id: 1, name: "Module 1", experiments: [4, 5, 6] },
  { id: 2, name: "Module 2", experiments: [7, 8, 9] },
  { id: 3, name: "Module 3", experiments: [10, 11, 12] },
  { id: 4, name: "Module 4", experiments: [13, 14, 15] },
  { id: 5, name: "Module 5", experiments: [16, 17, 18] },
];

const ModuleSelectPage: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [error, setError] = React.useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      navigate(
        `/experiment?module=${selectedModule}&experiment=${selectedExperiment}`
      );
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong.");
      console.error("Form submission failed", error);
    }
  };

  const selectedModuleData = modules.find(
    (module) => module.id === selectedModule
  );
  const experiments = selectedModuleData ? selectedModuleData.experiments : [];

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <Card className="w-[22rem] p-2">
        <CardHeader className="py-4">
          <h1 className="md:text-2xl text-xl font-bold">
            Welcome to the World of Technology
          </h1>
          <p className="text-xs text-gray-400">
            Select a module and experiment to proceed.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="moduleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Module</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) => {
                          const moduleId = parseInt(value, 10);
                          setSelectedModule(moduleId);
                          setSelectedExperiment(null);
                          field.onChange(moduleId);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem
                              key={module.id}
                              value={module.id.toString()}
                            >
                              {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedModule !== null && (
                <FormField
                  control={form.control}
                  name="experimentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Experiment</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => {
                            const experimentId = parseInt(value, 10);
                            setSelectedExperiment(experimentId);
                            field.onChange(experimentId);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Experiment" />
                          </SelectTrigger>
                          <SelectContent>
                            {experiments.map((experiment) => (
                              <SelectItem
                                key={experiment}
                                value={experiment.toString()}
                              >
                                Experiment {experiment}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-gray-500 text-xs">
          Need help? Please contact the admin.
        </CardFooter>
      </Card>
    </section>
  );
};

export default ModuleSelectPage;

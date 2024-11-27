import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircuitBoard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExperienceController() {
  const [moduleData, setModuleData] = useState<{
    id: number;
    name: string;
    experiments: { id: number; name: string; input: number; output: number }[];
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedModule = localStorage.getItem("module");
    if (storedModule) {
      const moduleData = JSON.parse(storedModule);
      setModuleData(moduleData);
    }
  }, []);

  const handleExperienceClick = (experimentId: number) => {
    navigate(`/experiment?experiment=${experimentId}`);
  };

  if (!moduleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold md:text-5xl">{moduleData.name}</h1>
      <p className="text-xl text-muted-foreground md:text-2xl">
        Module {moduleData.id}
      </p>
      <div className="mt-8 flex h-fit flex-wrap items-center justify-center gap-5 text-sm px-10">
        {moduleData.experiments.map((experience) => (
          <Button
            className="md:w-1/3 w-full"
            variant="secondary"
            key={experience.id}
            onClick={() => handleExperienceClick(experience.id)}
            s
          >
            <CircuitBoard className="mr-2 h-4 w-4" /> {experience.name}
          </Button>
        ))}
        <Button
          className="md:w-1/2 w-full"
          variant="destructive"
          onClick={() => navigate("/test-module")}
        >
          Test Input Output Module
        </Button>
      </div>
    </div>
  );
}

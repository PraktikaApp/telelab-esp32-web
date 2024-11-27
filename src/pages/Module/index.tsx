import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircuitBoard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ModulePage() {
  const { id } = useParams();
  const [moduleData, setModuleData] = useState<{
    id: number;
    name: string;
    experiments: { id: number; title: string }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) {
      localStorage.removeItem("credentials");
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_URL}experiments/${id}`);
          const { data } = response.data;
          setModuleData(data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch module data:", error);
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchModuleData();
    }
  }, [id]);

  const handleExperienceClick = (experimentId: number) => {
    navigate(`/experiment?experiment=${experimentId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!moduleData) {
    return <div>No module data found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen md:h-screen overflow-y-auto mb-10 md:mb-0">
      <h1 className="text-3xl font-semibold md:text-5xl">{moduleData.name}</h1>
      <p className="text-xl text-muted-foreground md:text-2xl">
        Module {moduleData.id}
      </p>
      <div className="mt-8 flex h-fit flex-wrap items-center justify-center gap-5 text-sm px-10">
        {moduleData.experiments.map((experiment) => (
          <Button
            className="md:w-1/3 w-full"
            variant="secondary"
            key={experiment.id}
            onClick={() => handleExperienceClick(experiment.id)}
          >
            <CircuitBoard className="mr-2 h-4 w-4" /> {experiment.title}
          </Button>
        ))}
        <Button
          className="md:w-1/2 w-full"
          variant="destructive"
          onClick={() => navigate("/test")}
        >
          Test Input Output Module
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CirclePower } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export default function TestPage() {
  const [relay, setRelay] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [inputs, setInputs] = useState<number[] | null>(null);

  useEffect(() => {
    const fetchInputs = () => {
      axios
        .get("/input/all")
        .then((response) => {
          const { input } = response.data;
          console.log("Inputs:", input);
          setInputs(input);
        })
        .catch((error) => {
          console.error("Error fetching inputs:", error);
        });
    };

    const interval = setInterval(fetchInputs, 2000);
    fetchInputs();
    return () => clearInterval(interval);
  }, []);

  const handleRelayControl = (relayNumber: number) => {
    const newState = relay[relayNumber] === 1 ? "off" : "on";

    axios({
      method: "post",
      url: "/output/relay/" + relayNumber,
      data: "state=" + newState,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        console.log("Relay", relayNumber, "response:", response.data);
        setRelay((prevState) => {
          const newState = [...prevState];
          newState[relayNumber] = newState[relayNumber] === 1 ? 0 : 1;
          return newState;
        });
        toast({
          title: "Relay status updated",
          description: `Relay ${relayNumber + 1} status updated`,
        });
      })
      .catch((error) => {
        console.error("Relay", relayNumber, "error:", error);
        toast({
          variant: "destructive",
          title: "Error updating relay status",
        });
      });
  };

  return (
    <div className="flex flex-col items-center md:justify-center text-center min-h-screen md:h-screen overflow-y-auto mb-10 md:mb-0">
      <h1 className="text-3xl font-semibold md:text-5xl">Modul IO Tester</h1>
      <p className="text-xl text-muted-foreground md:text-2xl">Praktika APP</p>

      <div className="mt-8 flex h-fit flex-wrap items-center justify-center gap-5 text-sm px-10">
        {relay.map((value, index) => (
          <Button
            className="w-full md:w-1/3"
            variant={value === 1 ? "default" : "secondary"}
            key={index}
            onClick={() => handleRelayControl(index)}
          >
            <CirclePower className="mr-2 h-4 w-4" /> Relay {index + 1} (
            {value ? "ON" : "OFF"})
          </Button>
        ))}
      </div>

      <div className="mt-10 flex h-fit flex-wrap items-center justify-center gap-5 text-sm px-10 mb-20">
        {inputs && inputs.length === 8 ? (
          inputs.map((value, index) => (
            <div
              key={index}
              className={`w-20 h-20 flex items-center justify-center rounded-full text-white text-xl font-bold ${
                value === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {index + 1}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg">Loading...</p>
        )}
      </div>
    </div>
  );
}

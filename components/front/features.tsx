import { Card, CardBody, CardHeader, Grid } from "@nextui-org/react";
import { BrainCircuit, Clock, BarChart3, Users } from "lucide-react";

const features = [
  {
    title: "AI-Powered Interviews",
    description:
      "Our advanced AI conducts initial screenings, asking relevant questions tailored to each role.",
    icon: BrainCircuit,
  },
  {
    title: "Time-Saving",
    description:
      "Automate the initial interview process, freeing up your team's time for final decision-making.",
    icon: Clock,
  },
  {
    title: "Data-Driven Insights",
    description:
      "Get comprehensive analytics on candidate performance and interview effectiveness.",
    icon: BarChart3,
  },
  {
    title: "Improved Candidate Experience",
    description:
      "Provide a seamless, responsive interview process that candidates will appreciate.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center">
        Why Choose AI Interview Pro?
      </h2>
      <Grid.Container gap={4}>
        {features.map((feature, index) => (
          <Grid key={index} xs={12} sm={6}>
            <Card>
              <CardHeader className="flex gap-3">
                <feature.icon size={24} />
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
              </CardHeader>
              <CardBody>
                <p>{feature.description}</p>
              </CardBody>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </section>
  );
}
